
import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const [product, categories] = await Promise.all([
        prisma.product.findUnique({ where: { id: params.id } }),
        prisma.category.findMany({ select: { id: true, nameEn: true }, orderBy: { nameEn: 'asc' } })
    ]);

    if (!product) {
        notFound();
    }

    const serializedProduct = product ? {
        ...product,
        createdAt: undefined,
        updatedAt: undefined,
        image: product.image ?? undefined,
        nameHi: product.nameHi ?? undefined,
        description: product.description ?? undefined,
    } : null;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
            <ProductForm categories={categories} product={serializedProduct} />
        </div>
    );
}
