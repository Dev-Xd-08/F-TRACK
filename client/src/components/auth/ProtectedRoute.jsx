import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Zap } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex flex-col items-center justify-center p-4">
        <div className="relative w-16 h-16 rounded-xl bg-gradient-to-tr from-violet-neon to-cyan-neon p-0.5 shadow-glow-cyan mb-4 animate-pulse">
          <div className="w-full h-full bg-void rounded-[10px] flex items-center justify-center">
            <Zap className="w-8 h-8 text-cyan-neon animate-spin" />
          </div>
        </div>
        <p className="font-orbitron text-xs font-bold tracking-widest text-cyan-neon uppercase">
          SYNCHRONIZING WARRIOR MATRIX...
        </p>
        <span className="text-[10px] font-mono text-slate-500 mt-1">VERIFYING PORTAL CREDENTIALS</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
