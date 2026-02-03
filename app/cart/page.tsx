'use client';

import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PaymentSummary } from '@/components/cart/PaymentSummary';

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
    const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details'>('cart');
    const [formData, setFormData] = useState({ name: '', phone: '', address: '', payment: 'COD' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { data: session } = useSession(); // Get session data
    const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);

    // Pre-fill form when session loads or step changes
    useEffect(() => {
        if (session?.user && checkoutStep === 'details') {
            setFormData(prev => ({
                ...prev,
                name: session.user.name || prev.name,
                phone: session.user.phone || prev.phone,
                // We might not have address in session yet, but that's fine
            }));
        }
    }, [session, checkoutStep]);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (formData.phone.length !== 10) {
            alert('Please enter a valid 10-digit phone number');
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                body: JSON.stringify({
                    items: items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })),
                    total: Math.max(0, total() - (coupon?.discount || 0)),
                    paymentMethod: formData.payment,
                    userPhone: formData.phone,
                    userName: formData.name,
                    userAddress: formData.address,
                    slot: 'Today', // Default
                    userId: session?.user?.id, // Pass User ID if logged in
                    couponCode: coupon?.code,
                    discount: coupon?.discount || 0
                })
            });

            if (res.ok) {
                clearCart();
                alert('Order Placed Successfully!');
                router.push('/');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to place order');
            }
        } catch (err) {
            alert('Error placing order');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return <div className="p-8 text-center">Your cart is empty</div>;
    }

    return (
        <div className="container max-w-md mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">{checkoutStep === 'cart' ? 'Shopping Cart' : 'Checkout'}</h1>

            {checkoutStep === 'cart' ? (
                <div className="space-y-4">
                    {items.map(item => (
                        <div key={item.id} className="flex gap-4 border p-3 rounded-lg bg-white">
                            <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                <ImageWithFallback src={item.image || ''} alt={item.nameEn} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-sm">{item.nameEn} <span className="text-xs text-gray-500">({item.unit})</span></h3>
                                <div className="text-sm font-bold mt-1">₹{item.price * item.quantity}</div>
                                <div className="flex items-center gap-2 mt-2">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded bg-gray-100"><Minus className="h-3 w-3" /></button>
                                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded bg-gray-100"><Plus className="h-3 w-3" /></button>
                                    <button onClick={() => removeItem(item.id)} className="ml-auto text-red-500"><Trash2 className="h-4 w-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>₹{total()}</span>
                        </div>
                    </div>

                    <Button className="w-full mt-4" onClick={() => setCheckoutStep('details')}>Proceed to Checkout</Button>
                </div>
            ) : (
                <form onSubmit={handleCheckout} className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
                    {/* ... (address fields same as before) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input required className="w-full border rounded p-2" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <input
                            required
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]{10}"
                            maxLength={10}
                            title="Please enter a valid 10-digit phone number"
                            className="w-full border rounded p-2"
                            value={formData.phone}
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, ''); // Remove non-digits
                                if (val.length <= 10) setFormData({ ...formData, phone: val });
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Delivery Address</label>
                        <textarea required className="w-full border rounded p-2" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Payment Method</label>
                        <select className="w-full border rounded p-2" value={formData.payment} onChange={e => setFormData({ ...formData, payment: e.target.value })}>
                            <option value="COD">Cash on Delivery</option>
                            <option value="UPI">UPI (Pay on Delivery)</option>
                        </select>
                    </div>

                    <PaymentSummary
                        total={total()}
                        currentCoupon={coupon}
                        onApplyCoupon={(discount, code) => setCoupon({ discount, code })}
                        onRemoveCoupon={() => setCoupon(null)}
                    />

                    <div className="flex gap-2 pt-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setCheckoutStep('cart')}>Back</Button>
                        <Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? 'Placing...' : 'Place Order'}</Button>
                    </div>
                </form>
            )}
        </div>
    );
}
