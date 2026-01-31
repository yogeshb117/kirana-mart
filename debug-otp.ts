import { prisma } from './lib/prisma';

async function main() {
    const phone = '8651608881';
    console.log(`Checking user: ${phone}...`);

    try {
        const user = await prisma.user.findUnique({
            where: { phone },
            select: { id: true, phone: true, otp: true, otpExpires: true, role: true }
        });
        console.log('User Record:', user);
    } catch (error) {
        console.error('Error fetching user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
