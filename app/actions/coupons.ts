'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createCoupon(code: string, type: 'PERCENT' | 'FLAT', value: number, minOrder: number = 0, maxDiscount: number = 0, expiresAt?: Date) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        return { error: 'Unauthorized' };
    }

    try {
        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                type,
                value,
                minOrder,
                maxDiscount: maxDiscount > 0 ? maxDiscount : null,
                expiresAt,
                isActive: true
            }
        });
        revalidatePath('/admin/coupons');
        return { success: true, coupon };
    } catch (error) {
        console.error('Create Coupon Error:', error);
        return { error: 'Failed to create coupon. Code might be duplicate.' };
    }
}

export async function deleteCoupon(id: string) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        return { error: 'Unauthorized' };
    }

    try {
        await prisma.coupon.delete({ where: { id } });
        revalidatePath('/admin/coupons');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to delete coupon' };
    }
}

export async function getCoupons() {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        return [];
    }
    return prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function verifyCoupon(code: string, orderTotal: number) {
    try {
        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!coupon || !coupon.isActive) {
            return { error: 'Invalid or inactive coupon' };
        }

        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return { error: 'Coupon has expired' };
        }

        if (orderTotal < coupon.minOrder) {
            return { error: `Minimum order amount of ₹${coupon.minOrder} required` };
        }

        let discount = 0;
        if (coupon.type === 'PERCENT') {
            discount = (orderTotal * coupon.value) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else {
            discount = coupon.value;
        }

        return { success: true, discount, type: coupon.type, value: coupon.value, code: coupon.code };
    } catch (error) {
        console.error('Verify Coupon Error:', error);
        return { error: 'Failed to apply coupon' };
    }
}
