import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, ChevronRight, Shield, Dumbbell } from 'lucide-react';
import AnimeButton from './ui/AnimeButton';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Rankings', href: '#rankings' },
    { name: 'About', href: '#about' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-void/90 backdrop-blur-md border-b border-violet-neon/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent border-b border-slate-800/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Tagline */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-sm bg-gradient-to-br from-violet-neon to-cyan-neon p-0.5 shadow-glow-cyan transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-void flex items-center justify-center rounded-sm">
                <Zap className="w-5 h-5 text-cyan-neon group-hover:text-white transition-colors animate-pulse" />
              </div>
              <div className="absolute -inset-1 bg-cyan-neon/20 rounded-sm blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-orbitron font-black text-xl tracking-wider bg-gradient-to-r from-cyan-neon via-white to-violet-glow bg-clip-text text-transparent">
                  F-TRACK
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-neon/10 border border-cyan-neon/30 text-cyan-neon">
                  v1.0
                </span>
              </div>
              <span className="text-[10px] block font-orbitron tracking-widest text-violet-glow uppercase">
                Fitness Ascension
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative font-orbitron text-xs font-semibold tracking-wider text-slate-300 hover:text-cyan-neon transition-colors duration-200 py-1 group"
              >
                <span>{link.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-neon to-violet-neon transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('cta');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="font-orbitron text-xs font-bold tracking-wider text-slate-300 hover:text-cyan-neon px-4 py-2 transition-colors duration-200"
            >
              LOGIN
            </button>
            <AnimeButton
              variant="cyan"
              size="sm"
              icon={Zap}
              onClick={() => {
                const el = document.getElementById('cta');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              START ASCENSION
            </AnimeButton>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-sm border border-slate-700 bg-obsidian/80 text-slate-200 hover:text-cyan-neon hover:border-cyan-neon transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Animated Dropdown Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-b border-violet-neon/30 bg-void/95 backdrop-blur-xl px-4 pt-4 pb-6 space-y-4"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-orbitron text-sm font-semibold tracking-wider text-slate-200 hover:text-cyan-neon px-3 py-2 rounded border border-transparent hover:border-slate-800 hover:bg-obsidian transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-violet-glow" />
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full text-center font-orbitron text-sm font-bold tracking-wider py-2.5 rounded border border-slate-700 text-slate-200 hover:border-cyan-neon hover:text-cyan-neon transition-colors"
              >
                LOGIN
              </button>
              <AnimeButton
                variant="cyan"
                size="md"
                className="w-full"
                icon={Zap}
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                START ASCENSION
              </AnimeButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
