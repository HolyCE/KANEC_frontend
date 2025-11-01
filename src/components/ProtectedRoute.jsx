import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to signin');
    
    const redirectPath = location.pathname + location.search;
    
    // ONLY save non-dashboard paths for redirect
    const isDashboardPath = redirectPath.startsWith('/dashboard');
    const isAuthPath = ['/signin', '/signup', '/verify-email'].includes(location.pathname);
    
    if (!isDashboardPath && !isAuthPath) {
      // Save the attempted URL for redirect after login
      localStorage.setItem('redirectAfterLogin', redirectPath);
      sessionStorage.setItem('redirectAfterLogin', redirectPath);
      console.log('Saved redirect path:', redirectPath);
    } else {
      // Clear any existing dashboard redirect paths
      localStorage.removeItem('redirectAfterLogin');
      sessionStorage.removeItem('redirectAfterLogin');
      console.log('Cleared dashboard redirect path:', redirectPath);
    }
    
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;