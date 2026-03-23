
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import DetailedServices from './components/DetailedServices';
import QuickQuoteCalculator from './components/QuickQuoteCalculator';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import QuoteModal from './components/QuoteModal';
import YourMove from './components/YourMove';
import AdminPortal from './components/AdminPortal';
import { View } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const navigateTo = (newView: View) => {
    setView(newView);
    setIsQuoteModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onNavigate={navigateTo} currentView={view} />
      
      <main className="flex-grow">
        {view === 'home' && (
          <>
            <Hero onOpenQuote={() => navigateTo('quote')} />
            <DetailedServices />
            <Testimonials />
            <FAQ />
            <ContactSection />
          </>
        )}
        
        {view === 'quote' && (
          <div className="pt-20">
            <QuickQuoteCalculator onRequestFullQuote={() => setIsQuoteModalOpen(true)} />
          </div>
        )}

        {view === 'your-move' && (
          <div className="pt-20">
            <YourMove />
          </div>
        )}

        {view === 'admin' && (
          <div className="pt-20">
            <AdminPortal />
          </div>
        )}
      </main>
      
      <footer className="mt-auto">
        <Footer onNavigate={navigateTo} />
      </footer>
      
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </div>
  );
};

export default App;
