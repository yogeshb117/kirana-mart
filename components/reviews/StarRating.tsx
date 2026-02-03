'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number; // 0 to 5
    maxRating?: number;
    onRatingChange?: (rating: number) => void;
    size?: number;
    readOnly?: boolean;
}

export function StarRating({
    rating,
    maxRating = 5,
    onRatingChange,
    size = 20,
    readOnly = false
}: StarRatingProps) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: maxRating }).map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= rating;

                return (
                    <button
                        key={index}
                        type="button"
                        disabled={readOnly}
                        onClick={() => !readOnly && onRatingChange?.(starValue)}
                        className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
                    >
                        <Star
                            size={size}
                            className={`${isFilled ? 'fill-yellow-400 text-yellow-500' : 'text-gray-300'}`}
                        />
                    </button>
                );
            })}
        </div>
    );
}
