'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Category {
    id: string;
    nameEn: string;
    nameHi?: string | null;
    _count?: {
        products: number;
    };
}

interface CategorySidebarProps {
    categories: Category[];
    className?: string;
}

export function CategorySidebar({ categories, className }: CategorySidebarProps) {
    const scrollToCategory = (categoryId: string) => {
        const element = document.getElementById(`category-${categoryId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className={cn("w-[240px] hidden lg:block sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pr-4", className)}>
            <h3 className="font-bold text-gray-900 mb-4 px-2">Categories</h3>
            <div className="space-y-1">
                {categories.map((category) => (
                    <Button
                        key={category.id}
                        variant="ghost"
                        className="w-full justify-between hover:bg-green-50 hover:text-green-700 text-gray-600 font-normal"
                        onClick={() => scrollToCategory(category.id)}
                    >
                        <span>{category.nameEn}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {category._count?.products || 0}
                        </span>
                    </Button>
                ))}
            </div>
        </div>
    );
}
