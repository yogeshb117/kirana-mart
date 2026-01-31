import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const vegetables = await prisma.category.create({
        data: {
            nameEn: 'Vegetables',
            nameHi: 'Sabzi',
            image: '/images/veg.png',
            products: {
                create: [
                    { nameEn: 'Potato', nameHi: 'Aloo', price: 20, description: 'Fresh new potato', stock: 100 },
                    { nameEn: 'Onion', nameHi: 'Pyaaz', price: 30, description: 'Nasik onion', stock: 100 },
                    { nameEn: 'Tomato', nameHi: 'Tamatar', price: 40, description: 'Hybrid tomato', stock: 50 },
                    { nameEn: 'Cauliflower', nameHi: 'Gobi', price: 25, description: 'Small piece', stock: 30 },
                ]
            }
        }
    })

    const staples = await prisma.category.create({
        data: {
            nameEn: 'Staples',
            nameHi: 'Rashan',
            image: '/images/staples.png',
            products: {
                create: [
                    { nameEn: 'Rice', nameHi: 'Chawal', price: 50, description: 'Sona masoori 1kg', stock: 500 },
                    { nameEn: 'Wheat Flour', nameHi: 'Atta', price: 35, description: 'Chakki fresh 1kg', stock: 200 },
                    { nameEn: 'Mustard Oil', nameHi: 'Sarso Tel', price: 140, description: 'Kachi Ghani 1L', stock: 50 },
                ]
            }
        }
    })

    const dairy = await prisma.category.create({
        data: {
            nameEn: 'Dairy',
            nameHi: 'Doodh Dahi',
            image: '/images/dairy.png',
            products: {
                create: [
                    { nameEn: 'Milk', nameHi: 'Doodh', price: 26, description: 'Toned Milk 500ml', stock: 50 },
                    { nameEn: 'Curd', nameHi: 'Dahi', price: 30, description: 'Cup 200g', stock: 20 },
                ]
            }
        }
    })

    console.log({ vegetables, staples, dairy })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
