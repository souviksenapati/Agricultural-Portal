import React, { useState } from 'react';

const FarmerSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Initiating search for:', searchTerm);
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-8 md:p-12">
            <div className="max-w-5xl mx-auto bg-white shadow-sm rounded-lg p-6 md:p-10">

                <header className="mb-6 md:mb-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#333] tracking-tight uppercase">
                        Farmer Search
                    </h1>
                </header>

                <form onSubmit={handleSearch} className="flex flex-col gap-4">
                    <div className="w-full">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Acknowledgement No / Aadhaar / Mobile"
                            className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400 font-light"
                        />
                    </div>

                    <div className="flex justify-start">
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-8 py-2.5 bg-[#337ab7] hover:bg-[#286090] text-white font-medium rounded shadow-sm transition-colors duration-200 text-sm sm:text-base hover:cursor-pointer"
                        >
                            Search
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default FarmerSearch;
