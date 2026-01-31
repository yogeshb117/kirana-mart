'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function ProductEditForm({ product, categories }: { product: any, categories: any[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch(`/api/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok && result.success) {
                alert('Product Updated Successfully');
                router.push('/admin/products');
                router.refresh();
            } else {
                alert(`Failed to update: ${result.error || 'Unknown error'}`);
            }
        } catch (e) {
            alert('Error updating product (Network/Server)');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow border">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name (English)</label>
                        <input required name="nameEn" defaultValue={product.nameEn} className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Name (Hindi)</label>
                        <input name="nameHi" defaultValue={product.nameHi || ''} className="w-full border rounded p-2" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select required name="categoryId" defaultValue={product.categoryId} className="w-full border rounded p-2">
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nameEn}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Price (₹)</label>
                        <input required type="number" step="0.01" name="price" defaultValue={product.price} className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Stock</label>
                        <input required type="number" name="stock" defaultValue={product.stock} className="w-full border rounded p-2" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea name="description" defaultValue={product.description || ''} className="w-full border rounded p-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Image URL</label>
                    <input name="image" defaultValue={product.image || ''} className="w-full border rounded p-2" />
                </div>

                <div className="flex gap-2">
                    <Button disabled={loading} type="submit" className="flex-1">
                        {loading ? 'Saving...' : 'Update Product'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
