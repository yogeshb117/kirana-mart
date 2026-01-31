import { prisma } from '@/lib/prisma';
import { ProductEditForm } from './product-form';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const product = await prisma.product.findUnique({
        where: { id }
    });

    const categories = await prisma.category.findMany();

    if (!product) {
        return <div className="p-8">Product not found</div>;
    }

    return <ProductEditForm product={product} categories={categories} />;
}
