import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-emerald-600">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p className="text-gray-500 font-medium animate-pulse">Loading Freshness...</p>
        </div>
    );
}
