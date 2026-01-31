'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/categories').then(res => res.json()).then(setCategories);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // In a real app we'd use a server action or API route
        // For now we will mock or creating a simple generic create API if needed
        // But since we haven't made a create product API yet, let's make a server action or API
        // Let's assume we post to /api/products/create (we need to make this!)

        try {
            const res = await fetch('/api/products/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData) // Use formData state
            });
            if (res.ok) {
                router.push('/admin/products');
                router.refresh();
            } else {
                alert('Failed');
            }
        } catch (e) {
            alert('Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow border">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name (English)</label>
                        <input required name="nameEn" className="w-full border rounded p-2" placeholder="e.g. Potato" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Name (Hindi)</label>
                        <input name="nameHi" className="w-full border rounded p-2" placeholder="e.g. Aloo" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select required name="categoryId" className="w-full border rounded p-2">
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nameEn}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Price (₹)</label>
                        <input required type="number" step="0.01" name="price" className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Unit (e.g., 1kg, 500g)</label>
                        <input type="text" name="unit" className="w-full border rounded p-2" placeholder="1 unit" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Stock</label>
                        <input required type="number" name="stock" className="w-full border rounded p-2" defaultValue={100} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea name="description" className="w-full border rounded p-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Image URL</label>
                    <input name="image" className="w-full border rounded p-2" placeholder="https://..." />
                </div>

                <Button disabled={loading} type="submit" className="w-full">
                    {loading ? 'Saving...' : 'Create Product'}
                </Button>
            </form>
        </div>
    );
}
