'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderStatusSelectProps {
    orderId: string;
    currentStatus: string;
}

const STATUS_OPTIONS = [
    'PENDING',
    'CONFIRMED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
];

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
    const [status, setStatus] = useState(currentStatus);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === status) return;

        setIsLoading(true);
        setStatus(newStatus); // Optimistic update

        try {
            const res = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update status');
            }

            router.refresh();
        } catch (error: any) {
            console.error('Error updating status:', error);
            setStatus(currentStatus); // Revert on error
            alert(error.message || 'Failed to update status');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="relative flex items-center gap-2">
            <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isLoading}
                className={`appearance-none cursor-pointer px-3 py-1 pr-8 rounded-full text-xs font-bold border outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 disabled:opacity-50 ${getStatusColor(status)}`}
            >
                {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-white text-gray-900">
                        {opt}
                    </option>
                ))}
            </select>
            {isLoading && (
                <div className="absolute right-2 pointer-events-none">
                    <Loader2 className="h-3 w-3 animate-spin text-gray-500" />
                </div>
            )}
        </div>
    );
}
