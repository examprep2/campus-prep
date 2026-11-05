import React, { useState } from 'react';
import Navbar from '../features/landing/components/Navbar';
import HeroSection from '../features/landing/components/HeroSection';
import FeatureGrid from '../features/landing/components/FeatureGrid';
import HowItWorks from '../features/landing/components/HowItWorks';
import SupportedBranches from '../features/landing/components/SupportedBranches';
import FinalCTA from '../features/landing/components/FinalCTA';
import Footer from '../features/landing/components/Footer';

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#F7F8FC] dark:bg-[#0F1117] text-[#172033] dark:text-[#F1F5F9] font-sans selection:bg-[#3157D5]/15 selection:text-[#3157D5] dark:selection:bg-[#6B8CFF]/20 dark:selection:text-[#6B8CFF] transition-colors">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Hero Section with Product Preview */}
        <HeroSection />

        {/* Core Features */}
        <FeatureGrid />

        {/* 4-Step Workflow */}
        <HowItWorks />

        {/* Supported Branches */}
        <SupportedBranches />

        {/* Final CTA */}
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
