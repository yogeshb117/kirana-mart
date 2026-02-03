
import { prisma } from '@/lib/prisma';
import { ProductList } from '@/components/ProductList';
import Link from 'next/link';
import { ArrowLeft, Filter } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
        category?: string;
        minPrice?: string;
        maxPrice?: string;
        sort?: string;
    }>;
}

export default async function SearchPage(props: SearchPageProps) {
    const searchParams = await props.searchParams;
    const query = searchParams.q || '';
    const categoryId = searchParams.category;
    const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
    const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
    const sort = searchParams.sort || 'relevance';

    const where: any = {
        AND: [
            query ? {
                OR: [
                    { nameEn: { contains: query } }, // Remove mode: 'insensitive' for SQLite compatibility if needed, but usually safe to omit if unsure. Let's try to be basic first.
                    { nameHi: { contains: query } },
                    { description: { contains: query } },
                ]
            } : {},
            categoryId ? { categoryId } : {},
            minPrice !== undefined ? { price: { gte: minPrice } } : {},
            maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
        ]
    };

    const orderBy: any = {};
    if (sort === 'price_asc') orderBy.price = 'asc';
    else if (sort === 'price_desc') orderBy.price = 'desc';
    else orderBy.createdAt = 'desc'; // Default newest

    const products = await prisma.product.findMany({
        where,
        orderBy,
        include: {
            category: true // Include category if needed, ProductList doesn't seem to explicitly need it but good for validation
        }
    });

    const categories = await prisma.category.findMany();

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {query ? `Results for "${query}"` : 'All Products'}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {products.length} {products.length === 1 ? 'result' : 'results'} found
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar (Simple Version) */}
                <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
                    {/* Categories */}
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Filter className="h-4 w-4" /> Filters
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">Category</label>
                                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                    <Link
                                        href={`/search?q=${query}`}
                                        className={`block text-sm px-2 py-1 rounded ${!categoryId ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        All Categories
                                    </Link>
                                    {categories.map(c => (
                                        <Link
                                            key={c.id}
                                            href={`/search?q=${query}&category=${c.id}`}
                                            className={`block text-sm px-2 py-1 rounded ${categoryId === c.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {c.nameEn}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Price Sort */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">Sort By</label>
                                <select
                                    className="w-full p-2 border rounded-lg text-sm bg-gray-50"
                                    defaultValue={sort}
                                // We need client side navigation for this select, or just links. 
                                // Since this is a server component, standard links are better or a client component wrapper.
                                // For MVP, I'll make this simpler: Links.
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                </select>
                                {/* NOTE: Select won't work without client JS to onChange. 
                                 I'll replace with simple links for now or creating a client component filter.
                             */}
                                <div className="flex flex-col gap-1 mt-2">
                                    <Link href={`/search?q=${query}&category=${categoryId || ''}&sort=price_asc`} className={`text-sm ${sort === 'price_asc' ? 'text-emerald-600 font-bold' : 'text-gray-500'}`}>Price: Low to High</Link>
                                    <Link href={`/search?q=${query}&category=${categoryId || ''}&sort=price_desc`} className={`text-sm ${sort === 'price_desc' ? 'text-emerald-600 font-bold' : 'text-gray-500'}`}>Price: High to Low</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Results Grid */}
                <main className="flex-1">
                    {products.length > 0 ? (
                        <ProductList products={products} />
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 text-lg">No products found matching "{query}".</p>
                            <Link href="/" className="text-emerald-600 font-medium hover:underline mt-2 inline-block">
                                Browse all categories
                            </Link>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
