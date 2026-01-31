import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { nameEn, nameHi, categoryId, price, stock, description, image, unit } = await request.json();

        const product = await prisma.product.create({
            data: {
                nameEn,
                nameHi,
                categoryId,
                price: parseFloat(price),
                stock: parseInt(stock),
                description,
                image,
                unit: unit || '1 unit'
            }
        });

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: 'Failed to create' }, { status: 500 });
    }
}
