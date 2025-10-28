import { useState } from 'react';
import { User, Wallet, Bell, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from './ThemeContext'; // Import the hook
import './Settings.css';

const Settings = () => {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [donationAlerts, setDonationAlerts] = useState(true);
  const [monthlyReports, setMonthlyReports] = useState(true);
  
  const { theme, toggleTheme } = useTheme(); // Use theme context instead of local state

  const handleSaveChanges = () => {
    console.log('Saving changes...', { firstName, lastName, email, password });
  };

  const handleDisconnectWallet = () => {
    console.log('Disconnecting wallet...');
  };

  const handleLogout = () => {
    console.log('Logging out...');
    window.location.href = '/auth';
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="settings-content">
        {/* Profile Information */}
        <div className="settings-section">
          <div className="section-header">
            <User className="section-icon" />
            <h2>Profile Information</h2>
          </div>

          <div className="settings-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="input-field"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Change Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="input-field"
              />
            </div>

            <button onClick={handleSaveChanges} className="save-button">
              Save Changes
            </button>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="settings-section">
          <div className="section-header">
            <Wallet className="section-icon" />
            <h2>Wallet Connection</h2>
          </div>

          <div className="wallet-info">
            <div className="wallet-item">
              <div className="wallet-detail">
                <span className="wallet-label">Connected Wallet</span>
                <span className="wallet-address">0xA3D...r F9B</span>
              </div>
              <button 
                onClick={handleDisconnectWallet}
                className="disconnect-button"
              >
                Disconnect
              </button>
            </div>

            <div className="wallet-item">
              <div className="wallet-detail">
                <span className="wallet-label">Network</span>
                <span className="wallet-network">Hedera Mainnet</span>
              </div>
              <span className="connected-badge">Connected</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <div className="section-header">
            <Bell className="section-icon" />
            <h2>Notifications</h2>
          </div>

          <div className="notification-settings">
            <div className="notification-item">
              <div className="notification-info">
                <h3>Email Notifications</h3>
                <p>Receive updates via email</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <h3>Donation Alerts</h3>
                <p>Get notified about your donations</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={donationAlerts}
                  onChange={(e) => setDonationAlerts(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <h3>Monthly Reports</h3>
                <p>Receive monthly impact summaries</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={monthlyReports}
                  onChange={(e) => setMonthlyReports(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="settings-section">
          <div className="section-header">
            <Sun className="section-icon" />
            <h2>Appearance</h2>
          </div>

          <div className="appearance-settings">
            <div className="theme-info">
              <h3>Theme</h3>
              <p>Switch between light and dark mode</p>
            </div>
            <div className="theme-toggle">
              <button
                className={`theme-button ${theme === 'light' ? 'active' : ''}`}
                onClick={toggleTheme}
              >
                <Sun className="theme-icon" />
                Light
              </button>
              <button
                className={`theme-button ${theme === 'dark' ? 'active' : ''}`}
                onClick={toggleTheme}
              >
                <Moon className="theme-icon" />
                Dark
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section danger-zone">
          <div className="danger-header">Danger Zone</div>
          
          <div className="danger-content">
            <div className="danger-info">
              <h3>Logout</h3>
              <p>Sign out of your account</p>
            </div>
            <button 
              onClick={handleLogout}
              className="logout-button"
            >
              <LogOut className="logout-icon" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;