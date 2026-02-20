import React, { useState } from 'react';

export default function TopBar() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    return (
        <>
            {/* Top Bar - "footertop div" */}
            <div className="w-full bg-[#f8f8f8] py-1 border-b border-gray-200">
                <div className="w-full max-w-[1280px] mx-auto flex justify-end px-4">
                    <button
                        onClick={() => setIsLoginModalOpen(true)}
                        className="bg-white border border-[#00ace6] text-gray-600 hover:bg-[#00ace6] hover:text-white text-sm font-medium flex items-center gap-2 px-6 py-1 rounded-sm transition shadow-sm cursor-pointer"
                    >
                        <i className="fa fa-lock text-xs"></i> Login
                    </button>
                </div>
            </div>

            {/* Login Modal */}
            {isLoginModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden relative animate-fade-in-up">
                        <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl z-10 font-light cursor-pointer">&times;</button>

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

                            <button className="bg-[#2B78E4] text-white font-bold py-3 rounded hover:bg-blue-600 w-full transition shadow-md text-sm uppercase tracking-wide cursor-pointer">
                                Log In
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
