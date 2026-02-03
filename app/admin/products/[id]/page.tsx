
import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

interface Props {
    params: { id: string };
}

export default async function EditProductPage({ params }: Props) {
    const [product, categories] = await Promise.all([
        prisma.product.findUnique({ where: { id: params.id } }),
        prisma.category.findMany({ select: { id: true, nameEn: true }, orderBy: { nameEn: 'asc' } })
    ]);

    if (!product) {
        notFound();
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
            <ProductForm categories={categories} product={product} />
        </div>
    );
}
