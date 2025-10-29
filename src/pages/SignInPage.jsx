import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api'; // Import our API helper
import './SignInPage.css';
import axios from 'axios';

const SignInPage = () => {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('donor');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  // Health Check on Mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await api.call(api.health);
        console.log('API Health Check:', health);
        toast.success('Backend connected!');
      } catch (err) {
        console.error('Health Check Failed:', err);
        toast.error('Backend not reachable');
      }
    };

    checkHealth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
  if (isSignIn) {
    console.log('🔧 DEBUG: Testing both methods');
    
    // Test direct axios
    console.log('1. Testing direct axios...');
    const directResponse = await axios.post('http://46.101.103.22:8001/api/v1/auth/login', {
      email, password
    });
    console.log('Direct axios success:', directResponse.data);
    
    // Test api.call
    console.log('2. Testing api.call...');
    console.log('api.auth.login:', api.auth.login);
    
    const apiCallResponse = await api.call(api.auth.login, {
      data: { email, password }
    });
    console.log('api.call success:', apiCallResponse);
    
    // Use whichever works
    const response = directResponse.data || apiCallResponse;
    localStorage.setItem('access_token', response.token || response.access_token);
    toast.success('Successfully signed in!');
    navigate('/dashboard');
  }
} catch (error) {
  console.error('Auth Error:', error);
}
    // try {
    //   if (isSignIn) {
    //     // Sign In
    //               console.log('Logging in with:', { email, password });

    //     // const response = await api.call(api.auth.login, {
    //     //   data: { email, password },
    //     // });

    //        // FIX: Pass data directly, not wrapped in {data: ...}
    // const response = await api.call(api.auth.login, {
    //   email, 
    //   password
    // });

    //     // Save token
    //     localStorage.setItem('access_token', response.token || response.access_token);
    //     toast.success('Successfully signed in!');
    //     navigate('/dashboard');
    //   } else {
    //     // Sign Up
    //     const response = await api.call(api.auth.register, {
    //       data: { name, email, password, role },
    //     });

    //     toast.success('Account created! Please sign in.');
    //     setName('');
    //     setEmail('');
    //     setPassword('');
    //     setRole('donor');
    //     setIsSignIn(true);
    //   }
    // } catch (error) {
    //   const msg = error.response?.data?.detail || error.message || 'Something went wrong';
    //   toast.error(msg);
    //   console.error('Auth Error:', error);
    // } finally {
    //   setLoading(false);
    // }

//     try {
//   console.log('=== AUTH PROCESS STARTED ===');
//   console.log('isSignIn mode:', isSignIn);
  
//   if (isSignIn) {
//     // Sign In
//     console.log('🔐 SIGN IN FLOW');
//     console.log('1. Input credentials:', { email, password });

//     console.log('2. Making API call to:', 'http://46.101.103.22:8001/api/v1/auth/login');
//     console.log('3. Request payload:', { email, password });
//     console.log('4. Request headers:', { 'Content-Type': 'application/json' });

//     // Direct API call with full configuration
//     const response = await axios.post('http://46.101.103.22:8001/api/v1/auth/login', {
//       email: email,
//       password: password
//     }, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });

//     console.log('5. ✅ API Response received!');
//     console.log('6. Full response object:', response);
//     console.log('7. Response status:', response.status);
//     console.log('8. Response data:', response.data);
//     console.log('9. Response headers:', response.headers);

//     // Save token
//     console.log('10. Extracting token from response...');
//     const token = response.data.token || response.data.access_token;
//     console.log('11. Token found:', token ? 'Yes' : 'No');
//     console.log('12. Token value:', token);

//     if (token) {
//       console.log('13. Saving token to localStorage...');
//       localStorage.setItem('access_token', token);
//       console.log('14. Token saved successfully');
      
//       console.log('15. Showing success toast');
//       toast.success('Successfully signed in!');
      
//       console.log('16. Navigating to dashboard...');
//       navigate('/dashboard');
//       console.log('17. ✅ SIGN IN COMPLETED SUCCESSFULLY');
//     } else {
//       console.log('13. ❌ No token received from server');
//       throw new Error('No token received from server');
//     }
//   } else {
//     // Sign Up
//     console.log('📝 SIGN UP FLOW');
//     console.log('1. User data:', { name, email, password, role });
    
//     console.log('2. Making registration API call...');
//     const response = await api.call(api.auth.register, {
//       data: { name, email, password, role },
//     });

//     console.log('3. ✅ Registration response:', response);
    
//     console.log('4. Showing success toast');
//     toast.success('Account created! Please sign in.');
    
//     console.log('5. Clearing form fields...');
//     setName('');
//     setEmail('');
//     setPassword('');
//     setRole('donor');
//     setIsSignIn(true);
    
//     console.log('6. Form fields cleared, switching to sign in mode');
//     console.log('7. ✅ SIGN UP COMPLETED SUCCESSFULLY');
//   }
// } catch (error) {
//   console.log('❌ ERROR HANDLER TRIGGERED');
//   console.log('Error object:', error);
//   console.log('Error response:', error.response);
//   console.log('Error response data:', error.response?.data);
//   console.log('Error response status:', error.response?.status);
//   console.log('Error message:', error.message);
  
//   const msg = error.response?.data?.detail || error.response?.data?.message || error.message || 'Something went wrong';
//   console.log('Final error message to display:', msg);
  
//   toast.error(msg);
//   console.error('Auth Error:', error);
// } finally {
//   console.log('🏁 FINALLY BLOCK - Cleaning up');
//   setLoading(false);
//   console.log('Loading state set to false');
//   console.log('=== AUTH PROCESS COMPLETED ===');
// }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <button className="back-to-home" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <div className="auth-card">
          <div className="auth-logo">
            <Leaf size={32} className="auth-leaf-icon" />
          </div>

          <h1 className="auth-title">Welcome to Kanec</h1>
          <p className="auth-subtitle">
            Join us in making a difference through transparent,
            blockchain-powered donations
          </p>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${isSignIn ? 'active' : ''}`}
              onClick={() => setIsSignIn(true)}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${!isSignIn ? 'active' : ''}`}
              onClick={() => setIsSignIn(false)}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isSignIn && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
                <div className="password-field">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="show-pass-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff size={18} strokeWidth={1.8} />
                    ) : (
                      <Eye size={18} strokeWidth={1.8} />
                    )}
                  </button>
                </div>
            </div>

            {!isSignIn && (
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="donor">Donor</option>
                  <option value="org">Organization</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Loading...' : isSignIn ? 'Sign In' : 'Sign Up'}
            </button>

            <p className="auth-terms">
              By continuing, you agree to our{' '}
              <a href="#">Terms of Service</a> and{' '}
              <a href="#">Privacy Policy</a>
            </p>
          </form>
        </div>

        <p className="auth-footer">
          Powered by blockchain technology for maximum transparency
        </p>
      </div>
    </div>
  );
};

export default SignInPage;