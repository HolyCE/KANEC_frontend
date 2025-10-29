import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api'; // Import our API helper
import './SignInPage.css';

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
        // Sign In
        const response = await api.call(api.auth.login, {
          data: { email, password },
        });

        // Save token
        localStorage.setItem('access_token', response.token || response.access_token);
        toast.success('Successfully signed in!');
        navigate('/dashboard');
      } else {
        // Sign Up
        const response = await api.call(api.auth.register, {
          data: { name, email, password, role },
        });

        toast.success('Account created! Please sign in.');
        setName('');
        setEmail('');
        setPassword('');
        setRole('donor');
        setIsSignIn(true);
      }
    } catch (error) {
      const msg = error.response?.data?.detail || error.message || 'Something went wrong';
      toast.error(msg);
      console.error('Auth Error:', error);
    } finally {
      setLoading(false);
    }
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