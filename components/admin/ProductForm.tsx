'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createProduct, updateProduct } from '@/app/actions/products';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Category {
    id: string;
    nameEn: string;
}

interface Product {
    id: string;
    nameEn: string;
    nameHi?: string;
    description?: string;
    price: number;
    stock: number;
    unit: string;
    image?: string;
    categoryId: string;
}

interface ProductFormProps {
    categories: Category[];
    product?: Product | null; // If null, it's create mode
}

export function ProductForm({ categories, product }: ProductFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        setError('');

        let result;
        if (product) {
            result = await updateProduct(product.id, formData);
        } else {
            result = await createProduct(formData);
        }

        if (result?.error) {
            if (typeof result.error === 'string') {
                setError(result.error);
            } else {
                // Flatten field errors for simple display
                setError(Object.values(result.error).flat().join(', '));
            }
            setIsLoading(false);
        }
        // If success, server action redirects, so no need to stop loading manually
    };

    return (
        <form action={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-lg border shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Product Name (English)</label>
                    <input
                        name="nameEn"
                        required
                        defaultValue={product?.nameEn}
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Product Name (Hindi)</label>
                    <input
                        name="nameHi"
                        defaultValue={product?.nameHi || ''}
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                    name="description"
                    defaultValue={product?.description || ''}
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Price (₹)</label>
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        required
                        defaultValue={product?.price}
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Stock</label>
                    <input
                        name="stock"
                        type="number"
                        required
                        defaultValue={product?.stock ?? 0}
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                        name="categoryId"
                        required
                        defaultValue={product?.categoryId}
                        className="w-full border rounded-md p-2 bg-white focus:ring-2 focus:ring-green-500 outline-none"
                    >
                        <option value="">Select Category</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.nameEn}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Unit (e.g. 1 kg, 500g)</label>
                    <input
                        name="unit"
                        required
                        defaultValue={product?.unit || '1 unit'}
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                    name="image"
                    type="url"
                    defaultValue={product?.image || ''}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none text-sm text-gray-600"
                />
                <p className="text-xs text-gray-400 mt-1">Paste a URL from Unsplash or similar.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                    {error}
                </div>
            )}

            <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-green-700 hover:bg-green-800 text-white">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {product ? 'Update Product' : 'Create Product'}
                </Button>
            </div>
        </form>
    );
}
