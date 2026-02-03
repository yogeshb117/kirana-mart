
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { addAddress, deleteAddress } from '@/app/actions/profile';
import { Trash2, MapPin, Package } from 'lucide-react';
import { AddAddressForm } from '@/components/AddAddressForm';
import { DeleteAddressButton } from '@/components/DeleteAddressButton';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/login');
    }

    // Fetch User Data with Addresses and Orders
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            addresses: { orderBy: { isDefault: 'desc' } },
            orders: {
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: { items: { include: { product: true } } }
            }
        }
    });

    if (!user) return <div>User not found</div>;

    return (
        <div className="container max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>

            {/* Profile Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Personal Details
                </h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="block text-gray-500">Name</span>
                        <span className="font-medium">{user.name || 'Guest User'}</span>
                    </div>
                    <div>
                        <span className="block text-gray-500">Phone</span>
                        <span className="font-medium">{user.phone}</span>
                    </div>
                </div>
            </div>

            {/* Addresses */}
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-emerald-600" /> Saved Addresses
                        </h2>

                        {user.addresses.length === 0 ? (
                            <p className="text-gray-500 italic mb-4">No saved addresses.</p>
                        ) : (
                            <div className="grid gap-4">
                                {user.addresses.map((addr: any) => (
                                    <div key={addr.id} className="border p-4 rounded-lg relative hover:border-emerald-300 transition-colors">
                                        {addr.isDefault && <span className="absolute top-2 right-2 bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">Default</span>}
                                        <p className="font-bold">{addr.label || 'Address'}</p>
                                        <p className="text-sm">{addr.name}, {addr.phone}</p>
                                        <p className="text-sm text-gray-600 mt-1">{addr.details}</p>
                                        <DeleteAddressButton addressId={addr.id} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Address Form */}
                        <div className="mt-6 pt-6 border-t">
                            <h3 className="font-medium mb-3">Add New Address</h3>
                            <AddAddressForm />
                        </div>
                    </div>
                </div>

                {/* Recent Orders Side Widget */}
                <div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Package className="h-5 w-5 text-amber-500" /> Recent Orders
                        </h2>
                        {user.orders.length === 0 ? (
                            <p className="text-gray-500 text-sm">No orders yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {user.orders.map((order: any) => (
                                    <div key={order.id} className="border-b pb-3 last:border-0">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-mono text-xs text-gray-500">#{order.id.slice(-6)}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        <p className="font-bold text-sm">₹{order.total}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Button variant="outline" className="w-full mt-4" asChild>
                            <a href="/orders">View All Orders</a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
