import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://shubhlakshmikirana.com'

    // Static Pages
    const staticRoutes = [
        '',
        '/login',
        '/cart',
        '/orders',
        '/profile',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }))

    return [...staticRoutes]
}
