// Simplified Dashboard redirecting to orders for now or showing stats
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const orderCount = await prisma.order.count();
    const productCount = await prisma.product.count();

    // Use SQLite compatible raw query or aggregation
    // prisma.order.aggregate({ _sum: { total: true } }) works in sqlite
    const sales = await prisma.order.aggregate({
        _sum: { total: true }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Orders</h3>
                    <p className="text-3xl font-bold mt-2">{orderCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Products</h3>
                    <p className="text-3xl font-bold mt-2">{productCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Sales</h3>
                    <p className="text-3xl font-bold mt-2">₹{sales._sum.total || 0}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg border">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-bold">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">View All</Link>
                </div>
                <div className="p-4 text-center text-gray-500">
                    (Go to Orders tab for management)
                </div>
            </div>
        </div>
    );
}
