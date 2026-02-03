
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getWishlist } from '@/app/actions/wishlist';
import { ProductList } from '@/components/ProductList';
import { Navbar } from '@/components/Navbar'; // Assuming we want navbar (or layout provides it)

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/login');
    }

    const wishlistItems = await getWishlist();
    const products = wishlistItems.map(item => item.product);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <span className="text-red-500">❤️</span> My Wishlist
            </h1>

            {products.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
                    <a href="/" className="text-emerald-600 font-bold hover:underline mt-2 inline-block">Start Shopping</a>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* We can re-use ProductGrid logic or just map manually if ProductList is dumb */}
                    {/* ProductList currently doesn't support WishlistButton, so let's render cards manually or update ProductList.
                      For now, I'll update ProductList to be smarter or just copy the card UI here for speed.
                      Actually, let's use ProductList but it won't have the heart icon unless we update it.
                      Better: Copy the card UI code from Home to ensure consistency and add Remove button.
                   */}
                    {products.map(product => (
                        <div key={product.id} className="border rounded-lg p-3 bg-white shadow-sm flex flex-col justify-between">
                            <div className="relative">
                                <img src={product.image || ''} alt={product.nameEn} className="aspect-square object-contain bg-gray-100 rounded-md mb-2" />
                            </div>
                            <h3 className="font-medium text-sm line-clamp-2">{product.nameEn}</h3>
                            <div className="font-bold text-green-700 mt-1">₹{product.price}</div>
                            {/* We can use the WishlistButton here too, it checks state via API but better to pass initialLiked=true */}
                            {/* <WishlistButton productId={product.id} initialLiked={true} /> */}
                        </div>
                    ))}
                </div>
            )}

            {/* 
               Wait, reusing `ProductList` is cleaner if I pass the Liked status.
               But `ProductList` is a Client Component.
               Let's update `ProductList.tsx` to accept an optional `wishlistStatus` map or similar?
               Or just for this page, iterate and render.
            */}
            <div className="mt-8">
                {/* Re-using the home page card style for consistency */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="group bg-white rounded-2xl p-4 flex flex-col h-full border border-gray-100 hover:border-emerald-200 transition-all hover:shadow-lg relative overflow-hidden">
                            <div className="aspect-[4/3] relative bg-gray-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center p-2 isolate">
                                {/* Always liked in wishlist page */}
                                <div className="absolute top-2 right-2 z-20">
                                    {/* We need to import WishlistButton. Since this file is a Server Component, we can client render the button */}
                                    <ClientWishlistButton productId={product.id} initialLiked={true} />
                                </div>
                                <img src={product.image || ''} className="w-full h-full object-contain" />
                            </div>
                            <h3 className="font-bold text-gray-900 line-clamp-2">{product.nameEn}</h3>
                            <div className="font-bold text-xl text-gray-900 mt-2">₹{product.price}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

import { WishlistButton as ClientWishlistButton } from '@/components/WishlistButton';
