
import React from 'react';
import { ArrowRight } from 'lucide-react';
// Fix: Changed SERVICES to DETAILED_SERVICES because SERVICES is not exported from constants.tsx
import { DETAILED_SERVICES } from '../constants';

const Services: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Our Services</h2>
          <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Fix: Map over DETAILED_SERVICES instead of the non-existent SERVICES export */}
          {DETAILED_SERVICES.map((service, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
            >
              <div className="mb-6 p-4 bg-blue-50 w-fit rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
              <p className="text-slate-600 mb-6 flex-grow leading-relaxed">
                {service.description}
              </p>
              <a 
                href="#" 
                className="inline-flex items-center text-blue-600 font-bold group-hover:translate-x-2 transition-transform"
              >
                Learn More <ArrowRight size={18} className="ml-2" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
