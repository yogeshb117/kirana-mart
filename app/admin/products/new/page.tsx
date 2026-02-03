
import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function NewProductPage() {
    // Fetch categories for the dropdown
    const categories = await prisma.category.findMany({
        select: { id: true, nameEn: true },
        orderBy: { nameEn: 'asc' }
    });

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
            <ProductForm categories={categories} />
        </div>
    );
}
