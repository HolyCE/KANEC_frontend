import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { API_CONFIG, API_BASE_URL } from '../api/config';
import { useAuth } from '../contexts/AuthContext';
import './SignInPage.css';

const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('donor');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Forgot password state - FIXED: Initialize OTP as array for 6 digits
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Fixed: Initialize as array
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [credentialError, setCredentialError] = useState(false);

  // Clear session if no token
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const isAuth = sessionStorage.getItem('isAuthenticated');
    if (!token || !isAuth) sessionStorage.clear();
    console.log('Session check:', { token: !!token, isAuth: !!isAuth });
  }, []);

  // Password validation effect
  useEffect(() => {
    if (!isSignIn && password) {
      const validation = {
        minLength: password.length >= 6,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      };
      setPasswordValidation(validation);
      console.log('Password validation:', validation);
    }
  }, [password, isSignIn]);

  // OTP input handlers - ADDED: Proper OTP handling functions
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedNumbers = pastedData.replace(/\D/g, '').slice(0, 6).split('');
    
    const newOtp = [...otp];
    pastedNumbers.forEach((num, index) => {
      if (index < 6) newOtp[index] = num;
    });
    
    setOtp(newOtp);
    
    // Focus the next empty input or last one
    const nextEmptyIndex = newOtp.findIndex(val => val === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    const nextInput = document.getElementById(`otp-input-${focusIndex}`);
    if (nextInput) nextInput.focus();
  };

  const validateSignup = () => {
    console.log('Validating signup form...');
    console.log('Form data:', { name: name.trim(), email, passwordLength: password.length });

    if (!name.trim()) {
      console.log('Validation failed: Full name is required');
      return 'Full name is required';
    }
    if (!email.includes('@')) {
      console.log('Validation failed: Invalid email format');
      return 'Enter a valid email address';
    }
    if (password.length < 6) {
      console.log('Validation failed: Password must be at least 6 characters');
      return 'Password must be at least 6 characters long';
    }

    console.log('All validations passed');
    return null;
  };

  const getPasswordStrength = () => {
    const validations = Object.values(passwordValidation);
    const passedCount = validations.filter(Boolean).length;
    const totalCount = validations.length;

    if (passedCount === totalCount) return { strength: 'strong', color: '#10b981', percentage: 100 };
    if (passedCount >= 3) return { strength: 'good', color: '#f59e0b', percentage: 70 };
    if (passedCount >= 2) return { strength: 'fair', color: '#f59e0b', percentage: 50 };
    return { strength: 'weak', color: '#ef4444', percentage: 30 };
  };

  const PasswordRequirement = ({ met, text }) => (
    <div className="password-requirement">
      {met ? (
        <CheckCircle size={16} color="#10b981" />
      ) : (
        <XCircle size={16} color="#ef4444" />
      )}
      <span style={{ color: met ? '#10b981' : '#ef4444', fontSize: '14px' }}>
        {text}
      </span>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted - Mode:', isSignIn ? 'SIGN IN' : 'SIGN UP');
    console.log('Form data:', { email, name, passwordLength: password.length, role });

    // Reset credential error state
    setCredentialError(false);
    setLoading(true);

    try {
      if (isSignIn) {
        // SIGN IN
        const { data } = await axios({
          method: API_CONFIG.auth.login.method,
          url: `${API_BASE_URL}${API_CONFIG.auth.login.url}`,
          data: {
            email: email.trim().toLowerCase(),
            password,
          },
          headers: { 'Content-Type': 'application/json' },
        });

        console.log('Sign in successful - Response:', data);
        
        login(data.user, data.access_token);
        toast.success('Signed in successfully!');

        // FIXED: Use sessionStorage only for redirect
        const redirect = sessionStorage.getItem('redirectAfterLogin');
        console.log('Redirect path found:', redirect);

        // Clear the redirect path
        sessionStorage.removeItem('redirectAfterLogin');

        window.history.replaceState(null, '', '/');

        let redirectTo = '/dashboard';
        if (redirect && !['/signin', '/signup', '/verify-email'].includes(redirect)) {
          redirectTo = redirect;
        }

        console.log('Redirecting to:', redirectTo);
        navigate(redirectTo, { replace: true });
      } 
      else {
        // SIGN UP
        console.log('Starting sign up process...');
        const error = validateSignup();
        if (error) {
          console.log('Signup validation failed:', error);
          toast.error(error);
          setLoading(false);
          return;
        }

        console.log('Making signup API request...');
        console.log('API Config:', API_CONFIG.auth.register);
        console.log('Full URL:', `${API_BASE_URL}${API_CONFIG.auth.register.url}`);

        const { data } = await axios({
          method: API_CONFIG.auth.register.method,
          url: `${API_BASE_URL}${API_CONFIG.auth.register.url}`,
          data: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            role,
          },
          headers: { 'Content-Type': 'application/json' },
        });

        console.log('Signup API response:', data);

        if (data?.message?.toLowerCase().includes('success')) {
          console.log('Account created successfully with success message');
          toast.success('Account created successfully! Please verify your email.');
          
          // Redirect to verification page with email
          navigate('/verify-email', { 
            state: { email: email.trim().toLowerCase() } 
          });
          
          // Clear form
          setName('');
          setEmail('');
          setPassword('');
          setRole('donor');
          setShowPassword(false);
          setPasswordValidation({
            minLength: false,
            hasUppercase: false,
            hasLowercase: false,
            hasNumber: false,
            hasSpecialChar: false,
          });
        } else {
          console.log('Account created with generic message');
          toast.success('Account created! Check your email for verification.');
          
          // Redirect to verification page with email
          navigate('/verify-email', { 
            state: { email: email.trim().toLowerCase() } 
          });
          
          setIsSignIn(true);
        }
      }
    } catch (err) {
      console.error('API Error occurred:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      console.error('Error status:', err.response?.status);

      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (err.response?.status === 401) {
        // Specific handling for unauthorized (invalid credentials)
        errorMessage = err.response?.data?.detail || 'Invalid email or password. Please try again.';
        setCredentialError(true); // Set credential error state
      } else if (err.response?.data?.detail) {
        // Use the detail from backend if available
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        // Fallback to message field
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        errorMessage = Object.values(err.response.data.errors)[0][0];
      }

      console.log('Displaying error to user:', errorMessage);
      
      // Show specific styling for credential errors
      if (errorMessage.toLowerCase().includes('invalid email or password')) {
        toast.error(errorMessage, {
          style: { 
            background: '#fef2f2', 
            color: '#dc2626',
            border: '1px solid #fecaca'
          }
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      console.log('Form submission finished');
      setLoading(false);
    }
  };

  // Reset credential error when user types
  useEffect(() => {
    if (credentialError) {
      setCredentialError(false);
    }
  }, [email, password]);

  // Forgot password logic - FIXED: Proper OTP handling
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    console.log('=== FORGOT PASSWORD DEBUG ===');
    console.log('Step:', forgotPasswordStep);
    console.log('Email:', email);
    console.log('OTP:', otp);
    console.log('OTP String:', otp.join(''));
    console.log('New Password:', newPassword);
    console.log('Confirm Password:', confirmPassword);
    
    setLoading(true);

    try {
      if (forgotPasswordStep === 1) {
        console.log('📧 Step 1: Sending forgot password request...');
        const response = await axios({
          method: API_CONFIG.auth.forgotPassword.method,
          url: `${API_BASE_URL}${API_CONFIG.auth.forgotPassword.url}`,
          data: { email },
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('✅ Forgot password response:', response.data);
        toast.success('OTP sent to your email!');
        setForgotPasswordStep(2);
        
      } else if (forgotPasswordStep === 2) {
        console.log('🔄 Step 2: Resetting password with OTP...');
        
        // Validation
        if (newPassword !== confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }
        if (newPassword.length < 6) {
          toast.error('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        const otpString = otp.join('');
        if (otpString.length !== 6) {
          toast.error('Please enter the complete 6-digit code');
          setLoading(false);
          return;
        }

        const resetData = { 
          email, 
          otp_code: otpString, // FIXED: Use joined OTP string
          new_password: newPassword
        };
        console.log('📤 Reset password data:', resetData);
        
        const response = await axios({
          method: API_CONFIG.auth.resetPassword.method,
          url: `${API_BASE_URL}${API_CONFIG.auth.resetPassword.url}`,
          data: resetData,
          headers: { 'Content-Type': 'application/json' },
        });
        
        console.log('✅ Reset password response:', response.data);
        toast.success('Password reset successful. Please sign in.');
        
        // Reset form
        setShowForgotPassword(false);
        setIsSignIn(true);
        setForgotPasswordStep(1);
        setOtp(['', '', '', '', '', '']); // FIXED: Reset OTP array
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error('❌ Forgot password error:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors)[0][0]
          : 'Operation failed. Please try again.');
      toast.error(msg);
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  };

  const backToSignIn = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep(1);
    setOtp(['', '', '', '', '', '']); // FIXED: Reset OTP array
    setNewPassword('');
    setConfirmPassword('');
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <button
          className="back-to-home"
          type="button"
          onClick={() => (showForgotPassword ? backToSignIn() : navigate('/'))}
        >
          <ArrowLeft size={16} />
          <span>{showForgotPassword ? 'Back to Sign In' : 'Back to Home'}</span>
        </button>

        <div className="auth-card">
          <div className="auth-logo">
            <img src="/reallogo.png" alt="KANEC IMPACT LEDGER" className="logo-image" />
          </div>

          {/* Forgot Password */}
          {showForgotPassword ? (
            <>
              {/* Step Indicator */}
              <div className="forgot-password-steps">
                <div className={`step ${forgotPasswordStep >= 1 ? 'active' : ''}`}>
                  <div className="step-number">1</div>
                  <div className="step-label">Enter Email</div>
                </div>
                <div className={`step-line ${forgotPasswordStep >= 2 ? 'active' : ''}`}></div>
                <div className={`step ${forgotPasswordStep >= 2 ? 'active' : ''}`}>
                  <div className="step-number">2</div>
                  <div className="step-label">Reset Password</div>
                </div>
              </div>

              <h1 className="auth-title">
                {forgotPasswordStep === 1 && 'Reset Your Password'}
                {forgotPasswordStep === 2 && 'Enter Verification Code'}
              </h1>

              <form onSubmit={handleForgotPassword} className="auth-form">
                {forgotPasswordStep === 1 && (
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                )}

                {forgotPasswordStep === 2 && (
                  <>
                    <div className="form-group">
                      <label>Verification Code</label>
                      <div className="otp-container">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <input
                            key={index}
                            id={`otp-input-${index}`}
                            type="text"
                            value={otp[index]}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            onPaste={index === 0 ? handleOtpPaste : undefined} // Only handle paste on first input
                            placeholder="0"
                            maxLength={1}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            required
                            className="otp-input"
                          />
                        ))}
                      </div>
                      <div className="otp-hint">
                        Enter the 6-digit code sent to your email
                      </div>
                    </div>

                    <div className="form-group">
                      <label>New Password</label>
                      <div className="password-field">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                        />
                        <button class="show-pass-btn" type="button" onClick={() => setShowNewPassword(!showNewPassword)}>
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Confirm Password</label>
                      <div className="password-field">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                        />
                        <button class="show-pass-btn" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {confirmPassword && (
                        <div className={`password-match visible ${newPassword === confirmPassword ? 'matching' : 'not-matching'}`}>
                          {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                        </div>
                      )}
                    </div>

                    <div className="forgot-password-actions">
                      <button type="button" className="back-button" onClick={() => setForgotPasswordStep(1)}>
                        ← Back
                      </button>
                      <button 
                        type="button" 
                        className="resend-otp-button"
                        onClick={() => {
                          axios({
                            method: API_CONFIG.auth.forgotPassword.method,
                            url: `${API_BASE_URL}${API_CONFIG.auth.forgotPassword.url}`,
                            data: { email },
                            headers: { 'Content-Type': 'application/json' },
                          }).then(() => toast.success('New OTP sent!'));
                        }}
                      >
                        Resend Code
                      </button>
                    </div>
                  </>
                )}

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? (
                    <span className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  ) : forgotPasswordStep === 1 ? (
                    'Send Code'
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </>
          ) : (
            // Sign In / Sign Up
            <>
              <h1 className="auth-title">Welcome to Kanec</h1>
              <p className="auth-subtitle">Transparent, blockchain-powered donations</p>

              <div className="auth-tabs">
                <button
                  type="button"
                  className={`auth-tab ${isSignIn ? 'active' : ''}`}
                  onClick={() => setIsSignIn(true)}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`auth-tab ${!isSignIn ? 'active' : ''}`}
                  onClick={() => setIsSignIn(false)}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                {!isSignIn && (
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={credentialError ? 'input-error' : ''}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="password-field">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={credentialError ? 'input-error' : ''}
                    />
                    <button
                      type="button"
                      className="show-pass-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Password Strength Indicator for Sign Up */}
                  {!isSignIn && password && (
                    <div className="password-strength-indicator">
                      <div className="password-strength-bar">
                        <div
                          className="password-strength-progress"
                          style={{
                            width: `${passwordStrength.percentage}%`,
                            backgroundColor: passwordStrength.color
                          }}
                        />
                      </div>
                      <div className="password-strength-text">
                        Password strength: <span style={{ color: passwordStrength.color }}>
                          {passwordStrength.strength}
                        </span>
                      </div>

                      <div className="password-requirements">
                        <PasswordRequirement met={passwordValidation.minLength} text="At least 6 characters" />
                        <PasswordRequirement met={passwordValidation.hasUppercase} text="One uppercase letter (A-Z)" />
                        <PasswordRequirement met={passwordValidation.hasLowercase} text="One lowercase letter (a-z)" />
                        <PasswordRequirement met={passwordValidation.hasNumber} text="One number (0-9)" />
                        <PasswordRequirement met={passwordValidation.hasSpecialChar} text="One special character (!@#$% etc.)" />
                      </div>
                    </div>
                  )}

                  {/* Simple length warning for Sign In */}
                  {isSignIn && password && password.length < 6 && (
                    <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                      Warning: Password must be at least 6 characters
                    </div>
                  )}
                </div>

                {!isSignIn && (
                  <div className="form-group">
                    <label>Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                      <option value="donor">Donor</option>
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

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? 'Please wait...' : isSignIn ? 'Sign In' : 'Sign Up'}
                </button>

                <p className="auth-terms">
                  By continuing you agree to our{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Terms
                  </a>{' '}
                  and{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Privacy Policy
                  </a>
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