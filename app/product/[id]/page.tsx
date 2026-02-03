
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ProductAddButton } from '@/components/ProductAddButton';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { BuyNowButton } from '@/components/BuyNowButton';
import { WishlistButton } from '@/components/WishlistButton';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewList } from '@/components/reviews/ReviewList';
import { StarRating } from '@/components/reviews/StarRating';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkWishlistStatus } from '@/app/actions/wishlist';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function ProductPage(props: Props) {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Fetch product with reviews
    const product = await prisma.product.findUnique({
        where: { id: params.id },
        include: {
            category: true,
            reviews: {
                include: { user: { select: { name: true } } },
                orderBy: { createdAt: 'desc' },
                take: 5
            }
        }
    });

    if (!product) {
        notFound();
    }

    const isWishlisted = await checkWishlistStatus(product.id);

    // Calculate average rating
    const totalRating = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
                {/* Image Section */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 flex items-center justify-center relative aspect-square shadow-sm">
                    <div className="absolute top-4 right-4 z-10">
                        <WishlistButton productId={product.id} initialLiked={isWishlisted} />
                    </div>
                    {product.image ? (
                        <div className="w-full h-full relative">
                            <ImageWithFallback
                                src={product.image}
                                alt={product.nameEn}
                                className="object-contain" // mix-blend-multiply might not work well with next/image unless handled carefully, keeping it clean for now or adding back if transparent
                            />
                        </div>
                    ) : (
                        <div className="text-gray-300 flex flex-col items-center">
                            <span className="text-6xl">🥬</span>
                            <span>No Image</span>
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    <div>
                        <span className="text-emerald-600 font-bold tracking-wide text-sm uppercase bg-emerald-50 px-2 py-1 rounded">
                            {product.category.nameEn}
                        </span>
                        <h1 className="text-4xl font-heading font-bold text-gray-900 mt-2 mb-2">{product.nameEn}</h1>
                        {product.nameHi && <p className="text-xl text-gray-500 font-hindi">{product.nameHi}</p>}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <StarRating rating={Math.round(avgRating)} readOnly size={24} />
                            <span className="font-bold text-lg ml-1">{avgRating.toFixed(1)}</span>
                        </div>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600">{product.reviews.length} reviews</span>
                    </div>

                    <div className="text-3xl font-bold text-gray-900">
                        ₹{product.price}
                        <span className="text-lg font-normal text-gray-500 ml-2">/ {product.unit}</span>
                    </div>

                    <p className="text-gray-600 leading-relaxed text-lg">
                        {product.description || 'No description available for this product.'}
                    </p>

                    <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
                        <div className="w-1/3">
                            <ProductAddButton product={product} />
                        </div>
                        <div className="flex-1">
                            <BuyNowButton product={product} />
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 flex gap-3">
                        <span className="text-xl">🚚</span>
                        <div>
                            <p className="font-bold">Fast Delivery</p>
                            <p>Order now and get it delivered within 2 hours.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="max-w-3xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    Customer Reviews
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {product.reviews.length}
                    </span>
                </h2>

                <div className="mb-8">
                    <ReviewForm productId={product.id} />
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <ReviewList initialReviews={product.reviews} productId={product.id} />
                </div>
            </div>
        </div>
    );
}
