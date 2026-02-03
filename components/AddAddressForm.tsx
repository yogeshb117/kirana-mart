'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { addAddress } from '@/app/actions/profile';
import { Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export function AddAddressForm() {
    const [loading, setLoading] = useState(false);
    const [detecting, setDetecting] = useState(false);

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                    const data = await res.json();

                    if (data && data.address) {
                        const addr = data.address;
                        (document.getElementsByName('house')[0] as HTMLInputElement).value = addr.house_number || '';
                        (document.getElementsByName('street')[0] as HTMLInputElement).value = addr.road || addr.suburb || '';
                        (document.getElementsByName('pincode')[0] as HTMLInputElement).value = addr.postcode || '';
                        (document.getElementsByName('city')[0] as HTMLInputElement).value = addr.city || addr.town || addr.village || '';
                        (document.getElementsByName('landmark')[0] as HTMLInputElement).value = addr.neighbourhood || '';
                    }
                } catch (error) {
                    console.error('Error fetching address:', error);
                    alert('Failed to detect location address');
                } finally {
                    setDetecting(false);
                }
            },
            (error) => {
                console.error('Error getting location:', error);
                setDetecting(false);
                alert('Unable to retrieve your location');
            }
        );
    };

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);

        // Combine address fields
        const house = formData.get('house') as string || '';
        const street = formData.get('street') as string || '';
        const landmark = formData.get('landmark') as string || '';
        const pincode = formData.get('pincode') as string || '';
        const city = formData.get('city') as string || '';

        const fullAddress = `${house}, ${street}, ${landmark ? 'Near ' + landmark + ', ' : ''}${city} - ${pincode}`;
        formData.set('details', fullAddress);

        const res = await addAddress(formData);
        setLoading(false);

        if (res.error) {
            alert(JSON.stringify(res.error));
        } else {
            const form = document.getElementById('add-address-form') as HTMLFormElement;
            form?.reset();
        }
    };

    return (
        <form id="add-address-form" action={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <input
                    name="name"
                    placeholder="Receiver Name"
                    required
                    className="border p-2 rounded text-sm w-full"
                />
                <input
                    name="phone"
                    placeholder="Phone Number (10 digits)"
                    required
                    type="tel"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className="border p-2 rounded text-sm w-full"
                    onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/\D/g, '').slice(0, 10);
                    }}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <input name="house" placeholder="House No / Flat No" required className="border p-2 rounded text-sm w-full" />
                <input name="pincode" placeholder="Pincode" required className="border p-2 rounded text-sm w-full" type="number" maxLength={6} />
            </div>

            <div className="relative">
                <input name="street" placeholder="Street / Colony / Area" required className="w-full border p-2 rounded text-sm pr-10" />
                <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={detecting}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600"
                    title="Use Current Location"
                >
                    {detecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <input name="landmark" placeholder="Landmark (Optional)" className="border p-2 rounded text-sm w-full" />
                <input name="city" placeholder="City" required className="border p-2 rounded text-sm w-full" defaultValue="New Delhi" />
            </div>

            <input type="hidden" name="details" />

            <div className="flex gap-3">
                <input name="label" placeholder="Label (e.g. Home)" className="border p-2 rounded text-sm flex-1" />
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" name="isDefault" value="true" />
                    Make Default
                </label>
            </div>
            <Button type="submit" size="sm" className="w-full bg-emerald-700 hover:bg-emerald-800" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Address'}
            </Button>
        </form>
    );
}
