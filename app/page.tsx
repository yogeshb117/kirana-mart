import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { CategorySidebar } from '@/components/layout/CategorySidebar';
import { CartSidebar } from '@/components/layout/CartSidebar';
import { ProductAddButton } from '@/components/ProductAddButton';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { WishlistButton } from '@/components/WishlistButton';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await getServerSession(authOptions);

  let wishlistProductIds = new Set<string>();
  if (session?.user?.id) {
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      select: { productId: true }
    });
    wishlistProductIds = new Set(wishlist.map(item => item.productId));
  }

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
      <div className="flex gap-8 relative items-start">

        {/* Left: Category Sidebar (Desktop Only) */}
        <aside className="hidden lg:block w-[260px] flex-shrink-0 sticky top-24">
          <CategorySidebar categories={categories} />
        </aside>

        {/* Center: Product Feed */}
        <main className="flex-1 min-w-0 space-y-12">

          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400 p-10 text-white shadow-xl isolate">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-yellow-400 blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-emerald-300 blur-3xl opacity-20"></div>

            <div className="relative z-10 max-w-2xl">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider uppercase bg-white/20 backdrop-blur-sm rounded-full border border-white/10 text-emerald-50">
                Premium Grocery Delivery
              </span>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 leading-tight tracking-tight">
                Freshness Delivered <br />
                <span className="text-yellow-300">Fast & Pure</span>
              </h1>
              <p className="text-lg text-emerald-50 opacity-90 mb-8 max-w-lg font-light leading-relaxed">
                Experience the finest quality groceries delivered straight to your doorstep in Jamui. Fresh, reliable, and premium.
              </p>
              <Link
                href={categories.length > 0 ? `#category-${categories[0].id}` : '#'}
                className="bg-white text-emerald-700 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:bg-yellow-50 transition-all transform hover:-translate-y-1 inline-block"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Category Sections */}
          {categories.map((category) => (
            category.products.length > 0 && (
              <section key={category.id} id={`category-${category.id}`} className="scroll-mt-28">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
                  <h2 className="text-2xl font-heading font-bold text-gray-800 flex items-center gap-3">
                    {category.nameEn}
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      {category._count.products} ITEMS
                    </span>
                  </h2>
                </div>

                {/* Product Grid for this Category */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {category.products.map(product => (
                    <div key={product.id} className="group bg-white rounded-2xl p-4 flex flex-col h-full border border-gray-100 hover:border-emerald-200 transition-all hover:shadow-lg relative overflow-hidden">

                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                      {/* Image Container */}
                      <Link href={`/product/${product.id}`} className="block">
                        <div className="aspect-[4/3] relative bg-gray-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center p-2 isolate">
                          {/* Wishlist Button - Absolute positioned, so it stays clickable on top if z-index is right */}
                          {/* Note: Nested interactive elements can be tricky. Better to keep Wishlist button outside Link or handle propagation.
                              But visually it's inside. Let's make the wrapper relative and put Link around image only?
                              Or assume WishlistButton handles stopPropagation (which I did adding e.stopPropagation).
                           */}

                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.nameEn}
                              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-gray-300">
                              <span className="text-4xl mb-2">🥬</span>
                              <span className="text-xs">No Image</span>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Wishlist Button - Moved outside Link to avoid nesting constraint issues, but positioned absolutely */}
                      <div className="absolute top-6 right-6 z-20">
                        <WishlistButton productId={product.id} initialLiked={wishlistProductIds.has(product.id)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col relative z-9">
                        <div className="mb-1 text-xs font-medium text-emerald-600 uppercase tracking-wide opacity-70">
                          {category.nameEn}
                        </div>
                        <Link href={`/product/${product.id}`} className="hover:underline decoration-emerald-500">
                          <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                            {product.nameEn}
                          </h3>
                        </Link>
                        <div className="text-sm text-gray-500 mb-4 bg-gray-50 inline-block self-start px-2 py-1 rounded">
                          {product.unit}
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                          <div className="flex flex-col">
                            {/* <span className="text-xs text-gray-400 line-through">₹{product.price + 10}</span> */}
                            <span className="font-heading font-bold text-xl text-gray-900">₹{product.price}</span>
                          </div>
                          <ProductAddButton product={product} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          ))}

          {categories.length === 0 && (
            <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Products Found</h3>
              <p>Please seed the database to see products here.</p>
            </div>
          )}
        </main>

        {/* Right: Cart Sidebar (Desktop Only) */}
        <aside className="hidden xl:block w-[320px] flex-shrink-0 sticky top-24 h-[calc(100vh-8rem)]">
          <CartSidebar />
        </aside>

      </div>
    </div>
  );
}


