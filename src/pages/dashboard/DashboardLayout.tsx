import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  DollarSign, 
  Sparkles, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  Wallet,
  Globe,
  Search,
  Bell,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from './ThemeContext'; // Import the hook
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // Use the theme context

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FolderKanban, label: 'Projects', path: '/dashboard/projects' },
    { icon: DollarSign, label: 'Donations', path: '/dashboard/donations' },
    { icon: Sparkles, label: 'AI Insights', path: '/dashboard/insights' },
    { icon: FileText, label: 'Impact Reports', path: '/dashboard/reports' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/signin');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <img 
              src="/reallogo.png" 
              alt="KANEC IMPACT LEDGER" 
              className="logo-image"
            />
            <div className="logo-text">
              <div className="logo-title">KANEC</div>
              <div className="logo-subtitle">IMPACT LEDGER</div>
            </div>
          </div>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {/* Theme Toggle in Sidebar */}
          <div className="theme-toggle-sidebar">
            <button 
              className={`theme-toggle-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === 'light' ? 'Light' : 'Dark'} Mode</span>
            </button>
          </div>

          <div className="user-balance">
            <div className="balance-icon">
              <Wallet size={20} />
            </div>
            <div className="balance-info">
              <div className="balance-label">HBAR Balance</div>
              <div className="balance-amount">1,250.50</div>
            </div>
          </div>

          <div className="user-profile">
            <div className="user-avatar">JP</div>
            <div className="user-info">
              <div className="user-name">James Passaquindici</div>
              <div className="user-handle">@jamec3</div>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>

          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search projects or causes..." 
              className="dashboard-search"
            />
          </div>

          <div className="header-actions">
            {/* Theme Toggle in Header for mobile */}
            <button 
              className="theme-toggle-header"
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            <button className="network-btn">
              <Globe size={16} />
              <span>Hedera Mainnet</span>
            </button>
            <div className="wallet-address">
              <Wallet size={16} className="wallet-icon" />
              <span>0xA3D...F98</span>
            </div>
            <button className="notification-badge">
              <Bell size={18} />
              <span className="badge">3</span>
            </button>
            <div className="user-avatar-small">JP</div>
          </div>
        </header>

        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default DashboardLayout;