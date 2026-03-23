
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQS } from '../constants';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div key={index} className="border-b border-slate-200 pb-4">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center py-4 text-left group"
              >
                <span className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {faq.question}
                </span>
                {openIndex === index ? <ChevronUp className="text-blue-600" /> : <ChevronDown className="text-slate-400" />}
              </button>
              {openIndex === index && (
                <div className="pb-4 text-slate-600 leading-relaxed animate-fade-in-down">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
