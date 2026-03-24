import React from 'react';
import { Star, Quote, ShieldCheck, Truck, MessagesSquare } from 'lucide-react';
import { TESTIMONIALS } from '../constants';

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-blue-50/50 relative overflow-hidden">
      <Quote className="absolute top-10 right-10 w-64 h-64 text-blue-100 opacity-20 -rotate-12" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">Customer Reviews</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">Trusted with the move because the job gets done properly</h2>
          <p className="text-slate-600 max-w-3xl mx-auto text-lg">
            When people hand over everything in their home, they want more than promises. They want a removals team that turns up prepared, packs correctly, keeps them informed, and delivers safely.
          </p>
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
                <h4 className="font-bold text-slate-800 tracking-wide text-sm">{testimonial.name}</h4>
                <p className="text-blue-600 text-xs font-bold mt-1 uppercase tracking-tighter">Verified household move</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 bg-white p-8 rounded-3xl shadow-lg border border-blue-50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <p className="text-sm font-bold tracking-widest uppercase text-blue-600 mb-3">Why customers book Britons</p>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Regular European routes. Experienced crews. Clear communication.</h3>
              <p className="text-slate-600 max-w-3xl">
                From full household removals to smaller part loads, we help customers move between the UK and Spain, France, Germany, Italy and destinations across Europe with a service built on planning, handling and follow-through.
              </p>
            </div>

            <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors whitespace-nowrap">
              Request your move quote
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-slate-50 rounded-2xl p-5 flex items-start gap-4">
              <ShieldCheck className="text-blue-600 shrink-0 mt-1" size={22} />
              <div>
                <p className="font-bold text-slate-900">Careful handling</p>
                <p className="text-sm text-slate-600 mt-1">Packing, protection and loading carried out by crews used to long-distance household removals.</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-5 flex items-start gap-4">
              <Truck className="text-blue-600 shrink-0 mt-1" size={22} />
              <div>
                <p className="font-bold text-slate-900">Planned delivery</p>
                <p className="text-sm text-slate-600 mt-1">Routes, timing and vehicle space are managed properly so the move stays organised from start to finish.</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-5 flex items-start gap-4">
              <MessagesSquare className="text-blue-600 shrink-0 mt-1" size={22} />
              <div>
                <p className="font-bold text-slate-900">Straight answers</p>
                <p className="text-sm text-slate-600 mt-1">Customers know what is happening, what is needed next and who is handling the job.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
