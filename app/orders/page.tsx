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
                    <div className="space-y-6">
                        {orders.map((order: any) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                            >
                                <div className="p-5 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <Package className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Order ID</div>
                                            <div className="font-mono text-sm font-bold text-gray-900">#{order.id.slice(-6)}</div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1 justify-end">
                                            <Clock className="h-3.5 w-3.5" />
                                            <time>
                                                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </time>
                                        </div>
                                        <div className={`
                                            inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                            ${order.status === "DELIVERED" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                                                order.status === "CANCELLED" ? "bg-red-100 text-red-700 border border-red-200" :
                                                    "bg-amber-100 text-amber-700 border border-amber-200"}
                                        `}>
                                            <span className={`w-2 h-2 rounded-full mr-2 
                                                ${order.status === "DELIVERED" ? "bg-emerald-500" :
                                                    order.status === "CANCELLED" ? "bg-red-500" :
                                                        "bg-amber-500"}
                                            `}></span>
                                            {order.status}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="mb-4">
                                        <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Items</div>
                                        <ul className="space-y-3">
                                            {order.items.map((item: any) => (
                                                <li key={item.id} className="flex justify-between text-sm items-center group-hover:bg-gray-50 p-2 rounded-lg -mx-2 transition-colors">
                                                    <div className="flex gap-3 items-center">
                                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium min-w-[24px] text-center border border-gray-200">
                                                            {item.quantity}x
                                                        </span>
                                                        <span className="font-medium text-gray-800">
                                                            {item.product.nameEn}
                                                        </span>
                                                    </div>
                                                    <span className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-100 bg-gray-50/30 -mx-5 px-5 -mb-5 py-4 gap-4">
                                        <div className="space-y-1">
                                            {order.slot && (
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <span className="w-20 font-medium">Delivery Slot:</span>
                                                    <span className="text-gray-700">{order.slot}</span>
                                                </div>
                                            )}
                                            {order.paymentMethod && (
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <span className="w-20 font-medium">Payment:</span>
                                                    <span className="text-gray-700">{order.paymentMethod}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right w-full sm:w-auto flex justify-between sm:block border-t sm:border-t-0 border-gray-200 pt-3 sm:pt-0">
                                            <div className="text-xs text-gray-500 mb-1">Total Amount</div>
                                            <div className="text-2xl font-bold text-emerald-700">₹{order.total.toFixed(0)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
}
