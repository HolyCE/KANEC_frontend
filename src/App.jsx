import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Components
import Navbar from './newcomponents/Navbar';
import Hero from './newcomponents/Hero';
import Stats from './newcomponents/Stats';
import Partners from './newcomponents/Partners';
import WhyChoose from './newcomponents/WhyChoose';
import BlockchainSection from './newcomponents/BlockchainSection';
import CTASection from './newcomponents/CTASection';
import Vision from './newcomponents/Vision';
import Footer from './newcomponents/Footer';

// Pages
import ProjectsPage from './pages/Projects';
import SignInPage from './pages/SignInPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import DashboardProjects from './pages/dashboard/ProjectsPage';
import Donations from './pages/dashboard/Donations'; // Import the Donations component
import AIInsights from './pages/dashboard/AIInsights';
import Reports from './pages/dashboard/Reports';
import Settings from './pages/dashboard/Settings';

// Placeholder components
const Login = () => <h2 style={{ textAlign: 'center', marginTop: '100px' }}>Login Page</h2>;

// Wrapper component to add space for fixed navbar
const PageWrapper = ({ children }) => {
  return (
    <div style={{ paddingTop: '80px' }}> {/* Adjust this value based on your navbar height */}
      {children}
    </div>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isSignInRoute = location.pathname === '/signin' || location.pathname === '/login';

  // Show Navbar and Footer on all pages except SignIn/Login and Dashboard
  const showLayout = !isDashboardRoute && !isSignInRoute;

  return (
    <>
      {showLayout && <Navbar />}

      <Routes>
        {/* ✅ New Landing Page Structure */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Stats />
              <Partners />
              <WhyChoose />
              <BlockchainSection />
              <CTASection />
              <Vision />
              <Footer />
            </>
          }
        />

        {/* Projects Page */}
        <Route
          path="/projects"
          element={
            <PageWrapper>
              <ProjectsPage />
              <Footer />
            </PageWrapper>
          }
        />

        {/* Donors Page - Now using the Donations component */}
        <Route
          path="/donors"
          element={
            <PageWrapper>
              <Donations />
              <Footer />
            </PageWrapper>
          }
        />

        {/* Sign In / Login Page */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard Routes (no navbar/footer) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<DashboardProjects />} />
          <Route path="donations" element={<Donations />} />
          <Route path="insights" element={<AIInsights />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
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