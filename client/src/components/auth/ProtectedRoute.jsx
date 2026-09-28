import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Zap } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex flex-col items-center justify-center p-4">
        <div className="relative w-14 h-14 rounded-lg border border-steel/80 bg-charcoal p-0.5 shadow-steel-card mb-4 animate-pulse">
          <div className="w-full h-full bg-void rounded-[6px] flex items-center justify-center">
            <Zap className="w-6 h-6 text-crimson-400 animate-spin" />
          </div>
        </div>
        <p className="font-mono text-xs font-bold tracking-widest text-bone-100 uppercase">
          AUTHENTICATING ATHLETE...
        </p>
        <span className="text-[10px] font-mono text-ash mt-1">VERIFYING CREDENTIALS</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
