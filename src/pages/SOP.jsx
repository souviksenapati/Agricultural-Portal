import React from 'react';
import { Link } from 'react-router-dom';

export default function SOP() {
    return (
        <div className="flex-grow container mx-auto px-4 py-8 relative w-full max-w-[930px]">
            <Link
                to="/"
                className="mb-6 text-gray-600 hover:text-[#0648b3] flex items-center gap-2 text-sm font-bold bg-white px-4 py-2 rounded shadow-sm w-fit transition"
            >
                &#8592; Back to Home
            </Link>
            <div className="bg-white p-8 rounded shadow-sm min-h-[400px]">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-6 p-6 bg-blue-50 rounded-full inline-block">
                        <img src="/image/menu_icon_tech.png" alt="SOP" className="w-16 h-16" />
                    </div>
                    <h2 className="text-2xl font-bold mb-8 text-[#1f4e79]">Standard Operating Procedure (SOP)</h2>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <button className="bg-[#1f4e79] text-white px-8 py-3 rounded shadow hover:bg-blue-800 font-semibold flex items-center justify-center gap-2 w-full sm:w-auto transition cursor-pointer">
                            <span>📄</span> Download SOP (English)
                        </button>
                        <button className="bg-[#385723] text-white px-8 py-3 rounded shadow hover:bg-green-800 font-semibold flex items-center justify-center gap-2 w-full sm:w-auto transition cursor-pointer">
                            <span>📄</span> Download SOP (Bengali)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
