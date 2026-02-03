'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, MapPin, User, LogOut, Package, Heart } from 'lucide-react';
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
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
                ? 'glass shadow-md bg-white/80 border-b border-white/20'
                : 'bg-white border-b border-gray-100'
                }`}
        >
            <div className="container flex h-20 items-center px-4 justify-between gap-4">
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="md:hidden text-gray-700 hover:text-primary hover:bg-emerald-50">
                        <Menu className="h-6 w-6" />
                    </Button>
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute -inset-1 rounded-full bg-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                            <img src="/logo-cartoon.png" alt="Shubh Lakshmi Kirana Mart" className="relative h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <span className="hidden lg:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-emerald-500 font-heading tracking-tight">
                            Shubh Lakshmi
                        </span>
                    </Link>
                </div>

                {/* Center Search Bar (Desktop) */}
                <div className="hidden md:block flex-1 max-w-xl mx-4 transition-all duration-300 focus-within:scale-[1.02]">
                    <SearchInput />
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Location Tab */}
                    <Button
                        onClick={detectLocation}
                        variant="ghost"
                        className="hidden lg:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-emerald-50 rounded-full px-4 transition-colors"
                        disabled={loadingLocation}
                    >
                        <MapPin className={`h-4 w-4 ${loadingLocation ? 'animate-bounce text-amber-500' : 'text-emerald-600'}`} />
                        <span>{loadingLocation ? 'Detecting...' : location}</span>
                    </Button>

                    <Button onClick={detectLocation} variant="ghost" size="icon" className="lg:hidden text-gray-600">
                        <MapPin className={`h-5 w-5 ${loadingLocation ? 'animate-bounce text-amber-500' : ''}`} />
                    </Button>

                    {/* Search Icon (Mobile Only) */}
                    <Link href="/search" className="md:hidden">
                        <Button variant="ghost" size="icon" className="text-gray-600">
                            <Search className="h-5 w-5" />
                        </Button>
                    </Link>

                    {/* Auth Buttons */}
                    {status === 'loading' ? (
                        <div className="h-9 w-9 animate-pulse bg-gray-200 rounded-full" />
                    ) : session ? (
                        <div className="flex items-center gap-3">
                            <Link href="/orders" className="hidden lg:block">
                                <Button variant="ghost" size="sm" className="gap-2 text-gray-700 hover:text-primary hover:bg-emerald-50 rounded-full">
                                    <Package className="h-4 w-4" />
                                    <span>Orders</span>
                                </Button>
                            </Link>

                            <Link href="/wishlist" className="hidden lg:block">
                                <Button variant="ghost" size="sm" className="gap-2 text-gray-700 hover:text-primary hover:bg-emerald-50 rounded-full">
                                    <Heart className="h-4 w-4" />
                                    <span>Wishlist</span>
                                </Button>
                            </Link>

                            <div className="hidden md:flex items-center gap-3 pl-2 border-l border-gray-200">
                                <NotificationBell />
                                <div className="flex items-center gap-2">
                                    <Link href="/profile">
                                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm border border-emerald-200 cursor-pointer hover:bg-emerald-200 transition-colors">
                                            {session.user?.name?.charAt(0) || 'U'}
                                        </div>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => signOut()}
                                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Mobile Logic */}
                            <div className="md:hidden flex items-center gap-1">
                                <Link href="/wishlist">
                                    <Button variant="ghost" size="icon">
                                        <Heart className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/orders">
                                    <Button variant="ghost" size="icon">
                                        <Package className="h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                                Login
                            </Button>
                        </Link>
                    )}

                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative text-gray-700 hover:text-primary hover:bg-emerald-50 rounded-full">
                            <ShoppingCart className="h-6 w-6" />
                            {mounted && cartTotal > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white shadow-sm ring-2 ring-white animate-fade-in">
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
