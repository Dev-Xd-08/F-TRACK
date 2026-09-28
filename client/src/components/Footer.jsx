import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Heart, Terminal, ArrowUp } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="about" className="border-t border-steel-800 bg-void text-ash-400 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-charcoal-800 border border-steel-700 flex items-center justify-center text-bone-100 shadow-steel-card">
                <Zap className="w-4 h-4 text-crimson-600" />
              </div>
              <div>
                <span className="font-orbitron font-black text-lg tracking-wider text-bone-100">
                  F-TRACK
                </span>
                <span className="text-[10px] block font-orbitron tracking-widest text-ash-400">
                  FITNESS ASCENSION
                </span>
              </div>
            </div>

            <p className="font-orbitron text-xs text-ash-300 tracking-widest uppercase">
              Train. Track. Ascend.
            </p>

            <p className="text-slate-400 text-xs sm:text-sm font-sans max-w-sm leading-relaxed">
              A disciplined, empirical fitness tracking platform built on the modern MERN stack. 
              Designed for athletes who treat every workout as a level-up quest.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3 font-orbitron text-xs">
            <h4 className="text-bone-100 font-bold tracking-wider uppercase mb-2">
              NAVIGATION
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#hero" className="hover:text-bone-100 transition-colors">Home</a>
              </li>
              <li>
                <a href="#features" className="hover:text-bone-100 transition-colors">Features</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-bone-100 transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#rankings" className="hover:text-bone-100 transition-colors">Rankings</a>
              </li>
              <li>
                <a href="#about" className="hover:text-bone-100 transition-colors">About System</a>
              </li>
            </ul>
          </div>

          {/* Portal Access & System Specs */}
          <div className="space-y-3 font-orbitron text-xs">
            <h4 className="text-bone-100 font-bold tracking-wider uppercase mb-2">
              PORTAL ACCESS
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/login"
                  className="hover:text-bone-100 transition-colors block"
                >
                  Login Portal
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-bone-100 transition-colors block"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <span className="text-ash-500">MERN Stack Engine</span>
              </li>
              <li>
                <span className="text-ash-500">Node v18+ • React 18</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-steel-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-ash-500">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-steel-500" />
            <span>F-TRACK: FITNESS ASCENSION © {new Date().getFullYear()} • ALL RIGHTS RESERVED</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 rounded border border-steel-700 bg-charcoal-900 hover:border-steel-600 hover:text-bone-100 transition-colors text-ash-400 shadow-steel-card"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
