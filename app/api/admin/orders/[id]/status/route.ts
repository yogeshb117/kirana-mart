import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const StatusSchema = z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
});

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Params is a Promise in Next.js 15+
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params; // Await params to access id
        const body = await request.json();
        const { status } = StatusSchema.parse(body);

        const order = await prisma.order.update({
            where: { id },
            data: { status }
        });

        // Create Notification for the user
        if (order.userId) {
            await prisma.notification.create({
                data: {
                    userId: order.userId,
                    orderId: order.id,
                    message: `Your order #${order.id.slice(-6)} is now ${status}`,
                }
            });
        }

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
    }
}
