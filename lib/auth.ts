import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "OTP",
            credentials: {
                phone: { label: "Phone Number", type: "text", placeholder: "9876543210" },
                otp: { label: "OTP", type: "text" },
            },
            async authorize(credentials) {
                console.log("Authorize called with:", credentials);
                if (!credentials?.phone || !credentials?.otp) {
                    throw new Error("Missing phone or OTP");
                }

                const user = await prisma.user.findUnique({
                    where: { phone: credentials.phone },
                });

                if (!user) {
                    throw new Error("User not found. Please request OTP again.");
                }

                if (!user.otp || !user.otpExpires) {
                    console.log("Auth Fail: No OTP/Expires on user", user.id);
                    throw new Error("No OTP requested or OTP expired");
                }

                if (new Date() > user.otpExpires) {
                    console.log("Auth Fail: OTP Expired", user.otpExpires);
                    throw new Error("OTP Expired. Please request a new one.");
                }

                if (user.otp !== credentials.otp) {
                    console.log("Auth Fail: Invalid OTP", { input: credentials.otp, stored: user.otp });
                    throw new Error("Invalid OTP");
                }

                // OTP Verified. Clear it.
                await prisma.user.update({
                    where: { id: user.id },
                    data: { otp: null, otpExpires: null }
                });

                return {
                    id: user.id,
                    name: user.name,
                    email: null,
                    phone: user.phone,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.phone = token.phone as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.phone = (user as any).email; // Using email field as phone
            }
            return token;
        },
    },
};
