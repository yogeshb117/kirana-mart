import { CategoryGrid } from '@/components/CategoryGrid';
import { ProductList } from '@/components/ProductList';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({ take: 8 });
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany();
  } catch {
    return [];
  }
}

export default async function Home() {
  const products = await getFeaturedProducts();
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <section>
        <div className="p-4 bg-green-50 mb-4">
          <h1 className="text-2xl font-bold text-green-800">Welcome to Shubh Lakshmi Kirana Mart</h1>
          <p className="text-gray-600">Free delivery within 5KM</p>
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-lg font-bold">Categories / श्रेणियाँ</h2>
        </div>
        <CategoryGrid categories={categories} />
      </section>

      <section className="pb-8">
        <div className="flex items-center justify-between px-4 mb-2">
          <h2 className="text-lg font-bold">Popular Products / लोकप्रिय</h2>
        </div>
        <ProductList products={products} />
      </section>
    </div>
  );
}
