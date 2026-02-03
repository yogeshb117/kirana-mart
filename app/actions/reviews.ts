'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function addReview(productId: string, rating: number, comment: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { error: 'You must be logged in to review.' };
    }

    try {
        const review = await prisma.review.create({
            data: {
                userId: session.user.id,
                productId,
                rating,
                comment
            }
        });
        revalidatePath(`/product/${productId}`);
        return { success: true, review };
    } catch (error) {
        console.error('Add Review Error:', error);
        return { error: 'Failed to submit review' };
    }
}

export async function getReviews(productId: string) {
    try {
        const reviews = await prisma.review.findMany({
            where: { productId },
            include: {
                user: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return reviews;
    } catch (error) {
        console.error('Get Reviews Error:', error);
        return [];
    }
}
