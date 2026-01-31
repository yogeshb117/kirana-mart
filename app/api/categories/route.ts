import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { products: true }
            }
        }
    });
    return NextResponse.json(categories);
}
