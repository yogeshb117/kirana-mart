import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Clear existing data
        await prisma.orderItem.deleteMany({});
        await prisma.order.deleteMany({});
        await prisma.product.deleteMany({});
        await prisma.category.deleteMany({});

        // Vegetables
        await prisma.category.create({
            data: {
                nameEn: 'Vegetables',
                nameHi: 'Sabzi',
                image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500&auto=format',
                products: {
                    create: [
                        { nameEn: 'Potato', nameHi: 'Aloo', price: 20, unit: '1 kg', description: 'Fresh new potato', stock: 100, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format' },
                        { nameEn: 'Onion', nameHi: 'Pyaaz', price: 30, unit: '1 kg', description: 'Nasik onion', stock: 100, image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format' },
                        { nameEn: 'Tomato', nameHi: 'Tamatar', price: 40, unit: '1 kg', description: 'Hybrid tomato', stock: 50, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format' },
                    ]
                }
            }
        });
        // Fruits
        await prisma.category.create({
            data: {
                nameEn: 'Fruits',
                nameHi: 'Phal',
                image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&auto=format',
                products: {
                    create: [
                        { nameEn: 'Banana', nameHi: 'Kela', price: 60, unit: '1 Dozen', description: 'Robusta Banana 1 Dozen', stock: 50, image: '/products/banana.png' },
                        { nameEn: 'Apple', nameHi: 'Seb', price: 180, unit: '1 kg', description: 'Kashmiri Apple 1kg', stock: 40, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format' },
                        { nameEn: 'Pomegranate', nameHi: 'Anaar', price: 200, unit: '1 kg', description: 'Fresh Anaar 1kg', stock: 30, image: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=500&auto=format' },
                    ]
                }
            }
        });

        // Staples
        await prisma.category.create({
            data: {
                nameEn: 'Staples',
                nameHi: 'Anaaj & Masale',
                image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format',
                products: {
                    create: [
                        { nameEn: 'Ashirvaad Atta', nameHi: 'Atta', price: 450, unit: '10 kg', description: 'Whole Wheat Flour 10kg', stock: 20, image: '/products/atta.png' },
                        { nameEn: 'Basmati Rice', nameHi: 'Chawal', price: 120, unit: '1 kg', description: 'Premium Basmati 1kg', stock: 50, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format' },
                        { nameEn: 'Toor Dal', nameHi: 'Arhar Dal', price: 160, unit: '1 kg', description: 'Unpolished Dal 1kg', stock: 40, image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72bd?w=500&auto=format' },
                        { nameEn: 'Mustard Oil', nameHi: 'Sarso Tel', price: 150, unit: '1 L', description: 'Kachi Ghani 1L', stock: 60, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format' },
                        { nameEn: 'Salt', nameHi: 'Namak', price: 25, unit: '1 kg', description: 'Iodized Salt 1kg', stock: 100 },
                        { nameEn: 'Sugar', nameHi: 'Cheeni', price: 45, unit: '1 kg', description: 'Sulphur-free Sugar 1kg', stock: 80, image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=500&auto=format' },
                    ]
                }
            }
        });

        // Snacks
        await prisma.category.create({
            data: {
                nameEn: 'Snacks',
                nameHi: 'Namkeen & Biscuits',
                image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500&auto=format',
                products: {
                    create: [
                        { nameEn: 'Maggie Noodles', nameHi: 'Noodles', price: 14, unit: '70 g', description: 'Masala Noodles 70g', stock: 200, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500&auto=format' },
                        { nameEn: 'Marie Gold', nameHi: 'Biscuit', price: 30, unit: '200 g', description: 'Tea time biscuit', stock: 100, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format' },
                        { nameEn: 'Lay\'s Chips', nameHi: 'Chips', price: 20, unit: '50 g', description: 'Classic Salted', stock: 150, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format' },
                    ]
                }
            }
        });

        // Personal Care
        await prisma.category.create({
            data: {
                nameEn: 'Personal Care',
                nameHi: 'Dekh-bhaal',
                image: '/categories/personal_care.png',
                products: {
                    create: [
                        { nameEn: 'Lux Soap', nameHi: 'Sabun', price: 35, unit: '100 g', description: 'Rose & Vitamin E', stock: 100, image: 'https://images.unsplash.com/photo-1626081440263-127e9ffb39ea?w=500&auto=format' },
                        { nameEn: 'Colgate', nameHi: 'Toothpaste', price: 60, unit: '100 g', description: 'Strong Teeth 100g', stock: 80, image: 'https://images.unsplash.com/photo-1559586616-361e18714958?w=500&auto=format' },
                        { nameEn: 'Sunsilk Shampoo', nameHi: 'Shampoo', price: 120, unit: '180 ml', description: 'Black Shine 180ml', stock: 50, image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format' },
                    ]
                }
            }
        });

        return NextResponse.json({ success: true, message: "Seeded successfully" });
    } catch (e) {
        return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
    }
}
