import { prisma } from '@/lib/prisma';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getProducts() {
    return await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' }
    });
}

export default async function InventoryPage() {
    const products = await getProducts();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Inventory</h1>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Hindi Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product: any) => (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                                            <ImageWithFallback src={product.image || ''} alt={product.nameEn} />
                                        </div>
                                        {product.nameEn}
                                    </div>
                                </td>
                                <td className="p-4 text-gray-500">{product.nameHi || '-'}</td>
                                <td className="p-4">{product.category.nameEn}</td>
                                <td className="p-4">₹{product.price}</td>
                                <td className="p-4">{product.stock}</td>
                                <td className="p-4">
                                    <Link href={`/admin/products/${product.id}`} className="text-blue-600 hover:underline text-xs">
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">No products found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
