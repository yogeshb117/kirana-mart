'use client';

import { useState } from 'react';
import { Bell, CheckCircle, Trash2 } from "lucide-react";
import { useRouter } from 'next/navigation';

interface Notification {
    id: string;
    message: string;
    createdAt: string;
}

export function NotificationList({ initialNotifications }: { initialNotifications: Notification[] }) {
    const [notifications, setNotifications] = useState(initialNotifications);
    const router = useRouter();

    const handleDelete = async (id: string) => {
        // Optimistic update
        setNotifications(prev => prev.filter(n => n.id !== id));

        try {
            await fetch('/api/notifications', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            router.refresh();
        } catch (error) {
            console.error('Failed to delete');
            // Revert would be complex without refetching, but failure is rare.
        }
    };

    const handleClearAll = async () => {
        if (!confirm('Are you sure you want to delete all notifications?')) return;
        setNotifications([]);
        try {
            await fetch('/api/notifications', { method: 'DELETE', body: JSON.stringify({}) });
            router.refresh();
        } catch (error) {
            console.error('Failed to clear all');
        }
    }

    if (notifications.length === 0) {
        return (
            <div className="p-12 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
                <p className="text-gray-500">You have no new notifications.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button onClick={handleClearAll} className="text-xs text-red-600 hover:text-red-700 font-medium">
                    Clear All
                </button>
            </div>
            <ul className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                    <li key={notification.id} className="p-4 hover:bg-gray-50 transition-colors group">
                        <div className="flex gap-3 justify-between items-start">
                            <div className="flex gap-3">
                                <div className="mt-1 flex-shrink-0">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(notification.createdAt).toLocaleString('en-IN', {
                                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(notification.id)}
                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                title="Delete notification"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
