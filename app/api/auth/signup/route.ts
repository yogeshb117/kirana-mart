import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, phone, password } = await req.json();

        if (!phone || !password) {
            return NextResponse.json(
                { error: "Phone and password are required" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { phone },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists with this phone number" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                phone,
                password: hashedPassword,
                role: "CUSTOMER",
            },
            select: {
                id: true,
                name: true,
                phone: true,
                role: true,
            },
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
