import { ArrowRight, TrendingUp, FolderOpen, CheckCircle, ExternalLink } from 'lucide-react';
import DonationChart from './components/DonationChart';
import StatsCard from './components/StatsCard';
import RecommendationCard from './components/RecommendationCard';
import DonationsTable from './components/DonationsTable';
import './Dashboard.css';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Donations',
      value: '₦284,000',
      change: '+12.5%',
      icon: TrendingUp,
      color: '#22c55e'
    },
    {
      title: 'Projects Supported',
      value: '24',
      change: '+3',
      icon: FolderOpen,
      color: '#22c55e'
    },
    {
      title: 'Verified Transactions',
      value: '156',
      icon: CheckCircle,
      color: '#22c55e'
    }
  ];

  const recommendations = [
    {
      title: 'Healthcare for Rural Women',
      matchScore: '95% match',
      description: 'Based on your support for social welfare projects',
      category: 'Healthcare',
    },
    {
      title: 'Youth Empowerment Program',
      matchScore: '88% match',
      description: 'Aligns with your education impact focus',
      category: 'Education',
    },
    {
      title: 'Renewable Energy Initiative',
      matchScore: '82% match',
      description: 'Similar to your solar power donations',
      category: 'Environment',
    }
  ];

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's your impact overview.</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="impact-hero">
        <div className="hero-content">
          <h2 className="hero-title">Your Impact This Year</h2>
          <p className="hero-text">₦284,000 donated to 24 projects across 15 communities</p>
        </div>
        <button className="hero-btn">
          Start New Donation
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Recommendations */}
      <div className="content-grid">
        <div className="chart-section">
          <DonationChart />
        </div>
        
        <div className="recommendations-section">
          <div className="section-header">
            <h3 className="section-title">
              <span className="sparkle">✨</span> Recommendations
            </h3>
            <p className="section-subtitle">Based on your impact history and preferences</p>
          </div>
          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <RecommendationCard key={index} {...rec} />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Donations Table */}
      <DonationsTable />
    </div>
  );
};

export default Dashboard;
