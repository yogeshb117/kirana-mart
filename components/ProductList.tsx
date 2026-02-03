'use client';

import { ImageWithFallback } from './ui/image-with-fallback';
import Link from 'next/link';
import { Button } from './ui/button';
import { useCartStore } from '@/lib/store';
import { Plus, Minus } from 'lucide-react';

interface Product {
    id: string;
    nameEn: string;
    nameHi?: string | null;
    price: number;
    image?: string | null;
    stock: number;
    unit?: string | null;
}

export function ProductList({ products }: { products: Product[] }) {
    const { items, addItem, updateQuantity } = useCartStore();

    if (products.length === 0) {
        return <div>No products found.</div>;
    }

    const getItemQty = (id: string) => {
        return items.find(i => i.id === id)?.quantity || 0;
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {products.map((product) => {
                const qty = getItemQty(product.id);

                return (
                    <div key={product.id} className="border rounded-lg p-3 bg-white shadow-sm flex flex-col justify-between group">
                        <div>
                            <Link href={`/product/${product.id}`}>
                                <div className="aspect-square bg-gray-100 rounded-md mb-2 overflow-hidden relative">
                                    <ImageWithFallback src={product.image || ''} alt={product.nameEn} />
                                </div>
                            </Link>
                            <Link href={`/product/${product.id}`}>
                                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-green-700 transition-colors">{product.nameEn}</h3>
                            </Link>
                            <p className="text-xs text-gray-500">{product.nameHi}</p>
                            <div className="mt-2 font-bold text-green-700">₹{product.price} <span className="text-xs font-normal text-gray-500">/ {product.unit || 'unit'}</span></div>
                        </div>

                        {qty === 0 ? (
                            <Button
                                onClick={() => addItem(product as any)}
                                size="sm"
                                className="w-full mt-3 bg-green-600 hover:bg-green-700"
                                disabled={product.stock <= 0}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                            </Button>
                        ) : (
                            <div className="flex items-center justify-between w-full mt-3 bg-green-50 rounded border border-green-200 p-1">
                                <button
                                    onClick={() => updateQuantity(product.id, qty - 1)}
                                    className="p-1 rounded bg-white text-green-700 shadow-sm hover:bg-gray-50"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="font-bold text-green-800 text-sm">{qty}</span>
                                <button
                                    onClick={() => updateQuantity(product.id, qty + 1)}
                                    className="p-1 rounded bg-white text-green-700 shadow-sm hover:bg-gray-50"
                                    disabled={qty >= product.stock}
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
