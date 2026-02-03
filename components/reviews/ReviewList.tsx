'use client';

import { Review } from '@prisma/client';
import { StarRating } from './StarRating';
import { formatDistanceToNow } from 'date-fns';

interface ReviewWithUser extends Review {
    user: { name: string | null };
}

interface ReviewListProps {
    reviews: ReviewWithUser[];
}

export function ReviewList({ reviews }: ReviewListProps) {
    if (reviews.length === 0) {
        return <p className="text-gray-500 italic text-center py-4">No reviews yet. Be the first to review!</p>;
    }

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
        </div>
    );
}
