import { prisma } from '@/lib/prisma';
import { CategorySidebar } from '@/components/layout/CategorySidebar';
import { CartSidebar } from '@/components/layout/CartSidebar';
import { ProductAddButton } from '@/components/ProductAddButton';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        where: { stock: { gt: 0 } },
        take: 6, // Show top 6 products per category in the feed
      },
      _count: {
        select: { products: true }
      }
    },
    orderBy: { nameEn: 'asc' }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 3-Column Layout: Sidebar | Feed | Cart */}
      <div className="flex gap-8 relative">

        {/* Left: Category Sidebar (Desktop Only) */}
        <aside className="hidden lg:block w-[240px] flex-shrink-0">
          <CategorySidebar categories={categories} />
        </aside>

        {/* Center: Product Feed */}
        <main className="flex-1 min-w-0 space-y-10">

          {/* Welcome Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-green-600 to-green-500 p-8 text-white shadow-lg mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to Shubh Lakshmi Kirana Mart</h1>
            <p className="text-green-50 opacity-90">Fresh groceries delivered to your doorstep in Jamui.</p>
          </div>

          {/* Category Sections */}
          {categories.map((category) => (
            category.products.length > 0 && (
              <section key={category.id} id={`category-${category.id}`} className="scroll-mt-28">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {category.nameEn}
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {category._count.products}
                    </span>
                  </h2>
                </div>

                {/* Product Grid for this Category */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {category.products.map(product => (
                    <div key={product.id} className="bg-white border hover:border-green-500 transition-colors rounded-xl p-3 flex flex-col h-full group">
                      {/* Simple Product Card (Inline to avoid extra components for now, can extract later) */}
                      <div className="aspect-square relative bg-gray-50 rounded-lg mb-3 overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.nameEn} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100 text-xs">No Image</div>
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1 flex-1">{product.nameEn}</h3>
                      <div className="text-xs text-gray-500 mb-2">{product.unit}</div>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="font-bold text-gray-900">₹{product.price}</div>
                        <ProductAddButton product={product} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          ))}

          {categories.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No products found. Please seed the database.
            </div>
          )}
        </main>

        {/* Right: Cart Sidebar (Desktop Only) */}
        <aside className="hidden xl:block w-[300px] flex-shrink-0">
          <CartSidebar />
        </aside>

      </div>
    </div>
  );
}


