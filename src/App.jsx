import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Projects from './pages/Projects';
import SignInPage from './pages/SignInPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import ProjectsPage from './pages/dashboard/ProjectsPage';
import Donations from './pages/dashboard/Donations';
import AIInsights from './pages/dashboard/AIInsights';
import Reports from './pages/dashboard/Reports';

const AppContent = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isSignInRoute = location.pathname === '/signin';

  // Show Header and Footer on all pages except SignIn and Dashboard
  const showLayout = !isDashboardRoute && !isSignInRoute;

  return (
    <>
      {showLayout && <Header />}

      <Routes>
        {/* ✅ Landing Page — directly built here */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Stats />
              <Footer />
            </>
          }
        />

        {/* Projects Page */}
        <Route
          path="/projects"
          element={
            <>
              <Projects />
              <Footer />
            </>
          }
        />

        {/* Sign In Page (no header/footer) */}
        <Route path="/signin" element={<SignInPage />} />

        {/* Dashboard nested routes (no header/footer) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="donations" element={<Donations />} />
          <Route path="insights" element={<AIInsights />} />
          <Route path="reports" element={<Reports />} />
          {/* Settings route removed as requested */}
        </Route>
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;