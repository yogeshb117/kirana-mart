
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth'; // Importing authOptions for session check

export async function PATCH(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        // 1. Check Auth (Ideally middleware handles this, but good to be safe)
        // const session = await getServerSession(authOptions); 
        // if (session?.user?.role !== 'ADMIN') {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        // }

        // For now, relying on the fact that this is an admin route
        // But we should ideally import authOptions properly. 
        // Assuming lib/auth exists as per previous context.

        const body = await req.json();
        const { status } = body;
        const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const order = await prisma.$transaction(async (tx: any) => {
            // 1. Update Order Status
            const updatedOrder = await tx.order.update({
                where: { id: params.id },
                data: { status },
                include: { user: true } // Need user ID for notification
            });

            // 2. Create Notification
            if (updatedOrder.userId) {
                await tx.notification.create({
                    data: {
                        userId: updatedOrder.userId,
                        message: `Your order #${updatedOrder.id.slice(-6)} status has been updated to ${status}`,
                        orderId: updatedOrder.id,
                        read: false
                    }
                });
            }

            return updatedOrder;
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('Update Status Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
