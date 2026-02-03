'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const addressSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be exactly 10 digits'),
    details: z.string().min(5, 'Address details required'),
    label: z.string().optional(),
    isDefault: z.coerce.boolean().optional(),
});

export async function addAddress(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    const data = Object.fromEntries(formData.entries());
    const result = addressSchema.safeParse(data);

    if (!result.success) {
        return { error: result.error.flatten().fieldErrors };
    }

    const { name, phone, details, label, isDefault } = result.data;

    try {
        // If setting as default, unset others
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: session.user.id },
                data: { isDefault: false }
            });
        }

        await prisma.address.create({
            data: {
                userId: session.user.id,
                name,
                phone,
                details,
                label,
                isDefault: isDefault || false
            }
        });

        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Add Address Error:', error);
        return { error: 'Failed to add address' };
    }
}

export async function deleteAddress(addressId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    try {
        await prisma.address.delete({
            where: { id: addressId, userId: session.user.id }
        });
        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to delete address' };
    }
}
