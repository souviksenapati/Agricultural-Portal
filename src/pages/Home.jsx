import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const bannerImages = [
    '/image/banner_img_1.jpg',
    '/image/banner_img_2.jpg',
    '/image/banner_img_3.jpg'
];

const featureCards = [
    { id: 'about', title: 'About Project', desc: 'About Project', icon: '/image/menu_icon_farmer.png', link: '/about' },
    { id: 'status', title: 'Application Status', desc: 'Know your Application Status', icon: '/image/menu_icon_check.png', link: '/status' },
    { id: 'sop', title: 'SOP', desc: 'SOP', icon: '/image/menu_icon_tech.png', link: '/sop' },
    { id: 'helpline', title: 'Helpline', desc: 'Ask Your Question Related to Portal', icon: '/image/menu_icon_call-center.png', link: '/helpline' }
];

export default function Home() {
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [animationType, setAnimationType] = useState('animate-fade-in');
    const navigate = useNavigate();

    const animations = ['animate-fade-in', 'animate-zoom-in', 'animate-slide-in-right', 'animate-slide-in-left'];

    const changeSlide = useCallback((nextIndex) => {
        setCarouselIndex(nextIndex);
        setAnimationType(animations[Math.floor(Math.random() * animations.length)]);
    }, [animations]);

    useEffect(() => {
        const timer = setInterval(() => {
            changeSlide((carouselIndex + 1) % bannerImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [carouselIndex, changeSlide]);

    const handlePrev = useCallback(() => changeSlide(carouselIndex === 0 ? bannerImages.length - 1 : carouselIndex - 1), [carouselIndex, changeSlide]);
    const handleNext = useCallback(() => changeSlide((carouselIndex + 1) % bannerImages.length), [carouselIndex, changeSlide]);

    return (
        <div className="flex flex-col items-center w-full">
            {/* Main Banner Slider */}
            <div className="w-full mx-auto relative overflow-hidden group bg-white border-b">
                {/* Structural invisible image to create responsive height matching the real aspect ratio */}
                <img src={bannerImages[0]} alt="" className="w-full h-auto opacity-0 pointer-events-none block" />

                {bannerImages.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === carouselIndex ? `opacity-100 z-10 ${animationType}` : 'opacity-0 z-0'
                            }`}
                    >
                        <img
                            src={img}
                            alt={`Banner ${index + 1}`}
                            className="w-full h-full object-cover object-center bg-white block"
                            loading={index === 0 ? "eager" : "lazy"}
                            decoding="async"
                        />
                    </div>
                ))}

                <button onClick={handlePrev} className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 text-white w-12 h-16 flex items-center justify-center hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer text-2xl font-light shadow-md">
                    <i className="fa fa-angle-left" aria-hidden="true"></i>
                    <span className="sr-only">Previous slide</span>
                </button>
                <button onClick={handleNext} className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 text-white w-12 h-16 flex items-center justify-center hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer text-2xl font-light shadow-md">
                    <i className="fa fa-angle-right" aria-hidden="true"></i>
                    <span className="sr-only">Next slide</span>
                </button>

                {/* Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {bannerImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCarouselIndex(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${idx === carouselIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                        />
                    ))}
                </div>
            </div>

            <div className="w-full bg-[#f9f9f9]">
                <div className="w-full max-w-[1280px] mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {featureCards.map(card => (
                            <div
                                key={card.id}
                                onClick={() => navigate(card.link)}
                                className="bg-[#fafafa] px-2.5 py-10 rounded-lg border border-[#f1f1f1] shadow-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center group bg-white"
                            >
                                <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                                    <img src={card.icon} alt={`${card.title} Icon`} className="w-16 h-16 object-contain" loading="lazy" width="64" height="64" />
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
                <img src="/image/footer_top_bg.png" alt="Footer Top Decorative Element" className="max-w-[1280px] w-full h-auto object-contain" loading="lazy" />
            </div>

            {/* Client Logos */}
            <div className="w-full bg-white pb-8">
                <div className="container mx-auto flex justify-center items-center gap-8 flex-wrap">
                    <img src="/image/wbswan.jpg" alt="WBSWAN Logo" className="h-12 w-auto object-contain" loading="lazy" width="auto" height="48" />
                    <img src="/image/westbengal_tourism_logo.jpg" alt="West Bengal Tourism Logo" className="h-12 w-auto object-contain" loading="lazy" width="auto" height="48" />
                    <img src="/image/westbengal_map_logo.jpg" alt="West Bengal Map Logo" className="h-12 w-auto object-contain" loading="lazy" width="auto" height="48" />
                    <img src="/image/indiagovin_mp.jpg" alt="India Gov Logo" className="h-12 w-auto object-contain" loading="lazy" width="auto" height="48" />
                </div>
            </div>
        </div>
    );
}
