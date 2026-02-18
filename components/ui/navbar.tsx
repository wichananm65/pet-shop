import Image from 'next/image';
import { Home, Bell, ShoppingCart, Heart, Search } from 'lucide-react';
import ProfileButton from '@/components/common/ProfileButton';

export default function NavBar() {
    return (
        <nav className="bg-linear-to-r from-orange-600 to-orange-300 py-5 px-10 flex justify-between items-center shadow-md">
            <div className="text-white font-bold text-xl ">
                <Image src="/logo.png" alt="Pet Shop Logo" width={144} height={40} className="w-36" priority />
            </div>
            <div className="flex items-center space-x-4">
                <button className="text-white hover:text-orange-100 transition-colors">
                    <Home size={24} />
                </button>
                <button className="text-white hover:text-orange-100 transition-colors">
                    <Bell size={24} />
                </button>
                <button className="text-white hover:text-orange-100 transition-colors">
                    <ShoppingCart size={24} />
                </button>
                <button className="text-white hover:text-orange-100 transition-colors">
                    <Heart size={24} />
                </button>
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