
import React, { useState, useEffect } from 'react';

interface HeroProps {
  onOpenQuote: () => void;
}

const HERO_SLIDES = [
  {
    url: "/britons-removals-storage-derby-2.png", // Navy blue truck
    alt: "Britons Removals navy blue MAN truck with white trailer prepared for long-haul transit"
  },
  {
    url: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?q=80&w=1920&auto=format&fit=crop",
    alt: "Professional removal team loading a house for international relocation"
  },
  {
    url: "https://images.unsplash.com/photo-1543783232-4d762e007820?q=80&w=1920&auto=format&fit=crop",
    alt: "Picturesque Spanish village, one of our regular relocation destinations"
  },
  {
    url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1920&auto=format&fit=crop",
    alt: "Secure removals vehicle ready for shipping to Spain"
  }
];

const Hero: React.FC<HeroProps> = ({ onOpenQuote }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden mt-20">
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={slide.url} 
              alt={slide.alt}
              className="w-full h-full object-cover brightness-[0.35]"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/30 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full text-center lg:text-left">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-in">
            Stress-Free <span className="text-blue-400">UK to Spain</span> Relocations
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-10 leading-relaxed font-light">
            Your trusted partner for removals and secure storage across the UK and Europe. Specialist weekly services to and from Spain since 1986.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={() => {
                const el = document.getElementById('services');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
            >
              How can we help?
            </button>
            <button 
              onClick={onOpenQuote}
              className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
            >
              Get a Free Quote
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentSlide 
                ? 'bg-blue-500 w-8' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent"></div>
    </section>
  );
};

export default Hero;
