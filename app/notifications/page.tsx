import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { redirect } from "next/navigation";
import { Bell } from "lucide-react";
import { NotificationList } from "@/components/NotificationList";

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    // Fetch all notifications
    const notifications = await prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    // Mark all as read when visiting the page
    await prisma.notification.updateMany({
        where: { userId: session.user.id, read: false },
        data: { read: true }
    });

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Bell className="h-6 w-6 text-green-600" />
                    Notifications
                </h1>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <NotificationList initialNotifications={notifications.map(n => ({
                        id: n.id,
                        message: n.message,
                        createdAt: n.createdAt.toISOString()
                    }))} />
                </div>
            </div>
        </div>
    );
}
