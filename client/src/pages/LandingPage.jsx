import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import HowItWorks from '../components/HowItWorks';
import RankSystem from '../components/RankSystem';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-void text-slate-100 selection:bg-crimson-900 selection:text-bone-100 overflow-x-hidden relative">
      {/* Top Sticky Navbar */}
      <Navbar />

      {/* Main Content Sections */}
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
};

export default LandingPage;
