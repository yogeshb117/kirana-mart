import { Package } from "lucide-react";

export default function OrdersLoading() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Package className="h-6 w-6 text-green-600" />
                    My Orders / मेरे ऑर्डर
                </h1>

                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Header Skeleton */}
                            <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                                    <div className="space-y-2">
                                        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-2 flex flex-col items-end">
                                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
                                </div>
                            </div>

                            {/* Body Skeleton */}
                            <div className="p-5">
                                <div className="space-y-3 mb-6">
                                    <div className="h-3 w-12 bg-gray-200 rounded animate-pulse mb-2" />
                                    {[1, 2].map((j) => (
                                        <div key={j} className="flex justify-between items-center">
                                            <div className="flex gap-3 items-center w-full">
                                                <div className="h-5 w-8 bg-gray-200 rounded animate-pulse" />
                                                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                                            </div>
                                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <div className="space-y-2">
                                        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                    <div className="text-right">
                                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-1 ml-auto" />
                                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse ml-auto" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
