import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import CountUp from './components/CountUp';
import Organization from './components/Organization';
import CommunityProject from './components/CommunityProject';
import BlockchainTransparency from './components/BlockchainTransparency';
import JoinMovement from './components/JoinMovement';
import OurVision from './components/OurVision';

// Pages
import Projects from './pages/Projects';
import SignInPage from './pages/SignInPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import ProjectsPage from './pages/dashboard/ProjectsPage';
import Donations from './pages/dashboard/Donations';
import AIInsights from './pages/dashboard/AIInsights';
import Reports from './pages/dashboard/Reports';

// Placeholder routes (optional)
const Login = () => <h2 style={{ textAlign: 'center', marginTop: '100px' }}>Login Page</h2>;

const AppContent = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isSignInRoute = location.pathname === '/signin' || location.pathname === '/login';

  // Show Header and Footer on all pages except SignIn/Login and Dashboard
  const showLayout = !isDashboardRoute && !isSignInRoute;

  return (
    <>
      {showLayout && <Header />}

      <Routes>
        {/* ✅ Full Landing Page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <CountUp />
              <Organization />
              <CommunityProject />
              <BlockchainTransparency />
              <JoinMovement />
              <OurVision />
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

        {/* Donations Page */}
        <Route
          path="/donations"
          element={
            <>
              <Donations />
              <Footer />
            </>
          }
        />

        {/* Sign In / Login Page */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard Routes (no header/footer) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="donations" element={<Donations />} />
          <Route path="insights" element={<AIInsights />} />
          <Route path="reports" element={<Reports />} />
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
