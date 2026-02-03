'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function toggleWishlist(productId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    const userId = session.user.id;

    try {
        const existing = await prisma.wishlistItem.findUnique({
            where: {
                userId_productId: { userId, productId }
            }
        });

        if (existing) {
            await prisma.wishlistItem.delete({
                where: { id: existing.id }
            });
            revalidatePath('/wishlist');
            return { added: false };
        } else {
            await prisma.wishlistItem.create({
                data: { userId, productId }
            });
            revalidatePath('/wishlist');
            return { added: true };
        }
    } catch (error) {
        console.error('Wishlist Error:', error);
        return { error: 'Failed to update wishlist' };
    }
}

export async function getWishlist() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    try {
        const items = await prisma.wishlistItem.findMany({
            where: { userId: session.user.id },
            include: { product: true },
            orderBy: { createdAt: 'desc' }
        });
        return items;
    } catch (error) {
        console.error('Get Wishlist Error:', error);
        return [];
    }
}

export async function checkWishlistStatus(productId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return false;

    const count = await prisma.wishlistItem.count({
        where: { userId: session.user.id, productId }
    });

    return count > 0;
}
