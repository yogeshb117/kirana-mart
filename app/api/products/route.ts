import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const query = searchParams.get('q');

    const where: any = {};
    if (categoryId) {
        where.categoryId = categoryId;
    }
    if (query) {
        where.OR = [
            { nameEn: { contains: query } }, // removed mode: 'insensitive' for sqlite compatibility if needed, though prisma handles it? SQLite allows it.
            { nameHi: { contains: query } },
        ];
    }

    const products = await prisma.product.findMany({
        where,
        orderBy: { nameEn: 'asc' }
    });

    return NextResponse.json(products);
}
