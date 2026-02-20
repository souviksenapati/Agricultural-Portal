import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <header className="w-full bg-white border-b shadow-sm">
                <div className="w-full max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-2 md:py-1">

                    {/* Logo Section - Centers on mobile, left-aligned on desktop */}
                    <div className="shrink-0 mb-4 md:mb-0">
                        <Link to="/">
                            <img
                                src="/image/logo_bsb.png"
                                alt="Govt Logo"
                                className="h-14 sm:h-16 md:h-20 w-auto block transition-all"
                            />
                        </Link>
                    </div>

                    {/* Button Group - Stacks on mobile, horizontal on tablet+ */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto pb-2 md:pb-0 justify-center">
                        <button className="bg-[#00ACED] text-white text-xs sm:text-sm px-4 py-2 rounded shadow-sm hover:bg-[#009bd5] transition font-medium flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer w-full sm:w-auto">
                            Check Application <i className="fa fa-search"></i>
                        </button>

                        <button className="bg-[#00ACED] text-white text-xs sm:text-sm px-4 py-2 rounded shadow-sm hover:bg-[#009bd5] transition font-medium flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer w-full sm:w-auto">
                            New Application Form <i className="fa fa-download"></i>
                        </button>

                        <button className="bg-[#00ACED] text-white text-xs sm:text-sm px-4 py-2 rounded shadow-sm hover:bg-[#009bd5] transition font-medium flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer w-full sm:w-auto">
                            Faq <i className="fa fa-question"></i>
                        </button>

                        {/* Example Login Trigger */}
                        {/* <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className="bg-gray-800 text-white text-xs sm:text-sm px-4 py-2 rounded shadow-sm hover:bg-black transition font-medium flex items-center justify-center gap-2 w-full sm:w-auto mt-1 sm:mt-0"
                        >
                            Login <i className="fa fa-user"></i>
                        </button> */}
                    </div>
                </div>
            </header>

            {/* Marquee Banner - Improved text scaling */}
            <div className="w-full bg-[#0648b3] text-white overflow-hidden py-2 md:py-3">
                <div className="w-full max-w-[1280px] mx-auto whitespace-nowrap animate-marquee text-center font-medium text-sm sm:text-base md:text-lg tracking-wide px-4">
                    <span>Welcome to Agricultural Labour Portal</span>
                </div>
            </div>

            {/* Login Modal - Responsive handling for height and width */}
            {isLoginModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative animate-fade-in-up">

                        {/* Close Button */}
                        <button
                            onClick={() => setIsLoginModalOpen(false)}
                            className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-3xl z-10 font-light"
                        >
                            &times;
                        </button>

                        <div className="bg-[#dcf4ff] py-6 flex flex-col items-center border-b border-blue-100">
                            <img src="/image/logo_bsb.png" alt="Logo" className="h-12 sm:h-16 mb-2" />
                        </div>

                        <div className="p-6 sm:p-8">
                            <div className="text-center mb-6">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Sign In</h3>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">Welcome to Bhumihin Khetmajur</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-600 text-xs sm:text-sm font-semibold mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full border border-gray-300 px-3 py-2 sm:py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-[#2B78E4] focus:border-transparent transition text-sm"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-xs sm:text-sm font-semibold mb-1">Password</label>
                                    <input
                                        type="password"
                                        className="w-full border border-gray-300 px-3 py-2 sm:py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-[#2B78E4] focus:border-transparent transition text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 mb-6 flex items-center">
                                <input type="checkbox" id="remember" className="w-4 h-4 text-[#2B78E4] border-gray-300 rounded focus:ring-[#2B78E4]" />
                                <label htmlFor="remember" className="ml-2 text-xs sm:text-sm text-gray-600 cursor-pointer select-none">Remember me</label>
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
