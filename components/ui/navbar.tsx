"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Home, Bell, ShoppingCart, Heart, Search } from 'lucide-react';
import ProfileButton from '@/components/common/ProfileButton';
import useCart from '@/hooks/cart/useCart';

export default function NavBar() {
    const cart = useCart()
    return (
        <nav className="bg-linear-to-r from-orange-600 to-orange-300 py-5 px-10 flex justify-between items-center shadow-md">
            <Link href="/" className="text-white font-bold text-xl ">
                <Image src="/logo.png" alt="Pet Shop Logo" width={144} height={40} className="w-36" priority />
            </Link>
            <div className="flex items-center space-x-4">
                <Link href="/" className="text-white hover:text-orange-100 transition-colors">
                    <Home size={24} />
                </Link>
                <button className="text-white hover:text-orange-100 transition-colors">
                    <Bell size={24} />
                </button>
                <Link href="/cart" className="relative text-white hover:text-orange-100 transition-colors">
                    <ShoppingCart size={24} />
                    {cart.items.length > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {cart.items.reduce((sum, it) => sum + (it.quantity||1), 0)}
                        </span>
                    )}
                </Link>

                <Link href="/favorite" className="text-white hover:text-orange-100 transition-colors">
                    <Heart size={24} />
                </Link>
                    

                <div className="relative">
                    <input
                        type="text"
                        className="px-3 py-1 rounded-full bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                    />
                    <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                </div>
                <ProfileButton />
            </div>
        </nav>
    );
}