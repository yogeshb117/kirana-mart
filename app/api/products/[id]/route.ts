import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const product = await prisma.product.findUnique({
            where: { id }
        });
        return NextResponse.json(product);
    } catch (e) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const { nameEn, nameHi, categoryId, price, stock, description, image, unit } = await request.json();

        const product = await prisma.product.update({
            where: { id: params.id },
            data: {
                nameEn,
                nameHi,
                categoryId,
                price: parseFloat(price),
                stock: parseInt(stock),
                description,
                image,
                unit
            }
        });

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update'
        }, { status: 500 });
    }
}
