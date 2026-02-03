'use client';

import { useState } from 'react';
import { getReviews } from '@/app/actions/reviews';

import { Review } from '@prisma/client';
import { StarRating } from './StarRating';
import { formatDistanceToNow } from 'date-fns';

interface ReviewWithUser extends Review {
    user: { name: string | null };
}

interface ReviewListProps {
    initialReviews: ReviewWithUser[];
    productId: string;
}

export function ReviewList({ initialReviews, productId }: ReviewListProps) {
    const [reviews, setReviews] = useState<ReviewWithUser[]>(initialReviews);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialReviews.length >= 5);

    if (reviews.length === 0) {
        return <p className="text-gray-500 italic text-center py-4">No reviews yet. Be the first to review!</p>;
    }

    const loadMore = async () => {
        setLoading(true);
        const nextPage = page + 1;
        const newReviews = await getReviews(productId, nextPage, 5);

        if (newReviews.length < 5) {
            setHasMore(false);
        }

        // Cast to any to avoid potential type mismatch if ReviewWithUser definition slightly varies across files, 
        // though strictly they should match. 
        setReviews([...reviews, ...newReviews as any]);
        setPage(nextPage);
        setLoading(false);
    };

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div key={review.id} className="border-b last:border-0 pb-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-800">{review.user.name || 'Anonymous Check'}</span>
                        <span className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                    <StarRating rating={review.rating} readOnly size={14} />
                    {review.comment && (
                        <p className="text-gray-600 text-sm mt-2 leading-relaxed">{review.comment}</p>
                    )}
                </div>
            ))}

            {hasMore && (
                <div className="text-center pt-2">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="text-emerald-600 font-medium hover:text-emerald-700 disabled:opacity-50 text-sm"
                    >
                        {loading ? 'Loading...' : 'Load More Reviews'}
                    </button>
                </div>
            )}
        </div>
    );
}
