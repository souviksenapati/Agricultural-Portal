import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Header() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <header className="w-full bg-white border-b shadow-sm">
                <div className="w-full max-w-[1280px] mx-auto flex items-center justify-between px-4 py-3">

                    {/* Logo */}
                    <div className="shrink-0">
                        <Link to="/">
                            <img
                                src="/image/logo_bsb.png"
                                alt="Govt Logo"
                                className="h-14 sm:h-16 md:h-20 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Desktop Buttons */}
                    <div className="hidden sm:flex items-center gap-2">
                        <Link to={'/status'} className="btn-primary bg-[#00ACED] text-white text-xs sm:text-sm px-4 py-2 rounded shadow-sm hover:bg-[#009bd5] transition font-medium flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer w-full sm:w-auto">
                            Check Application
                        </Link>

                        <button className="btn-primary bg-[#00ACED] text-white text-xs sm:text-sm px-4 py-2 rounded shadow-sm hover:bg-[#009bd5] transition font-medium flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer w-full sm:w-auto">
                            New Application Form
                        </button>

                        <button className="btn-primary bg-[#00ACED] text-white text-xs sm:text-sm px-4 py-2 rounded shadow-sm hover:bg-[#009bd5] transition font-medium flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer w-full sm:w-auto">
                            Faq
                        </button>
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="sm:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown */}
                {isMenuOpen && (
                    <div className="sm:hidden px-4 pb-4 flex flex-col gap-2 bg-white border-t">
                        <button className="btn-primary mt-2 bg-[#00ACED] text-white text-xs sm:text-sm px-4 py-2 rounded shadow-sm hover:bg-[#009bd5] transition font-medium flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer w-full sm:w-auto">
                            Check Application
                        </button>

                        <button className="btn-primary bg-[#00ACED] text-white text-xs sm:text-sm px-4 py-2 rounded shadow-sm hover:bg-[#009bd5] transition font-medium flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer w-full sm:w-auto">
                            New Application Form
                        </button>

                        <button className="btn-primary bg-[#00ACED] text-white text-xs sm:text-sm px-4 py-2 rounded shadow-sm hover:bg-[#009bd5] transition font-medium flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer w-full sm:w-auto">
                            Faq
                        </button>
                    </div>
                )}
            </header>

            {/* Marquee Banner */}
            <div className="w-full bg-[#0648b3] text-white overflow-hidden py-2 md:py-3">
                <div className="w-full max-w-[1280px] mx-auto whitespace-nowrap animate-marquee text-center font-medium text-sm sm:text-base md:text-lg tracking-wide px-4">
                    <span>Welcome to Agricultural Labour Portal</span>
                </div>
            </div>

            {/* Login Modal (unchanged) */}
            {isLoginModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={() => setIsLoginModalOpen(false)}
                            className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-3xl"
                        >
                            &times;
                        </button>
                        {/* Modal content remains same */}
                    </div>
                </div>
            )}
        </>
    );
}