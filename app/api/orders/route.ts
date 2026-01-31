import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

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
    userPhone: z.string(), // Simple auth for now
    userName: z.string(),
    userAddress: z.string()
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = OrderSchema.parse(body);

        // Find or create user
        let user = await prisma.user.findUnique({
            where: { phone: data.userPhone }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    phone: data.userPhone,
                    name: data.userName,
                    address: data.userAddress,
                    role: 'CUSTOMER'
                }
            });
        } else {
            // Update details if provided
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    name: data.userName,
                    address: data.userAddress
                }
            });
        }

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                total: data.total,
                paymentMethod: data.paymentMethod,
                slot: data.slot,
                items: {
                    create: data.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
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
