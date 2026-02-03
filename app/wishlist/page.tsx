
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
                <ProductList
                    products={products}
                    showWishlistButton={true}
                    initialWishlistState={true}
                />
            )}
        </div>
    );
}


