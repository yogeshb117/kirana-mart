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

export function ProductAddButton({ product }: { product: Product }) {
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
            <div className="flex items-center bg-green-50 rounded-lg border border-green-200">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-700 hover:text-green-800 hover:bg-green-100" onClick={handleDecrement}>
                    <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm font-bold text-green-700">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-700 hover:text-green-800 hover:bg-green-100" onClick={handleIncrement}>
                    <Plus className="h-3 w-3" />
                </Button>
            </div>
        );
    }

    return (
        <Button
            size="sm"
            variant="outline"
            className="text-green-600 border-green-600 hover:bg-green-50 h-8 uppercase text-xs font-bold px-4"
            onClick={handleAdd}
        >
            Add
        </Button>
    );
}
