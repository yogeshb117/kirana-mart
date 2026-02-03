export default function ProductLoading() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
                <div className="bg-gray-100 rounded-3xl aspect-square animate-pulse" />
                <div className="space-y-6">
                    <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                    <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 w-1/3 bg-gray-100 rounded animate-pulse" />
                    <div className="h-24 w-full bg-gray-50 rounded animate-pulse" />
                    <div className="flex gap-4 pt-6">
                        <div className="h-12 w-1/3 bg-gray-100 rounded animate-pulse" />
                        <div className="h-12 flex-1 bg-gray-100 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}
