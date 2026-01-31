'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState('');

    useEffect(() => {
        setQuery(searchParams.get('q') || '');
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (query.trim()) {
            params.set('q', query);
        } else {
            params.delete('q');
        }
        router.push(`/search?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="search"
                    placeholder="Search products (e.g. Atta, Dal)..."
                    className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-600 focus:bg-white transition-colors"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
        </form>
    );
}

export function SearchInput() {
    return (
        <Suspense fallback={<div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />}>
            <SearchBar />
        </Suspense>
    );
}
