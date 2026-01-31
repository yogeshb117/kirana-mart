import { prisma } from '@/lib/prisma';
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect';

export const dynamic = 'force-dynamic';

async function getOrders() {
    return await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true, items: { include: { product: true } } }
    });
}

export default async function AdminOrdersPage() {
    const orders = await getOrders();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Orders</h1>

            <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Items</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order: any) => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-mono text-xs">{order.id.slice(-6)}</td>
                                <td className="p-4">
                                    <div className="font-medium">{order.user?.name || 'Guest'}</div>
                                    <div className="text-xs text-gray-500">{order.user?.phone}</div>
                                </td>
                                <td className="p-4">
                                    <ul className="list-disc list-inside text-xs text-gray-600">
                                        {order.items.map((item: any) => (
                                            <li key={item.id}>{item.quantity}x {item.product.nameEn}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="p-4 font-bold">₹{order.total}</td>
                                <td className="p-4">
                                    <OrderStatusSelect
                                        orderId={order.id}
                                        currentStatus={order.status}
                                    />
                                </td>
                                <td className="p-4 text-xs text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">No orders yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
