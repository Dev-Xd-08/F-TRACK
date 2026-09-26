import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureSection from './components/FeatureSection';
import HowItWorks from './components/HowItWorks';
import RankSystem from './components/RankSystem';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export function App() {
  return (
    <div className="min-h-screen bg-void text-slate-100 selection:bg-cyan-neon selection:text-void overflow-x-hidden relative">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Landing Page Flow */}
      <main className="relative z-10">
        <Hero />
        <FeatureSection />
        <HowItWorks />
        <RankSystem />
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
