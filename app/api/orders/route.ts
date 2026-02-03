import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

const OrderSchema = z.object({
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().min(1),
        price: z.number()
    })),
    total: z.number(),
    paymentMethod: z.enum(['COD', 'UPI']),
    slot: z.string().optional(),
    userPhone: z.string(),
    userName: z.string(),
    userAddress: z.string(),
    userId: z.string().optional(),
    couponCode: z.string().optional(),
    discount: z.number().optional()
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = OrderSchema.parse(body);

        // Verify coupon integrity if provided
        if (data.couponCode && data.discount) {
            const coupon = await prisma.coupon.findUnique({
                where: { code: data.couponCode }
            });
            // We could do stricter validation here if needed
        }

        let userId = data.userId;

        const order = await prisma.$transaction(async (tx: any) => {
            // 1. Check Stock for all items FIRST
            for (const item of data.items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId }
                });

                if (!product) {
                    throw new Error(`Product not found: ${item.productId}`);
                }

                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for "${product.nameEn}". Only ${product.stock} left.`);
                }
            }

            // 2. Handle User (using tx)
            if (!userId) {
                // Fallback: Find or create by phone
                let user = await tx.user.findUnique({
                    where: { phone: data.userPhone }
                });

                if (!user) {
                    user = await tx.user.create({
                        data: {
                            phone: data.userPhone,
                            name: data.userName,
                            address: data.userAddress,
                            role: 'CUSTOMER'
                        }
                    });
                } else {
                    // Update details
                    await tx.user.update({
                        where: { id: user.id },
                        data: {
                            name: data.userName,
                            address: data.userAddress
                        }
                    });
                }
                userId = user.id;
            } else {
                // Update existing user details if userId was passed
                await tx.user.update({
                    where: { id: userId },
                    data: {
                        name: data.userName,
                        address: data.userAddress
                    }
                });
            }

            // 3. Create Order
            const newOrder = await tx.order.create({
                data: {
                    userId: userId,
                    total: data.total,
                    paymentMethod: data.paymentMethod,
                    slot: data.slot,
                    couponCode: data.couponCode,
                    discount: data.discount || 0,
                    items: {
                        create: data.items.map((item: any) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                }
            });

            // 4. Decrement Stock
            for (const item of data.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            // 5. Notify Admins
            const admins = await tx.user.findMany({
                where: { role: 'ADMIN' },
                select: { id: true }
            });

            if (admins.length > 0) {
                await tx.notification.createMany({
                    data: admins.map((admin: any) => ({
                        userId: admin.id,
                        message: `New Order #${newOrder.id.slice(-6)} placed by ${data.userName} for ₹${data.total}`,
                        orderId: newOrder.id,
                        read: false
                    }))
                });
            }

            return newOrder;
        });

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (error: any) {
        console.error('Order creation error:', error);

        let errorMessage = 'Failed to place order';
        if (error.code === 'P2003') { // Foreign key constraint failed
            errorMessage = 'Some items in your cart are no longer available. Please clear your cart and try again.';
        } else if (error instanceof z.ZodError) {
            errorMessage = 'Invalid data provided';
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }
}
