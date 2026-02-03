import { Loader2 } from 'lucide-react';

export default function WishlistLoading() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <span className="text-red-500">❤️</span> My Wishlist
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 flex flex-col h-full border border-gray-100 relative overflow-hidden">
                        <div className="aspect-[4/3] bg-gray-100 rounded-xl mb-4 animate-pulse relative" />
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
                            <div className="h-6 bg-gray-100 rounded animate-pulse w-1/3 mt-2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
