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
  
  // Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (forgotPasswordStep === 1) {
      // Send OTP logic would go here
      toast.success('OTP sent to your email!');
      setForgotPasswordStep(2);
    } else if (forgotPasswordStep === 2) {
      // Verify OTP logic would go here
      if (otp.length === 6) {
        toast.success('OTP verified!');
        setForgotPasswordStep(3);
      } else {
        toast.error('Please enter a valid 6-digit OTP');
      }
    } else if (forgotPasswordStep === 3) {
      // Reset password logic would go here
      if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match!');
        return;
      }
      if (newPassword.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }
      
      toast.success('Password reset successfully! Please sign in.');
      resetForgotPasswordFlow();
      setShowForgotPassword(false);
      setIsSignIn(true);
    }
  };

  const resetForgotPasswordFlow = () => {
    setForgotPasswordStep(1);
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleBackToSignIn = () => {
    setShowForgotPassword(false);
    resetForgotPasswordFlow();
  };

  const handleBackToEmail = () => {
    setForgotPasswordStep(1);
    setOtp('');
  };

  const handleBackToOtp = () => {
    setForgotPasswordStep(2);
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <button 
          className="back-to-home" 
          onClick={() => {
            if (showForgotPassword) {
              handleBackToSignIn();
            } else {
              navigate('/');
            }
          }}
        >
          <ArrowLeft size={16} />
          <span>
            {showForgotPassword ? 'Back to Sign In' : 'Back to Home'}
          </span>
        </button>

        <div className="auth-card">
          <div className="auth-logo">
            <img 
              src="/reallogo.png" 
              alt="KANEC IMPACT LEDGER" 
              className="logo-image"
            />
          </div>

          {showForgotPassword ? (
            // Forgot Password Flow
            <>
              <h1 className="auth-title">
                {forgotPasswordStep === 1 && 'Reset Your Password'}
                {forgotPasswordStep === 2 && 'Enter Verification Code'}
                {forgotPasswordStep === 3 && 'Create New Password'}
              </h1>
              
              <p className="auth-subtitle">
                {forgotPasswordStep === 1 && 'Enter your email address to receive a verification code'}
                {forgotPasswordStep === 2 && `We sent a 6-digit code to ${email}`}
                {forgotPasswordStep === 3 && 'Enter your new password and confirm it'}
              </p>

              <div className="forgot-password-steps">
                <div className={`step ${forgotPasswordStep >= 1 ? 'active' : ''}`}>
                  <div className="step-number">1</div>
                  <span>Email</span>
                </div>
                <div className={`step-line ${forgotPasswordStep >= 2 ? 'active' : ''}`}></div>
                <div className={`step ${forgotPasswordStep >= 2 ? 'active' : ''}`}>
                  <div className="step-number">2</div>
                  <span>Verify</span>
                </div>
                <div className={`step-line ${forgotPasswordStep >= 3 ? 'active' : ''}`}></div>
                <div className={`step ${forgotPasswordStep >= 3 ? 'active' : ''}`}>
                  <div className="step-number">3</div>
                  <span>Reset</span>
                </div>
              </div>

              <form onSubmit={handleForgotPassword} className="auth-form">
                {/* Step 1: Email Input */}
                {forgotPasswordStep === 1 && (
                  <div className="form-group">
                    <label htmlFor="forgot-email">Email Address</label>
                    <input
                      id="forgot-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Step 2: OTP Input */}
                {forgotPasswordStep === 2 && (
                  <>
                    <div className="form-group">
                      <label htmlFor="otp">Verification Code</label>
                      <input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                        required
                        className="otp-input"
                      />
                      <div className="otp-hint">Enter the 6-digit code sent to your email</div>
                    </div>
                    
                    <div className="forgot-password-actions">
                      <button
                        type="button"
                        className="back-button"
                        onClick={handleBackToEmail}
                      >
                        Back to Email
                      </button>
                      <button
                        type="button"
                        className="resend-otp-button"
                        onClick={() => toast.success('New OTP sent!')}
                      >
                        Resend Code
                      </button>
                    </div>
                  </>
                )}

                {/* Step 3: New Password Input */}
                {forgotPasswordStep === 3 && (
                  <>
                    <div className="form-group">
                      <label htmlFor="new-password">New Password</label>
                      <div className="password-field">
                        <input
                          id="new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="show-pass-btn"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          aria-label="Toggle new password visibility"
                        >
                          {showNewPassword ? (
                            <EyeOff size={18} strokeWidth={1.8} />
                          ) : (
                            <Eye size={18} strokeWidth={1.8} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirm-password">Confirm New Password</label>
                      <div className="password-field">
                        <input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="show-pass-btn"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label="Toggle confirm password visibility"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} strokeWidth={1.8} />
                          ) : (
                            <Eye size={18} strokeWidth={1.8} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="forgot-password-actions">
                      <button
                        type="button"
                        className="back-button"
                        onClick={handleBackToOtp}
                      >
                        Back to Verification
                      </button>
                    </div>
                  </>
                )}

                <button type="submit" className="auth-submit-btn">
                  {forgotPasswordStep === 1 && 'Send Verification Code'}
                  {forgotPasswordStep === 2 && 'Verify Code'}
                  {forgotPasswordStep === 3 && 'Reset Password'}
                </button>
              </form>
            </>
          ) : (
            // Original Sign In/Sign Up Flow
            <>
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

                {isSignIn && (
                  <button
                    type="button"
                    className="forgot-password-link"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot your password?
                  </button>
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
            </>
          )}
        </div>

        <p className="auth-footer">
          Powered by blockchain technology for maximum transparency
        </p>
      </div>
    </div>
  );
};

export default SignInPage;