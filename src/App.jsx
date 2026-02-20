import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import SubFooter from './components/SubFooter';
import Home from './pages/Home';
import About from './pages/About';
import SOP from './pages/SOP';
import Helpline from './pages/Helpline';
import FarmerSearch from './components/FarmerSearch';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

export default function AgriculturalPortal() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="min-h-screen flex flex-col font-roboto text-[15px] bg-white relative overflow-x-hidden">
            <TopBar />
            <Header />
            <main className="flex-grow flex flex-col items-center w-full bg-white">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/sop" element={<SOP />} />
                    <Route path="/helpline" element={<Helpline />} />
                    {/* Placeholder for status if needed, or redirect */}
                    {/* <Route path="/status" element={<div className="p-8 text-center text-gray-600">Application Status Page (Use "Check Application" button in header)</div>} /> */}
                    <Route path="/status" element={<FarmerSearch />} />
                </Routes>
            </main>
            {isHome && <Footer />}
            <SubFooter />
        </div>
    );
}
