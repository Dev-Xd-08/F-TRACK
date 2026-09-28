import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ui/ToastContainer';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import BodyAnalysis from './pages/BodyAnalysis';
import Profile from './pages/Profile';
import DeepIntelligencePage from './pages/DeepIntelligencePage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Authentication Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Ascension Chamber / Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Workout Quests Page */}
            <Route
              path="/workouts"
              element={
                <ProtectedRoute>
                  <Workouts />
                </ProtectedRoute>
              }
            />

            {/* Protected Body Analysis & Calorie Core Page */}
            <Route
              path="/body-analysis"
              element={
                <ProtectedRoute>
                  <BodyAnalysis />
                </ProtectedRoute>
              }
            />

            {/* Protected Hunter Dossier / Profile Page */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Protected Deep Personal Intelligence Page */}
            <Route
              path="/intelligence"
              element={
                <ProtectedRoute>
                  <DeepIntelligencePage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Gamified Notification Toast Layer */}
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
