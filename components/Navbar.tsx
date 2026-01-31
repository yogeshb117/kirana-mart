'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, MapPin, User, LogOut, Package } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { useSession, signOut } from "next-auth/react";
import { NotificationBell } from './NotificationBell';
import { SearchInput } from './SearchInput';

export function Navbar() {
    const { data: session, status } = useSession();
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
            <div className="container flex h-20 items-center px-4 justify-between gap-4">
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                    </Button>
                    <Link href="/" className="flex items-center space-x-2">
                        {/* <span className="text-xl font-bold text-green-700">Shubh Lakshmi Kirana Mart</span> */}
                        <img src="/logo-cartoon.png" alt="Shubh Lakshmi Kirana Mart" className="h-16 w-auto object-contain" />
                    </Link>
                </div>

                {/* Center Search Bar (Desktop) */}
                <div className="hidden md:block flex-1 max-w-xl mx-4">
                    <SearchInput />
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Location Tab */}
                    <Button
                        onClick={detectLocation}
                        variant="ghost"
                        className="hidden lg:flex items-center gap-1 text-sm font-normal text-gray-600 hover:text-green-700 hover:bg-green-50"
                        disabled={loadingLocation}
                    >
                        <MapPin className={`h-4 w-4 ${loadingLocation ? 'animate-bounce' : ''}`} />
                        <span>{loadingLocation ? 'Detecting...' : location}</span>
                    </Button>
                    <Button onClick={detectLocation} variant="ghost" size="icon" className="lg:hidden">
                        <MapPin className={`h-5 w-5 ${loadingLocation ? 'animate-bounce' : ''}`} />
                    </Button>

                    {/* Search Icon (Mobile Only) */}
                    <Link href="/search" className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <Search className="h-5 w-5" />
                        </Button>
                    </Link>

                    {/* Auth Buttons */}
                    {status === 'loading' ? (
                        <div className="h-8 w-8 animate-pulse bg-gray-200 rounded-full" />
                    ) : session ? (
                        <div className="flex items-center gap-2">
                            {/* Mobile: Simple Logout */}
                            <div className="md:hidden flex items-center gap-1">
                                <Link href="/orders">
                                    <Button variant="ghost" size="icon">
                                        <Package className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="icon" onClick={() => signOut()}>
                                    <User className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Desktop: Welcome + Logout */}
                            <div className="hidden md:flex items-center gap-2">
                                <Link href="/orders">
                                    <Button variant="ghost" size="sm" className="hidden lg:flex items-center gap-1">
                                        <Package className="h-4 w-4" />
                                        <span>My Orders</span>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="lg:hidden">
                                        <Package className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <NotificationBell />
                                <div className="h-4 w-px bg-gray-200 mx-1" />
                                <span className="text-sm font-medium text-gray-700">Hi, {session.user?.name || 'User'}</span>
                                <Button variant="outline" size="sm" onClick={() => signOut()} className="text-red-600 border-red-200 hover:bg-red-50">
                                    Logout
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                            </Button>
                        </Link>
                    )}

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
