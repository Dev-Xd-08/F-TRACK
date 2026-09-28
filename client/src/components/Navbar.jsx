import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, ChevronRight, LogOut, Shield, User, Dumbbell, Scale, Brain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimeButton from './ui/AnimeButton';
import NotificationBell from './notifications/NotificationBell';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#hero' },
    { name: 'Features', href: '/#features' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Rankings', href: '/#rankings' },
    { name: 'About', href: '/#about' },
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(href);
    } else {
      const targetId = href.replace('/#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-void/95 backdrop-blur-md border-b border-gunmetal shadow-[0_8px_24px_rgba(0,0,0,0.8)]'
          : 'bg-void/80 border-b border-gunmetal/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* System Insignia & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded bg-charcoal border border-steel flex items-center justify-center transition-colors group-hover:border-crimson">
              <Zap className="w-4 h-4 text-crimson transition-transform group-hover:scale-110" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-black text-lg tracking-wider text-offwhite">
                  F-TRACK
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-charcoal border border-steel-muted text-ash">
                  SYSTEM
                </span>
              </div>
              <span className="text-[9px] block font-orbitron tracking-widest text-ash uppercase">
                Fitness Ascension
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="relative font-orbitron text-xs font-semibold tracking-wider text-ash hover:text-offwhite transition-colors duration-150 py-1 group cursor-pointer"
              >
                <span>{link.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-crimson transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop Right Action Buttons (Authenticated vs Logged Out) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/workouts"
                  className="font-orbitron text-xs font-bold tracking-wider text-bone hover:text-offwhite px-2.5 py-2 transition-colors duration-150 flex items-center gap-1.5"
                >
                  <Dumbbell className="w-3.5 h-3.5 text-ash" />
                  <span>WORKOUTS</span>
                </Link>

                <Link
                  to="/intelligence"
                  className="font-orbitron text-xs font-bold tracking-wider text-bone hover:text-offwhite px-2.5 py-2 transition-colors duration-150 flex items-center gap-1.5"
                >
                  <Brain className="w-3.5 h-3.5 text-ash" />
                  <span>INTELLIGENCE</span>
                </Link>

                <Link
                  to="/body-analysis"
                  className="font-orbitron text-xs font-bold tracking-wider text-bone hover:text-offwhite px-2.5 py-2 transition-colors duration-150 flex items-center gap-1.5"
                >
                  <Scale className="w-3.5 h-3.5 text-ash" />
                  <span>BODY SCAN</span>
                </Link>

                <Link
                  to="/profile"
                  className="font-orbitron text-xs font-bold tracking-wider text-bone hover:text-offwhite px-2.5 py-2 transition-colors duration-150 flex items-center gap-1.5"
                  title="Athlete Profile"
                >
                  <User className="w-3.5 h-3.5 text-ash" />
                  <span>PROFILE</span>
                </Link>

                <Link to="/dashboard">
                  <AnimeButton variant="crimson" size="sm" icon={Shield}>
                    DASHBOARD
                  </AnimeButton>
                </Link>

                <NotificationBell />

                <button
                  onClick={handleLogout}
                  className="font-orbitron text-xs font-bold tracking-wider text-ash hover:text-crimson px-2.5 py-2 transition-colors duration-150 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>LOGOUT</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-orbitron text-xs font-bold tracking-wider text-bone hover:text-offwhite px-4 py-2 transition-colors duration-150"
                >
                  LOGIN
                </Link>
                <Link to="/register">
                  <AnimeButton variant="crimson" size="sm" icon={Zap}>
                    ENTER SYSTEM
                  </AnimeButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded bg-charcoal border border-steel text-bone hover:text-offwhite hover:border-crimson transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-gunmetal bg-void/98 px-4 pt-4 pb-6 space-y-4"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="font-orbitron text-xs font-semibold tracking-wider text-bone hover:text-offwhite px-3 py-2.5 rounded bg-charcoal/50 border border-transparent hover:border-steel transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-ash" />
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-gunmetal flex flex-col gap-2.5">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-xs font-mono text-bone bg-charcoal rounded border border-steel flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-crimson" />
                      <span>ATHLETE: {user?.name || 'TRAINEE'}</span>
                    </div>
                    <span className="text-[10px] font-orbitron font-bold text-ash">
                      PROFILE →
                    </span>
                  </Link>

                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <AnimeButton variant="crimson" size="md" className="w-full" icon={Shield}>
                      DASHBOARD
                    </AnimeButton>
                  </Link>
                  <Link to="/workouts" onClick={() => setMobileMenuOpen(false)}>
                    <AnimeButton variant="outline" size="md" className="w-full" icon={Dumbbell}>
                      WORKOUTS
                    </AnimeButton>
                  </Link>
                  <Link to="/intelligence" onClick={() => setMobileMenuOpen(false)}>
                    <AnimeButton variant="outline" size="md" className="w-full" icon={Brain}>
                      INTELLIGENCE
                    </AnimeButton>
                  </Link>
                  <Link to="/body-analysis" onClick={() => setMobileMenuOpen(false)}>
                    <AnimeButton variant="outline" size="md" className="w-full" icon={Scale}>
                      BODY ANALYSIS
                    </AnimeButton>
                  </Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <AnimeButton variant="outline" size="md" className="w-full" icon={User}>
                      PROFILE
                    </AnimeButton>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center font-orbitron text-xs font-bold tracking-wider py-2.5 rounded border border-gunmetal text-ash hover:text-crimson hover:border-crimson/50 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>LOGOUT</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center font-orbitron text-xs font-bold tracking-wider py-2.5 rounded border border-steel text-bone hover:border-crimson hover:text-offwhite transition-colors"
                  >
                    LOGIN
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <AnimeButton variant="crimson" size="md" className="w-full" icon={Zap}>
                      ENTER SYSTEM
                    </AnimeButton>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
