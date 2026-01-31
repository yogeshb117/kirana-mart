'use client';

import { useCartStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CartSidebar({ className }: { className?: string }) {
    const items = useCartStore((state) => state.items);
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (items.length === 0) {
        return (
            <div className={cn("w-[300px] hidden xl:block sticky top-24 h-fit p-6 bg-white rounded-xl border border-gray-100 shadow-sm text-center", className)}>
                <ShoppingBag className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-sm text-gray-500 mb-6">Looks like you haven't made your choice yet.</p>
            </div>
        );
    }

    return (
        <div className={cn("w-[300px] hidden xl:block sticky top-24 h-fit bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden", className)}>
            <div className="p-4 border-b bg-gray-50">
                <h3 className="font-bold text-gray-900">Cart ({items.length} Items)</h3>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-2 text-sm">
                        <div className="flex-1">
                            <div className="font-medium text-gray-800 line-clamp-1">{item.nameEn}</div>
                            <div className="text-xs text-gray-500">{item.quantity} x ₹{item.price}</div>
                        </div>
                        <div className="font-bold text-gray-900">₹{item.price * item.quantity}</div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t bg-gray-50 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total}</span>
                </div>
                <Link href="/cart" className="block w-full">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        Proceed to Checkout
                    </Button>
                </Link>
            </div>
        </div>
    );
}
