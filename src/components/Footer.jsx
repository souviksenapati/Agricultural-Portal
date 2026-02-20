import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="w-full bg-[#f8f9fa] border-t-2 border-[#0648b3] pt-8 pb-4">
            <div className="w-full max-w-[1280px] mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="hidden md:block w-24">
                        <img src="/image/indiagovin_mp.jpg" alt="Left Logo" className="w-full" />
                    </div>

                    <div className="flex-1 text-center">
                        <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-gray-600 mb-4">
                            {['Home', 'Copyright Policy', 'About the Portal', 'Site Map', 'Terms of Use', 'Feedback', 'Help', 'Contact Us', 'Downloads'].map((item, i) => (
                                <a key={i} href="#" className="hover:text-[#0648b3] hover:underline transition">{item}</a>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:block w-24">
                        <img src="/image/footer_right_logo.jpg" alt="Right Logo" className="w-full" />
                    </div>
                </div>

            </div>
        </footer>
    );
}
