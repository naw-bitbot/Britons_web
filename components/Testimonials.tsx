
import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../constants';

const Testimonials: React.FC = () => {
  const [active, setActive] = useState(0);

  const next = () => setActive((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setActive((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section id="testimonials" className="py-24 bg-blue-50/50 relative overflow-hidden">
      <Quote className="absolute top-10 right-10 w-64 h-64 text-blue-100 opacity-20 -rotate-12" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">Customer Stories</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">What Our Customers Say</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">Providing stress-free relocations across the continent for over 30 years.</p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col items-center text-center group"
              >
                <div className="flex space-x-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="italic text-slate-600 mb-8 leading-relaxed flex-grow text-sm md:text-base">
                  "{testimonial.text}"
                </p>
                <div className="w-12 h-1 bg-blue-100 mb-6 rounded-full group-hover:w-20 transition-all duration-300"></div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wide text-sm">{testimonial.name}</h4>
                <p className="text-blue-600 text-xs font-bold mt-1 uppercase tracking-tighter">Verified Customer</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 bg-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between border border-blue-50">
           <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="Avatar" />
                 ))}
              </div>
              <div>
                <p className="text-slate-900 font-bold">4.9/5 Average Rating</p>
                <p className="text-slate-500 text-sm">Based on 500+ moves this year</p>
              </div>
           </div>
           <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors">
              Read All Reviews
           </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
