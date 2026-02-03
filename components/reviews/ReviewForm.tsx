'use client';

import { useState } from 'react';
import { StarRating } from './StarRating';
import { Button } from '@/components/ui/button';
import { addReview } from '@/app/actions/reviews';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ReviewFormProps {
    productId: string;
    onReviewAdded?: () => void;
}

export function ReviewForm({ productId, onReviewAdded }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setLoading(true);
        try {
            const res = await addReview(productId, rating, comment);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success('Review submitted successfully!');
                setRating(0);
                setComment('');
                setIsExpanded(false);
                onReviewAdded?.();
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!isExpanded) {
        return (
            <Button variant="outline" onClick={() => setIsExpanded(true)} className="w-full">
                Write a Review
            </Button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Rating</label>
                <div className="flex gap-2">
                    <StarRating rating={rating} onRatingChange={setRating} size={28} />
                    <span className="text-sm text-gray-500 pt-1">{rating > 0 ? `${rating}/5` : 'Select stars'}</span>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Comment (Optional)</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    rows={3}
                    placeholder="What did you like or dislike?"
                />
            </div>

            <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1 bg-green-700 hover:bg-green-800 text-white">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Review
                </Button>
                <Button type="button" variant="ghost" onClick={() => setIsExpanded(false)} disabled={loading}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
