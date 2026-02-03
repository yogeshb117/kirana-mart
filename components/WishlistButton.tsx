'use client';

import { useState } from 'react';
import { toggleWishlist } from '@/app/actions/wishlist';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

interface WishlistButtonProps {
    productId: string;
    initialLiked?: boolean;
}

export function WishlistButton({ productId, initialLiked = false }: WishlistButtonProps) {
    const [liked, setLiked] = useState(initialLiked);
    const [loading, setLoading] = useState(false);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating if inside a Link
        e.stopPropagation();

        setLoading(true);
        // Optimistic update
        setLiked(!liked);

        try {
            const res = await toggleWishlist(productId);
            if (res.error) {
                toast.error(res.error);
                setLiked(liked); // Revert on error
            } else {
                setLiked(res.added || false);
                toast.success(res.added ? 'Added to wishlist' : 'Removed from wishlist');
            }
        } catch (error) {
            console.error(error);
            setLiked(liked); // Revert
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`p-2 rounded-full transition-colors ${liked
                    ? 'text-red-500 bg-red-50 hover:bg-red-100'
                    : 'text-gray-400 bg-gray-100 hover:bg-gray-200 hover:text-red-500'
                }`}
            title={liked ? "Remove from Wishlist" : "Add to Wishlist"}
        >
            <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
        </button>
    );
}
