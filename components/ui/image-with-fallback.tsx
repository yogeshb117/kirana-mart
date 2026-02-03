'use client';

import { ComponentProps, useState } from 'react';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageWithFallbackProps extends Omit<ComponentProps<typeof Image>, 'src' | 'alt'> {
    src?: string | null;
    alt?: string;
    fallbackText?: string;
}

export function ImageWithFallback({ src, alt, className, fallbackText, ...props }: ImageWithFallbackProps) {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <div className={cn("flex flex-col items-center justify-center h-full w-full bg-gray-100 text-gray-400", className)}>
                <ImageIcon className="h-6 w-6 mb-1" />
                <span className="text-[10px]">{fallbackText || 'No Image'}</span>
            </div>
        );
    }

    return (
        <div className={cn("relative overflow-hidden w-full h-full", className)}>
            <Image
                src={src}
                alt={alt || 'Product Image'}
                fill
                className="object-cover"
                onError={() => setError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                {...props}
            />
        </div>
    );
}
