import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, Clock, MapPin, ChevronRight } from "lucide-react";

export default async function OrdersPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const orders = await prisma.order.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Package className="h-6 w-6 text-green-600" />
                    My Orders / मेरे ऑर्डर
                </h1>

                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                        <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order: any) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                            >
                                <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex flex-wrap justify-between items-center gap-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="h-4 w-4" />
                                        <time>
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </time>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${order.status === "DELIVERED"
                                                    ? "bg-green-100 text-green-800"
                                                    : order.status === "CANCELLED"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }
                      `}
                                        >
                                            {order.status.toLowerCase()}
                                        </span>
                                        <span className="font-bold text-gray-900">
                                            ₹{order.total.toFixed(0)}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <ul className="divide-y divide-gray-100">
                                        {order.items.map((item: any) => (
                                            <li key={item.id} className="py-2 flex justify-between text-sm">
                                                <div className="flex gap-2">
                                                    <span className="text-gray-500">{item.quantity}x</span>
                                                    <span className="font-medium text-gray-900">
                                                        {item.product.nameEn}
                                                    </span>
                                                </div>
                                                <span className="text-gray-600">₹{item.price * item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {order.slot && (
                                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs text-gray-500">
                                            <span className="mr-2">Delivery Slot:</span>
                                            <span className="font-medium text-gray-700">{order.slot}</span>
                                        </div>
                                    )}
                                    {order.paymentMethod && (
                                        <div className="mt-1 flex items-center text-xs text-gray-500">
                                            <span className="mr-2">Payment:</span>
                                            <span className="font-medium text-gray-700">{order.paymentMethod}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
