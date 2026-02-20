import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [animationType, setAnimationType] = useState('animate-fade-in');
    const navigate = useNavigate();

    const bannerImages = [
        '/image/banner_img_1.jpg',
        '/image/banner_img_2.jpg',
        '/image/banner_img_3.jpg'
    ];

    const animations = ['animate-fade-in', 'animate-zoom-in', 'animate-slide-in-right', 'animate-slide-in-left'];

    const changeSlide = (nextIndex) => {
        setCarouselIndex(nextIndex);
        setAnimationType(animations[Math.floor(Math.random() * animations.length)]);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            changeSlide((carouselIndex + 1) % bannerImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [carouselIndex]);

    const handlePrev = () => changeSlide(carouselIndex === 0 ? bannerImages.length - 1 : carouselIndex - 1);
    const handleNext = () => changeSlide((carouselIndex + 1) % bannerImages.length);

    return (
        <div className="flex flex-col items-center w-full">
            {/* Main Banner Slider */}
            <div className="w-full mx-auto relative h-[140px] sm:h-[200px] md:h-[260px] lg:h-[313px] overflow-hidden group bg-white border-b">
                {bannerImages.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === carouselIndex ? `opacity-100 z-10 ${animationType}` : 'opacity-0 z-0'
                            }`}
                    >
                        <img
                            src={img}
                            alt={`Banner ${index + 1}`}
                            className="w-full h-full object-contain md:object-cover object-center bg-white"
                        />
                    </div>
                ))}

                <button onClick={handlePrev} className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 text-white w-12 h-16 flex items-center justify-center hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer text-2xl font-light shadow-md">
                    <i className="fa fa-angle-left"></i>
                </button>
                <button onClick={handleNext} className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 text-white w-12 h-16 flex items-center justify-center hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer text-2xl font-light shadow-md">
                    <i className="fa fa-angle-right"></i>
                </button>

                {/* Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {bannerImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCarouselIndex(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${idx === carouselIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                        />
                    ))}
                </div>
            </div>

            <div className="w-full bg-[#f9f9f9]">
                <div className="w-full max-w-[1280px] mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { id: 'about', title: 'About Project', desc: 'About Project', icon: '/image/menu_icon_farmer.png', link: '/about' },
                            { id: 'status', title: 'Application Status', desc: 'Know your Application Status', icon: '/image/menu_icon_check.png', link: '/status' },
                            { id: 'sop', title: 'SOP', desc: 'SOP', icon: '/image/menu_icon_tech.png', link: '/sop' },
                            { id: 'helpline', title: 'Helpline', desc: 'Ask Your Question Related to Portal', icon: '/image/menu_icon_call-center.png', link: '/helpline' }
                        ].map(card => (
                            <div
                                key={card.id}
                                onClick={() => navigate(card.link)}
                                className="bg-[#fafafa] px-[10px] py-6 rounded-[3px] border border-[#f1f1f1] shadow-sm cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center group bg-white"
                            >
                                <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                                    <img src={card.icon} alt={card.title} className="w-16 h-16 object-contain" />
                                </div>
                                <h3 className="font-roboto font-light text-[15px] text-[#333] mb-2 group-hover:text-[#0c9ec7] transition-colors">{card.title}</h3>
                                <div className="w-12 h-0.5 bg-gray-200 mb-3 group-hover:bg-[#0c9ec7] transition-colors"></div>
                                <p className="text-sm text-[#777] group-hover:text-[#0c9ec7] transition-colors">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full bg-white py-8 border-t flex justify-center">
                <img src="/image/footer_top_bg.png" alt="Footer Top" className="max-w-[1280px] w-full h-auto object-contain" />
            </div>

            {/* Client Logos */}
            <div className="w-full bg-white pb-8">
                <div className="container mx-auto flex justify-center items-center gap-8 flex-wrap">
                    <img src="/image/wbswan.jpg" alt="WBSWAN" className="h-12 object-contain" />
                    <img src="/image/westbengal_tourism_logo.jpg" alt="Tourism" className="h-12 object-contain" />
                    <img src="/image/westbengal_map_logo.jpg" alt="Map" className="h-12 object-contain" />
                    <img src="/image/indiagovin_mp.jpg" alt="India Gov" className="h-12 object-contain" />
                </div>
            </div>
        </div>
    );
}
