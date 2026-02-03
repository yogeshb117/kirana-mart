'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Notification {
    id: string;
    message: string;
    read: boolean;
    createdAt: string;
    orderId?: string;
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications);
                setUnreadCount(data.notifications.filter((n: Notification) => !n.read).length);
            }
        } catch (error) {
            console.error('Failed to fetch notifications');
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 5 seconds
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const handleOpen = async () => {
        setIsOpen(!isOpen);
        if (!isOpen && unreadCount > 0) {
            // Mark as read immediately when opening
            try {
                await fetch('/api/notifications', { method: 'PATCH' });
                setUnreadCount(0);
                // Optimistically mark local state as read
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            } catch (e) {
                console.error('Failed to mark read');
            }
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Button variant="ghost" size="icon" onClick={handleOpen} className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white" />
                )}
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                    <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        <Link href="/notifications" onClick={() => setIsOpen(false)} className="text-xs text-green-600 hover:text-green-700 font-medium">
                            View All
                        </Link>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                                No notifications
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {notifications.slice(0, 5).map((notification) => (
                                    <li
                                        key={notification.id}
                                        className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-green-50/50' : ''}`}
                                        onClick={() => {
                                            setIsOpen(false);
                                            const isAdmin = window.location.pathname.startsWith('/admin');
                                            router.push(isAdmin ? '/admin/orders' : '/orders');
                                        }}
                                    >
                                        <p className="text-sm text-gray-800 font-medium">{notification.message}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
