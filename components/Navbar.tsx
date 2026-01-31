'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, MapPin } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

export function Navbar() {
    const cartTotal = useCartStore((state) => state.items.reduce((acc, i) => acc + i.quantity, 0));
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [location, setLocation] = useState('New Delhi');
    const [loadingLocation, setLoadingLocation] = useState(false);

    const detectLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    // Using OpenStreetMap Nominatim API (Free, requires User-Agent)
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
                    const data = await res.json();

                    const city = data.address.city || data.address.town || data.address.village || data.address.state || 'Unknown Location';
                    setLocation(city);
                } catch (error) {
                    console.error('Error fetching address:', error);
                    alert('Failed to detect location address');
                } finally {
                    setLoadingLocation(false);
                }
            },
            (error) => {
                console.error('Error getting location:', error);
                setLoadingLocation(false);
                alert('Unable to retrieve your location');
            }
        );
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
            <div className="container flex h-20 items-center px-4 justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                    </Button>
                    <Link href="/" className="flex items-center space-x-2">
                        {/* <span className="text-xl font-bold text-green-700">Shubh Lakshmi Kirana Mart</span> */}
                        <img src="/logo-cartoon.png" alt="Shubh Lakshmi Kirana Mart" className="h-16 w-auto object-contain" />
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    {/* Location Tab */}
                    <Button
                        onClick={detectLocation}
                        variant="ghost"
                        className="hidden md:flex items-center gap-1 text-sm font-normal text-gray-600 hover:text-green-700 hover:bg-green-50"
                        disabled={loadingLocation}
                    >
                        <MapPin className={`h-4 w-4 ${loadingLocation ? 'animate-bounce' : ''}`} />
                        <span>{loadingLocation ? 'Detecting...' : location}</span>
                    </Button>
                    <Button onClick={detectLocation} variant="ghost" size="icon" className="md:hidden">
                        <MapPin className={`h-5 w-5 ${loadingLocation ? 'animate-bounce' : ''}`} />
                    </Button>

                    {/* Search - expanded on desktop, icon on mobile (simplified) */}
                    <Link href="/search">
                        <Button variant="ghost" size="icon">
                            <Search className="h-5 w-5" />
                        </Button>
                    </Link>

                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {mounted && cartTotal > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
                                    {cartTotal}
                                </span>
                            )}
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
