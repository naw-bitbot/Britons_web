
import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { DETAILED_SERVICES } from '../constants';

const SERVICE_IMAGES: Record<string, string> = {
  'full-house': 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?q=80&w=1200&auto=format&fit=crop',
  'part-loads': '/britons-removals-storage-derby-2.png', // Navy blue truck
  'packing': 'https://images.unsplash.com/photo-1520038410233-7141be7e6f97?q=80&w=1200&auto=format&fit=crop',
  'storage': 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=1200&auto=format&fit=crop', // Verified warehouse storage
};

const DetailedServices: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">Professional Excellence</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3 mb-6">Services Offered</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Tailored relocation solutions designed for the unique challenges of UK-Spain removals.
          </p>
        </div>

        <div className="space-y-24">
          {DETAILED_SERVICES.map((service, index) => (
            <div 
              key={service.id} 
              className={`flex flex-col lg:items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
            >
              <div className="flex-1 space-y-6">
                <div className="inline-block p-4 bg-blue-50 rounded-2xl">
                  {service.icon}
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{service.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {service.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  {service.advantages.map((adv, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <CheckCircle className="text-green-500 shrink-0 mt-1" size={18} />
                      <span className="text-slate-700 font-medium">{adv}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border-l-4 border-blue-600 mt-8">
                  <h4 className="font-bold text-slate-900 mb-2">The Process:</h4>
                  <p className="text-slate-600 italic">"{service.process}"</p>
                </div>
                
                <button className="inline-flex items-center text-blue-600 font-bold hover:translate-x-2 transition-transform mt-4">
                  Request detailed guide <ArrowRight size={18} className="ml-2" />
                </button>
              </div>

              <div className="flex-1 bg-slate-100 rounded-3xl overflow-hidden aspect-video shadow-2xl relative group">
                <img 
                  src={SERVICE_IMAGES[service.id]} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailedServices;
