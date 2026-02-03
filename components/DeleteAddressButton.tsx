'use client';

import { useState } from 'react';
import { deleteAddress } from '@/app/actions/profile';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function DeleteAddressButton({ addressId }: { addressId: string }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        setLoading(true);
        try {
            const res = await deleteAddress(addressId);
            if (res.error) {
                alert('Failed to delete address');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="text-red-500 text-xs hover:underline flex items-center gap-1 mt-2"
        >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
            Remove
        </button>
    );
}
