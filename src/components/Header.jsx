import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            {/* Header Top */}
            <header className="w-full bg-white border-b shadow-sm">
                <div className="w-full max-w-[1280px] mx-auto flex items-center justify-between px-4 py-3">
                    <div className="flex-shrink-0">
                        <Link to="/">
                            <img src="/image/logo_bsb.png" alt="Govt Logo" className="h-20 w-auto block" />
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="bg-[#00ACED] text-white text-sm px-4 py-2 rounded shadow-sm hover:bg-[#009bd5] transition font-medium flex items-center gap-2 whitespace-nowrap cursor-pointer">Check Application <i className="fa fa-search"></i></button>
                        <button className="bg-[#00ACED] text-white text-sm px-4 py-2 rounded shadow-sm hover:bg-[#009bd5] transition font-medium flex items-center gap-2 whitespace-nowrap cursor-pointer">New Application Form <i className="fa fa-download"></i></button>
                        <button className="bg-[#00ACED] text-white text-sm px-4 py-2 rounded shadow-sm hover:bg-[#009bd5] transition font-medium flex items-center gap-2 whitespace-nowrap cursor-pointer">Faq <i className="fa fa-question"></i></button>
                    </div>
                </div>
            </header>

            <div className="w-full bg-[#0648b3] text-white overflow-hidden py-3">
                <div className="w-full max-w-[1280px] mx-auto whitespace-nowrap animate-marquee text-center font-medium text-lg tracking-wide">
                    <span>Welcome to Agricultural Labour Portal</span>
                </div>
            </div>

            {/* Login Modal */}
            {isLoginModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden relative animate-fade-in-up">
                        <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl z-10 font-light">&times;</button>

                        <div className="bg-[#dcf4ff] py-6 flex flex-col items-center border-b border-blue-100">
                            <img src="/image/logo_bsb.png" alt="Logo" className="h-16 mb-2" />
                        </div>

                        <div className="p-8">
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Sign In</h3>
                                <p className="text-sm text-gray-500 mt-1">Welcome to Bhumihin Khetmajur</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-600 text-sm font-semibold mb-1">Email</label>
                                    <input type="email" className="w-full border border-gray-300 px-3 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-[#2B78E4] focus:border-transparent transition text-sm" />
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm font-semibold mb-1">Password</label>
                                    <input type="password" className="w-full border border-gray-300 px-3 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-[#2B78E4] focus:border-transparent transition text-sm" />
                                </div>
                            </div>

                            <div className="mt-4 mb-6 flex items-center">
                                <input type="checkbox" id="remember" className="w-4 h-4 text-[#2B78E4] border-gray-300 rounded focus:ring-[#2B78E4]" />
                                <label htmlFor="remember" className="ml-2 text-sm text-gray-600 cursor-pointer select-none">Remember me</label>
                            </div>

                            <button className="bg-[#2B78E4] text-white font-bold py-3 rounded hover:bg-blue-600 w-full transition shadow-md text-sm uppercase tracking-wide">
                                Log In
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
