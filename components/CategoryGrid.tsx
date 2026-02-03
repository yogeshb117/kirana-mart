'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export function CategoryGrid({ categories }: { categories: any[] }) {
    if (categories.length === 0) {
        return <div className="p-4 text-center text-gray-500">No categories found. Try seeding data.</div>;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {categories.map((cat: any) => (
                <CategoryCard key={cat.id} category={cat} />
            ))}
        </div>
    );
}

function CategoryCard({ category }: { category: any }) {
    const [imageError, setImageError] = useState(false);

    return (
        <Link
            href={`/search?categoryId=${category.id}`}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md"
        >
            <div className="aspect-square w-full relative mb-2 bg-gray-100 rounded-md overflow-hidden">
                {!imageError && category.image ? (
                    <Image
                        src={category.image}
                        alt={category.nameEn}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-200">
                        <span className="text-2xl">📷</span>
                        <span className="text-xs mt-1">No Image</span>
                    </div>
                )}
            </div>
            <span className="font-medium text-center">{category.nameEn}</span>
            <span className="text-xs text-gray-500">{category.nameHi}</span>
        </Link>
    );
}
