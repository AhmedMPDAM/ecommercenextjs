'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    title: 'Summer Collection 2024',
    subtitle: 'New Arrivals',
    description: 'Discover the latest trends in fashion and lifestyle',
    cta: 'Shop Now',
    link: '/catalog?category=women\'s clothing',
    bgGradient: 'from-purple-600 via-pink-600 to-red-600',
    icon: TrendingUp,
  },
  {
    id: 2,
    title: 'Electronics Sale',
    subtitle: 'Up to 50% Off',
    description: 'Premium gadgets and accessories at unbeatable prices',
    cta: 'Explore Deals',
    link: '/catalog?category=electronics',
    bgGradient: 'from-blue-600 via-cyan-600 to-teal-600',
    icon: Zap,
  },
  {
    id: 3,
    title: 'Luxury Jewelry',
    subtitle: 'Exclusive Designs',
    description: 'Handcrafted pieces that make a statement',
    cta: 'View Collection',
    link: '/catalog?category=jewelery',
    bgGradient: 'from-amber-600 via-yellow-600 to-orange-600',
    icon: ShoppingBag,
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-3xl shadow-2xl">
      {/* Slides */}
      {slides.map((slide, index) => {
        const Icon = slide.icon;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ${
              index === currentSlide
                ? 'opacity-100 translate-x-0'
                : index < currentSlide
                ? 'opacity-0 -translate-x-full'
                : 'opacity-0 translate-x-full'
            }`}
          >
            <div
              className={`w-full h-full bg-gradient-to-br ${slide.bgGradient} flex items-center justify-center relative overflow-hidden`}
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 max-w-4xl mx-auto px-8 text-center text-white">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
                    <Icon className="w-12 h-12" />
                  </div>
                </div>

                <h2 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-90">
                  {slide.subtitle}
                </h2>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  {slide.title}
                </h1>

                <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-2xl mx-auto">
                  {slide.description}
                </p>

                <Link
                  href={slide.link}
                  className="inline-block px-10 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={handlePrevious}
        disabled={isAnimating}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={handleNext}
        disabled={isAnimating}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-12 h-3 bg-white'
                : 'w-3 h-3 bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}