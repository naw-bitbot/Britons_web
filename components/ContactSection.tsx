import React from 'react';
import { Mail, Phone, MapPin, Clock, Globe } from 'lucide-react';
import { COMPANY_INFO } from '../constants';
import QuoteForm from './QuoteForm';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Talk to a team that understands European household removals</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                If you are planning a move to or from Spain, France, Germany, Italy or elsewhere in Europe, we can help you get it properly organised. We will talk through volume, access, packing, timing and any customs or storage requirements, then give you a clear, practical next step.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Head Office</h4>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                    {COMPANY_INFO.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                  <Phone className="text-blue-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Call Us</h4>
                  <p className="text-slate-900 font-bold mt-1">{COMPANY_INFO.phone}</p>
                  <p className="text-slate-500 text-xs uppercase tracking-tighter">Mon-Fri 8am-6pm</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email Us</h4>
                  <p className="text-slate-600 text-sm mt-1">{COMPANY_INFO.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                  <Clock className="text-blue-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">European Routes</h4>
                  <p className="text-slate-600 text-sm mt-1 font-medium">Regular scheduled departures</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
              <Globe className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10" />
              <h4 className="text-xl font-bold mb-3 relative z-10">Experienced in moves across Europe</h4>
              <p className="text-blue-100 relative z-10 leading-relaxed">
                From Spain and France to Germany, Italy and other European destinations, we handle the practical side of household removals properly: planning, packing, loading, paperwork, storage and delivery.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100">
            <QuoteForm title="Speak to our removals team" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
