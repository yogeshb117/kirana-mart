
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function promoteToAdmin(phone: string) {
    try {
        const user = await prisma.user.update({
            where: { phone },
            data: { role: 'ADMIN' },
        });
        console.log(`Success! User ${user.name} (${user.phone}) is now an ADMIN.`);
    } catch (error) {
        console.error('Error updating user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Get phone number from command line argument
const phoneArg = process.argv[2];

if (!phoneArg) {
    console.log('Usage: npx tsx scripts/promote-admin.ts <PHONE_NUMBER>');
    process.exit(1);
}

promoteToAdmin(phoneArg);
