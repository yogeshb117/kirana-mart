'use client';

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { Minus, Plus } from "lucide-react";

interface Product {
    id: string;
    nameEn: string;
    nameHi?: string | null;
    price: number;
    image?: string | null;
    unit?: string | null;
}

export function ProductAddButton({ product, compact = false }: { product: Product; compact?: boolean }) {
    const { items, addItem, removeItem, updateQuantity } = useCartStore();
    const cartItem = items.find((i) => i.id === product.id);
    const quantity = cartItem?.quantity || 0;

    const handleAdd = () => {
        addItem({
            id: product.id,
            nameEn: product.nameEn,
            nameHi: product.nameHi || undefined,
            price: product.price,
            quantity: 1,
            image: product.image || undefined,
            unit: product.unit || undefined,
        });
    };

    const handleIncrement = () => {
        updateQuantity(product.id, quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            updateQuantity(product.id, quantity - 1);
        } else {
            removeItem(product.id);
        }
    };

    if (quantity > 0) {
        return (
            <div className={`flex items-center bg-emerald-50 rounded-lg border border-emerald-200 justify-between px-1 ${compact ? 'h-8 w-24' : 'h-11 w-full'}`}>
                <Button variant="ghost" size="icon" className={`${compact ? 'h-6 w-6' : 'h-8 w-8'} text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100`} onClick={handleDecrement}>
                    <Minus className={`${compact ? 'h-3 w-3' : 'h-4 w-4'}`} />
                </Button>
                <span className={`text-center font-bold text-emerald-700 ${compact ? 'text-sm w-6' : 'text-lg flex-1'}`}>{quantity}</span>
                <Button variant="ghost" size="icon" className={`${compact ? 'h-6 w-6' : 'h-8 w-8'} text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100`} onClick={handleIncrement}>
                    <Plus className={`${compact ? 'h-3 w-3' : 'h-4 w-4'}`} />
                </Button>
            </div>
        );
    }

    return (
        <Button
            variant="outline"
            className={`text-emerald-600 border-emerald-600 hover:bg-emerald-50 uppercase font-bold ${compact ? 'h-8 text-xs px-3' : 'h-11 w-full text-sm px-4'}`}
            onClick={handleAdd}
        >
            {compact ? 'Add' : 'Add to Cart'}
        </Button>
    );
}
