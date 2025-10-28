import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import './SignInPage.css';

const SignInPage = () => {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('donor');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignIn) {
      toast.success('Successfully signed in!');
      navigate('/dashboard');
    } else {
      toast.success('Account created successfully! Please sign in.');
      setName('');
      setEmail('');
      setPassword('');
      setRole('donor');
      setIsSignIn(true);
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
            <img 
              src="/reallogo.png" 
              alt="KANEC IMPACT LEDGER" 
              className="logo-image"
            />
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

            <button type="submit" className="auth-submit-btn">
              {isSignIn ? 'Sign In' : 'Sign Up'}
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