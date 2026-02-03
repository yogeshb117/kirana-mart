import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, TicketPercent } from 'lucide-react';
import { NotificationBell } from '@/components/NotificationBell';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="w-64 bg-white border-r hidden md:block">
                <div className="p-4 font-bold text-xl border-b">Shubh Lakshmi Admin</div>
                <nav className="p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-gray-700">
                        <LayoutDashboard className="h-5 w-5" /> Dashboard
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-gray-700">
                        <ShoppingBag className="h-5 w-5" /> Orders
                    </Link>
                    <Link href="/admin/products" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-gray-700">
                        <Package className="h-5 w-5" /> Inventory
                    </Link>
                    <Link href="/admin/coupons" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-gray-700">
                        <TicketPercent className="h-5 w-5" /> Coupons
                    </Link>
                </nav>
            </aside>
            <main className="flex-1">
                <header className="bg-white shadow-sm border-b p-4 flex justify-end items-center">
                    <NotificationBell />
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
