'use client';

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

interface Product {
    id: string;
    nameEn: string;
    nameHi?: string | null;
    price: number;
    image?: string | null;
    unit?: string | null;
}

export function BuyNowButton({ product }: { product: Product }) {
    const { items, addItem } = useCartStore();
    const router = useRouter();

    const handleBuyNow = () => {
        const existing = items.find((i) => i.id === product.id);
        if (!existing) {
            addItem({
                id: product.id,
                nameEn: product.nameEn,
                nameHi: product.nameHi || undefined,
                price: product.price,
                quantity: 1,
                image: product.image || undefined,
                unit: product.unit || undefined,
            });
        }
        router.push('/cart');
    };

    return (
        <Button
            onClick={handleBuyNow}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md hover:shadow-lg transition-all"
            size="lg"
        >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Buy Now
        </Button>
    );
}
