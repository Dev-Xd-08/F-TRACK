import React from 'react';
import { Zap, Shield, Heart, Terminal, ArrowUp } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="about" className="border-t border-slate-800 bg-void-pure text-slate-400 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-violet-neon to-cyan-neon p-0.5 shadow-glow-cyan">
                <div className="w-full h-full bg-void flex items-center justify-center rounded-sm">
                  <Zap className="w-4 h-4 text-cyan-neon" />
                </div>
              </div>
              <div>
                <span className="font-orbitron font-black text-lg tracking-wider text-slate-100">
                  F-TRACK
                </span>
                <span className="text-[10px] block font-orbitron tracking-widest text-violet-glow">
                  FITNESS ASCENSION
                </span>
              </div>
            </div>

            <p className="font-orbitron text-xs text-cyan-neon tracking-widest uppercase">
              Train. Track. Ascend.
            </p>

            <p className="text-slate-400 text-xs sm:text-sm font-sans max-w-sm leading-relaxed">
              An original anime-inspired, gamified fitness tracking web application built on the modern MERN stack. 
              Designed for athletes who treat every workout as a level-up quest.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3 font-orbitron text-xs">
            <h4 className="text-slate-200 font-bold tracking-wider uppercase mb-2">
              NAVIGATION
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#hero" className="hover:text-cyan-neon transition-colors">Home</a>
              </li>
              <li>
                <a href="#features" className="hover:text-cyan-neon transition-colors">Features</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-cyan-neon transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#rankings" className="hover:text-cyan-neon transition-colors">Rankings</a>
              </li>
              <li>
                <a href="#about" className="hover:text-cyan-neon transition-colors">About System</a>
              </li>
            </ul>
          </div>

          {/* Portal Access & System Specs */}
          <div className="space-y-3 font-orbitron text-xs">
            <h4 className="text-slate-200 font-bold tracking-wider uppercase mb-2">
              PORTAL ACCESS
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => alert('Login portal will be connected in Stage 3 (JWT Auth)!')}
                  className="hover:text-cyan-neon transition-colors text-left"
                >
                  Login Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Hunter registration will be connected in Stage 3 (JWT Auth)!')}
                  className="hover:text-cyan-neon transition-colors text-left"
                >
                  Hunter Registration
                </button>
              </li>
              <li>
                <span className="text-slate-500">MERN Stack Engine</span>
              </li>
              <li>
                <span className="text-slate-500">Node v18+ • React 18</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-neon" />
            <span>F-TRACK: FITNESS ASCENSION © {new Date().getFullYear()} • ALL RIGHTS RESERVED</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 rounded border border-slate-800 bg-obsidian hover:border-cyan-neon hover:text-cyan-neon transition-colors text-slate-400"
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
