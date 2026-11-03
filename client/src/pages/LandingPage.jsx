import React, { useState, useMemo } from 'react';
import { Check, X, Download, ShieldCheck } from 'lucide-react';

// Modular Feature Components
import Navbar from '../features/landing/components/Navbar';
import HeroSection from '../features/landing/components/HeroSection';
import DepartmentPillBar from '../features/landing/components/DepartmentPillBar';
import LiveVaultPreview from '../features/landing/components/LiveVaultPreview';
import FeatureGrid from '../features/landing/components/FeatureGrid';
import ContributorBanner from '../features/landing/components/ContributorBanner';
import Footer from '../features/landing/components/Footer';

// Centralized Landing Data
import {
  DEPARTMENTS,
  HERO_STATS,
  VAULT_ITEMS,
  PRECISION_FEATURES,
  TOP_CONTRIBUTORS,
} from '../features/landing/data/landingData';

export default function LandingPage() {
  // Page-Level Lifted State
  const [activeBranch, setActiveBranch] = useState('COMPS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSem, setSelectedSem] = useState('Semester 7');
  const [downloadToast, setDownloadToast] = useState(null);
  const [activePreviewDoc, setActivePreviewDoc] = useState(null);
  const [downloadCountTracker, setDownloadCountTracker] = useState({});

  // Dynamic Filtering: Department stream & global search query
  const filteredMaterials = useMemo(() => {
    return VAULT_ITEMS.filter((item) => {
      const matchesBranch = activeBranch === 'ALL' || item.branch === activeBranch;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subjectCode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBranch && matchesSearch;
    });
  }, [activeBranch, searchQuery]);

  // Download Handler with Toast Feedback
  const handleDownload = (item) => {
    setDownloadCountTracker((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || item.downloads) + 1,
    }));
    setDownloadToast(`Starting instant download for "${item.title.slice(0, 35)}..."`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3800);
  };

  const handleUploadClick = () => {
    setDownloadToast('Opening notes contributor upload modal...');
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const handleBecomeContributor = () => {
    setDownloadToast('Opening verified academic contributor application...');
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const handleSelectBranch = (branchId) => {
    setActiveBranch(branchId);
  };

  return (
    <div
      className="min-h-screen text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200 font-sans relative overflow-x-hidden"
      style={{
        background:
          'linear-gradient(135deg, rgb(11, 8, 20) 0%, rgb(21, 13, 42) 50%, rgb(13, 9, 24) 100%)',
      }}
    >
      {/* =========================================================================
          AMBIENT GLOW EFFECTS (as defined in DESIGN.md)
         ========================================================================= */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-transparent blur-[120px] rounded-full"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-96 right-10 w-[420px] h-[300px] bg-violet-400/15 blur-[100px] rounded-full"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-[1400px] -left-20 w-[500px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-40 right-1/4 w-[600px] h-[320px] bg-purple-600/10 blur-[140px] rounded-full"
        aria-hidden="true"
      />

      {/* Sticky Modular Navigation */}
      <Navbar
        activeBranch={activeBranch}
        selectedSem={selectedSem}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onUploadClick={handleUploadClick}
      />

      {/* Floating Download Toast Feedback */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/95 border border-indigo-500/40 text-slate-100 shadow-2xl backdrop-blur-xl animate-bounce">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium font-sans">{downloadToast}</span>
          <button
            type="button"
            onClick={() => setDownloadToast(null)}
            className="text-slate-400 hover:text-slate-200 ml-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-24 space-y-20 lg:space-y-28">
        {/* Hero Section with Social Proof Counters */}
        <HeroSection
          stats={HERO_STATS}
          onUploadClick={handleUploadClick}
        />

        {/* Department Selector Pill Bar */}
        <DepartmentPillBar
          departments={DEPARTMENTS}
          activeBranch={activeBranch}
          onSelectBranch={handleSelectBranch}
        />

        {/* Live Vault Preview Section */}
        <LiveVaultPreview
          activeBranch={activeBranch}
          selectedSem={selectedSem}
          onSelectSem={setSelectedSem}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          materials={filteredMaterials}
          downloadCountTracker={downloadCountTracker}
          onDownload={handleDownload}
          onQuickView={setActivePreviewDoc}
        />

        {/* Precision Engineering Features Grid */}
        <FeatureGrid features={PRECISION_FEATURES} />

        {/* Contributor Callout Banner */}
        <ContributorBanner
          contributors={TOP_CONTRIBUTORS}
          onBecomeContributor={handleBecomeContributor}
        />
      </main>

      {/* Quick View Inspection Modal */}
      {activePreviewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div
            className="w-full max-w-2xl rounded-3xl border p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200"
            style={{
              background: 'rgba(18, 12, 34, 0.95)',
              borderColor: 'rgba(139, 92, 246, 0.4)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-violet-500/20 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-50/10 text-indigo-400 border border-indigo-500/30 font-mono text-[11px]">
                    {activePreviewDoc.subjectCode}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {activePreviewDoc.branch} • {activePreviewDoc.semester}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-white">
                  {activePreviewDoc.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePreviewDoc(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-violet-500/20 space-y-3 font-mono text-xs text-slate-300">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span>Author: {activePreviewDoc.author}</span>
                <span>
                  {activePreviewDoc.fileSize} • {activePreviewDoc.pages} Pages
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed font-sans">
                "This document covers high-probability questions for {activePreviewDoc.subject}.
                Includes step-by-step mathematical proofs, solved Mumbai University past papers,
                and quick concept synthesis charts."
              </p>
              <div className="flex items-center gap-2 pt-2 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Clean PDF • OCR Optimized for Tablets & E-readers</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActivePreviewDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownload(activePreviewDoc);
                  setActivePreviewDoc(null);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/25 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Full PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Directory & Disclaimer Footer */}
      <Footer
        departments={DEPARTMENTS}
        onSelectBranch={handleSelectBranch}
      />
    </div>
  );
}
