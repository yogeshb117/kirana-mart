'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
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
        <img
            src={src}
            alt={alt}
            className={cn("object-cover w-full h-full", className)}
            onError={() => setError(true)}
            {...props}
        />
    );
}
