import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();

        if (!phone || phone.length !== 10) {
            return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
        }

        // Generate 6 digit OTP (FIXED FOR DEMO)
        const otp = "123456"; // Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

        // Check if user exists, if not calculate "Connect" logic later
        // For now, we just upsert the user or update the OTP if they exist?
        // Actually, we should probably just store OTP on the user record.
        // If user doesn't exist, we can't store OTP on them without creating them.
        // STRATEGY: Create the user immediately with a temporary flag? 
        // OR: Just create them as "CUSTOMER" but with no name/address? YES.

        await prisma.user.upsert({
            where: { phone },
            update: {
                otp,
                otpExpires,
            },
            create: {
                phone,
                otp,
                otpExpires,
                role: "CUSTOMER", // Default role
            },
        });

        console.log(`===============================================`);
        console.log(`🔐 OTP for ${phone}: ${otp}`);
        console.log(`===============================================`);

        return NextResponse.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
    }
}
