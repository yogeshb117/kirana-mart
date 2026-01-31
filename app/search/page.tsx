import { prisma } from '@/lib/prisma';
import { ProductList } from '@/components/ProductList';
import { SearchInput } from '@/components/SearchInput';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { categoryId, q } = await searchParams;

    const where: any = {};
    if (categoryId && typeof categoryId === 'string') {
        where.categoryId = categoryId;
    }
    if (q && typeof q === 'string') {
        where.OR = [
            { nameEn: { contains: q } },
            { nameHi: { contains: q } },
        ];
    }

    const products = await prisma.product.findMany({
        where,
    });

    return (
        <div className="container mx-auto pb-20">
            <div className="p-4 bg-white border-b sticky top-16 z-10 space-y-3">
                <SearchInput />
                <div className="flex justify-between items-center">
                    <h1 className="font-bold text-sm text-gray-700">
                        {q ? `Results for "${q}"` : (categoryId ? 'Category Products' : 'All Products')}
                    </h1>
                    <span className="text-xs text-gray-500">{products.length} items</span>
                </div>
            </div>
            <ProductList products={products} />
        </div>
    );
}
