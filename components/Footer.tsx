import { Truck, Wallet, MessageCircleQuestion } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-[#1a1a1a] text-white pt-16 pb-8 mt-auto">
            <div className="container mx-auto px-4">
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-center">
                    <div className="flex flex-col items-center">
                        <div className="bg-orange-500 p-3 rounded-lg mb-4 transform -rotate-3 hover:rotate-0 transition-transform">
                            <Truck className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Free delivery</h3>
                        <p className="text-gray-400 text-sm">Delivery happens within: 3-5 days</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="bg-orange-500 p-3 rounded-lg mb-4 transform rotate-3 hover:rotate-0 transition-transform">
                            <Wallet className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Payment options</h3>
                        <p className="text-gray-400 text-sm">Cash on delivery</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="bg-orange-500 p-3 rounded-lg mb-4 transform -rotate-3 hover:rotate-0 transition-transform">
                            <MessageCircleQuestion className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Customer support</h3>
                        <p className="text-gray-400 text-sm">connect@shubhlakshmikirana.com</p>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-800 w-full mb-12" />

                {/* Store Details */}
                <div className="text-center space-y-4">
                    <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">STORE DETAILS</p>
                    <h2 className="text-2xl font-bold">Shubh Lakshmi Kirana Mart</h2>
                    <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
                        Maharajganj road, Near Mahisouri Chowk, Jamui, Bihar 811307, India
                    </p>
                </div>
            </div>
        </footer>
    );
}
