import { useState, useEffect } from 'react';
import { User, Wallet, Bell, Sun, Moon, LogOut, Save, Key, Trash2, Mail, Shield, Palette } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { API_CONFIG, API_BASE_URL } from '../../api/config';
import axios from 'axios';
import { toast } from 'sonner';
import './Settings.css';

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Wallet state
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Delete account state
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [donationAlerts, setDonationAlerts] = useState(true);
  const [monthlyReports, setMonthlyReports] = useState(true);

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setWalletAddress(user.wallet_address || '');
      fetchUserProfile();
    }
  }, [user]);

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const { data } = await axios({
        method: API_CONFIG.auth.profile.method,
        url: `${API_BASE_URL}${API_CONFIG.auth.profile.url}`,
      });
      
      if (data) {
        setName(data.name || '');
        setEmail(data.email || '');
        setWalletAddress(data.wallet_address || '');
        setWalletBalance(data.balance_hbar || '');
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      toast.error('Failed to load profile data');
    }
  };

  // Update profile
  const handleUpdateProfile = async () => {
    try {
      const updateData = {};
      if (name && name !== user?.name) updateData.name = name;
      if (email && email !== user?.email) updateData.email = email;

      if (Object.keys(updateData).length === 0) {
        toast.info('No changes to save');
        return;
      }

      const { data } = await axios({
        method: API_CONFIG.auth.updateProfile.method,
        url: `${API_BASE_URL}${API_CONFIG.auth.updateProfile.url}`,
        data: updateData,
      });

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      
      if (updateData.email && updateData.email !== user?.email) {
        toast.info('Please verify your new email address');
      }

    } catch (error) {
      console.error('Failed to update profile:', error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMsg);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      await axios({
        method: API_CONFIG.auth.changePassword.method,
        url: `${API_BASE_URL}${API_CONFIG.auth.changePassword.url}`,
        data: {
          current_password: currentPassword,
          new_password: newPassword,
        },
      });

      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);

    } catch (error) {
      console.error('Failed to change password:', error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Failed to change password';
      toast.error(errorMsg);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Please enter your password to confirm account deletion');
      return;
    }

    try {
      await axios({
        method: API_CONFIG.auth.deleteAccount.method,
        url: `${API_BASE_URL}${API_CONFIG.auth.deleteAccount.url}?password=${encodeURIComponent(deletePassword)}`,
      });

      toast.success('Account deleted successfully');
      logout();

    } catch (error) {
      console.error('Failed to delete account:', error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Failed to delete account';
      toast.error(errorMsg);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <p>Manage your account preferences and security</p>
      </div>

      <div className="settings-grid">
        {/* Profile Section */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">
              <User size={20} />
            </div>
            <div className="card-title">
              <h2>Profile Information</h2>
              <p>Update your personal details</p>
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`action-button ${isEditing ? 'secondary' : 'primary'}`}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="card-content">
            <div className="form-grid">
              <div className="form-groups">
                <label className="form-labels">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>

              <div className="form-groups">
                <label className="form-labels">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>
            </div>

            {isEditing && (
              <button onClick={handleUpdateProfile} className="save-button">
                <Save size={16} />
                Save Changes
              </button>
            )}
          </div>
        </div>

        {/* Security Section */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">
              <Shield size={20} />
            </div>
            <div className="card-title">
              <h2>Security</h2>
              <p>Manage your password and security settings</p>
            </div>
            <button 
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className={`action-button ${isChangingPassword ? 'secondary' : 'primary'}`}
            >
              {isChangingPassword ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {isChangingPassword && (
            <div className="card-content">
              <div className="form-grid">
                <div className="form-groups">
                  <label className="form-labels">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="form-input"
                  />
                </div>

                <div className="form-groups">
                  <label className="form-labels">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="form-input"
                  />
                </div>

                <div className="form-groups">
                  <label className="form-labels">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="form-input"
                  />
                </div>
              </div>

              <button onClick={handleChangePassword} className="save-button">
                Update Password
              </button>
            </div>
          )}
        </div>

        {/* Wallet Section */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">
              <Wallet size={20} />
            </div>
            <div className="card-title">
              <h2>Wallet</h2>
              <p>Your blockchain wallet information</p>
            </div>
            <div className={`status-tag ${walletAddress ? 'connected' : 'disconnected'}`}>
              {walletAddress ? 'Connected' : 'Disconnected'}
            </div>
          </div>

          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Wallet Address</span>
                <span className="info-value address">{walletAddress || 'Not connected'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Network</span>
                <span className="info-value">Hedera Mainnet</span>
              </div>
              {walletBalance && (
                <div className="info-item">
                  <span className="info-label">Balance</span>
                  <span className="info-value balance">{walletBalance} ℏ</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">
              <Bell size={20} />
            </div>
            <div className="card-title">
              <h2>Notifications</h2>
              <p>Control your notification preferences</p>
            </div>
          </div>

          <div className="card-content">
            <div className="toggle-list">
              <div className="toggle-item">
                <div className="toggle-info">
                  <h3>Email Notifications</h3>
                  <p>Receive updates via email</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h3>Donation Alerts</h3>
                  <p>Get notified about your donations</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={donationAlerts}
                    onChange={(e) => setDonationAlerts(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h3>Monthly Reports</h3>
                  <p>Receive monthly impact summaries</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={monthlyReports}
                    onChange={(e) => setMonthlyReports(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">
              <Palette size={20} />
            </div>
            <div className="card-title">
              <h2>Appearance</h2>
              <p>Customize your interface</p>
            </div>
          </div>

          <div className="card-content">
            <div className="theme-selector">
              <div className="theme-option">
                <button
                  className={`theme-card ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => toggleTheme()}
                >
                  <Sun className="theme-icon" />
                  <span>Light</span>
                </button>
              </div>
              <div className="theme-option">
                <button
                  className={`theme-card ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => toggleTheme()}
                >
                  <Moon className="theme-icon" />
                  <span>Dark</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-card danger-zone">
          <div className="card-header">
            <div className="card-icon danger">
              <Trash2 size={20} />
            </div>
            <div className="card-title">
              <h2>Danger Zone</h2>
              <p>Irreversible actions</p>
            </div>
          </div>

          <div className="card-content">
            <div className="danger-actions">
              <div className="danger-action">
                <div className="action-info">
                  <h3>Logout</h3>
                  <p>Sign out of your account from this device</p>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>

              <div className="danger-action">
                <div className="action-info">
                  <h3>Delete Account</h3>
                  <p>Permanently delete your account and all data</p>
                </div>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="delete-btn"
                >
                  <Trash2 size={16} />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <Trash2 className="modal-icon" />
              <h3>Delete Account</h3>
            </div>
            <div className="modal-body">
              <p>This action cannot be undone. This will permanently delete your account and remove all your data from our servers.</p>
              <div className="form-groups">
                <label className="form-label">Enter your password to confirm</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Your password"
                  className="form-input"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="confirm-delete-btn"
                disabled={!deletePassword}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;