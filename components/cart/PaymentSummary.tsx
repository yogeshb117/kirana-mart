'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { verifyCoupon } from '@/app/actions/coupons';
import { Loader2, TicketPercent, X } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentSummaryProps {
    total: number;
    onApplyCoupon: (discount: number, code: string) => void;
    onRemoveCoupon: () => void;
    currentCoupon?: { code: string; discount: number } | null;
}

export function PaymentSummary({ total, onApplyCoupon, onRemoveCoupon, currentCoupon }: PaymentSummaryProps) {
    const [couponCode, setCouponCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleApply = async () => {
        if (!couponCode) return;
        setLoading(true);
        const res = await verifyCoupon(couponCode, total);
        setLoading(false);

        if (res.error) {
            toast.error(res.error);
        } else if (res.success) {
            toast.success(`Coupon applied: ${res.code}`);
            onApplyCoupon(res.discount!, res.code!);
            setCouponCode('');
        }
    };

    const finalTotal = Math.max(0, total - (currentCoupon?.discount || 0));

    return (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-bold text-gray-900 border-b pb-2">Payment Details</h3>

            {!currentCoupon ? (
                <div className="flex gap-2">
                    <input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter Coupon Code"
                        className="flex-1 border rounded px-3 py-2 text-sm uppercase"
                    />
                    <Button onClick={handleApply} disabled={loading || !couponCode} size="sm" variant="outline">
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Apply'}
                    </Button>
                </div>
            ) : (
                <div className="flex items-center justify-between bg-green-100 text-green-800 p-2 rounded text-sm px-3 border border-green-200">
                    <div className="flex items-center gap-2">
                        <TicketPercent className="h-4 w-4" />
                        <span className="font-bold">{currentCoupon.code} Applied</span>
                    </div>
                    <button onClick={onRemoveCoupon} className="hover:bg-green-200 p-1 rounded">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
                {currentCoupon && (
                    <div className="flex justify-between text-green-600 font-medium">
                        <span>Discount ({currentCoupon.code})</span>
                        <span>- ₹{currentCoupon.discount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between text-gray-900 font-bold text-lg border-t pt-2">
                    <span>Total Pay</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
