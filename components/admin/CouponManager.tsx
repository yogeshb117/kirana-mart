'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createCoupon, deleteCoupon } from '@/app/actions/coupons';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';
import { Coupon } from '@prisma/client';

export function CouponManager({ initialCoupons }: { initialCoupons: Coupon[] }) {
    const [coupons, setCoupons] = useState(initialCoupons);
    const [code, setCode] = useState('');
    const [type, setType] = useState<'PERCENT' | 'FLAT'>('PERCENT');
    const [value, setValue] = useState(0);
    const [minOrder, setMinOrder] = useState(0);
    const [maxDiscount, setMaxDiscount] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await createCoupon(code, type, Number(value), Number(minOrder), Number(maxDiscount));
            if (result.error) {
                toast.error(result.error);
            } else if (result.coupon) {
                setCoupons([result.coupon as Coupon, ...coupons]);
                toast.success('Coupon created');
                setCode('');
                setValue(0);
                setMinOrder(0);
                setMaxDiscount(0);
            }
        } catch (error) {
            toast.error('Failed to create coupon');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this coupon?')) return;

        try {
            const result = await deleteCoupon(id);
            if (result.success) {
                setCoupons(coupons.filter(c => c.id !== id));
                toast.success('Coupon deleted');
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="space-y-8">
            {/* Create Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-bold mb-4">Create New Coupon</h2>
                <form onSubmit={handleCreate} className="grid md:grid-cols-6 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium mb-1">Code</label>
                        <input
                            required
                            value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                            className="w-full border p-2 rounded uppercase"
                            placeholder="SUMMER50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <select
                            value={type} onChange={(e) => setType(e.target.value as any)}
                            className="w-full border p-2 rounded"
                        >
                            <option value="PERCENT">Percentage (%)</option>
                            <option value="FLAT">Flat Amount (₹)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Value</label>
                        <input
                            type="number" required min="1"
                            value={value} onChange={e => setValue(Number(e.target.value))}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Min Order</label>
                        <input
                            type="number" min="0"
                            value={minOrder} onChange={e => setMinOrder(Number(e.target.value))}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Max Discount</label>
                        <input
                            type="number" min="0" placeholder="Optional"
                            value={maxDiscount} onChange={e => setMaxDiscount(Number(e.target.value))}
                            className="w-full border p-2 rounded"
                            disabled={type !== 'PERCENT'}
                        />
                    </div>
                    <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Create'}
                    </Button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-medium border-b">
                        <tr>
                            <th className="p-4">Code</th>
                            <th className="p-4">Discount</th>
                            <th className="p-4">Min Order</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {coupons.map(coupon => (
                            <tr key={coupon.id} className="hover:bg-gray-50">
                                <td className="p-4 font-bold font-mono">{coupon.code}</td>
                                <td className="p-4">
                                    {coupon.type === 'PERCENT' ? `${coupon.value}% OFF` : `₹${coupon.value} FLAT`}
                                    {coupon.maxDiscount && <div className="text-xs text-gray-500">Max ₹{coupon.maxDiscount}</div>}
                                </td>
                                <td className="p-4">₹{coupon.minOrder}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {coupon.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon.id)} className="text-red-500 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {coupons.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">No coupons created yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
