'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const productSchema = z.object({
    nameEn: z.string().min(1, 'Name is required'),
    nameHi: z.string().optional(),
    categoryId: z.string().min(1, 'Category is required'),
    price: z.coerce.number().min(0, 'Price must be positive'),
    stock: z.coerce.number().int().min(0, 'Stock must be positive'),
    unit: z.string().default('1 unit'),
    image: z.string().url().optional().or(z.literal('')),
    description: z.string().optional(),
});

export async function createProduct(formData: FormData) {
    const data = Object.fromEntries(formData.entries());

    const result = productSchema.safeParse(data);

    if (!result.success) {
        return { error: result.error.flatten().fieldErrors };
    }

    const { nameEn, nameHi, categoryId, price, stock, unit, image, description } = result.data;

    try {
        await prisma.product.create({
            data: {
                nameEn,
                nameHi,
                categoryId,
                price,
                stock,
                unit,
                image: image || null,
                description,
            },
        });
    } catch (error) {
        console.error('Create Product Error:', error);
        return { error: 'Failed to create product. Database error.' };
    }

    revalidatePath('/admin/products');
    revalidatePath('/'); // Update homepage
    redirect('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const result = productSchema.safeParse(data);

    if (!result.success) {
        return { error: result.error.flatten().fieldErrors };
    }

    const { nameEn, nameHi, categoryId, price, stock, unit, image, description } = result.data;

    try {
        await prisma.product.update({
            where: { id },
            data: {
                nameEn,
                nameHi,
                categoryId,
                price,
                stock,
                unit,
                image: image || null,
                description,
            },
        });
    } catch (error) {
        console.error('Update Product Error:', error);
        return { error: 'Failed to update product.' };
    }

    revalidatePath('/admin/products');
    revalidatePath('/');
    redirect('/admin/products');
}
