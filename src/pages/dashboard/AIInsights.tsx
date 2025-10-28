import { useState } from "react";
import { RefreshCw, Heart, TrendingUp, Sparkles, BarChart3, PieChart, Target, CircleDot } from "lucide-react";
import { toast } from "sonner";
import "./AIInsights.css";

interface Recommendation {
  id: number;
  title: string;
  reason: string;
  reasonIcon: "similar" | "trending" | "impact";
  raised: number;
  goal: number;
  category: string;
}

const recommendations: Recommendation[] = [
  {
    id: 1,
    title: "STEM Education Ghana",
    reason: "Similar to your past donations",
    reasonIcon: "similar",
    raised: 120000,
    goal: 200000,
    category: "Education",
  },
  {
    id: 2,
    title: "Girls Coding Academy",
    reason: "Trending in Education",
    reasonIcon: "trending",
    raised: 85000,
    goal: 150000,
    category: "Education",
  },
  {
    id: 3,
    title: "Rural School Libraries",
    reason: "High impact potential",
    reasonIcon: "impact",
    raised: 95000,
    goal: 180000,
    category: "Education",
  },
];

const AIInsights = () => {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    toast.success("Regenerating AI insights...");
    setTimeout(() => {
      setIsRegenerating(false);
      toast.success("Insights updated!");
    }, 1500);
  };

  const handleQuickDonate = (projectTitle: string) => {
    toast.success(`Quick donation to ${projectTitle} initiated!`);
  };

  const getReasonIcon = (type: "similar" | "trending" | "impact") => {
    switch (type) {
      case "similar":
        return <Target size={14} />;
      case "trending":
        return <TrendingUp size={14} />;
      case "impact":
        return <Sparkles size={14} />;
    }
  };

  return (
    <div className="ai-insights-page">
      <div className="insights-header">
        <div>
          <h1 className="insights-title">AI Insights</h1>
          <p className="insights-subtitle">Personalized recommendations and giving patterns</p>
        </div>
        <button
          className={`regenerate-button ${isRegenerating ? 'loading' : ''}`}
          onClick={handleRegenerate}
          disabled={isRegenerating}
        >
          <RefreshCw size={16} className={isRegenerating ? "spin" : ""} />
          Regenerate
        </button>
      </div>

      <div className="insights-stats">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Most Supported</span>
            <Heart size={18} className="stat-icon green" />
          </div>
          <h3 className="stat-value">Education</h3>
          <p className="stat-description">45% of donations</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Avg. Frequency</span>
            <TrendingUp size={18} className="stat-icon yellow" />
          </div>
          <h3 className="stat-value">2.5x/month</h3>
          <p className="stat-description positive">↑20% from last month</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Impact Score</span>
            <Sparkles size={18} className="stat-icon green" />
          </div>
          <h3 className="stat-value">92/100</h3>
          <p className="stat-description">Top 10% of donors</p>
        </div>
      </div>

      <div className="insights-charts">
        <div className="chart-card">
          <div className="chart-header">
            <BarChart3 size={18} />
            <h3 className="chart-title">Donation by Category</h3>
          </div>
          <div className="pie-chart-container">
            <svg viewBox="0 0 200 200" className="pie-chart">
              <circle cx="100" cy="100" r="70" fill="#10b981" />
              <circle
                cx="100"
                cy="100"
                r="35"
                fill="transparent"
                stroke="#fbbf24"
                strokeWidth="70"
                strokeDasharray="55 440"
                transform="rotate(-90 100 100)"
              />
              <circle
                cx="100"
                cy="100"
                r="35"
                fill="transparent"
                stroke="#22c55e"
                strokeWidth="70"
                strokeDasharray="44 440"
                strokeDashoffset="-55"
                transform="rotate(-90 100 100)"
              />
              <circle
                cx="100"
                cy="100"
                r="35"
                fill="transparent"
                stroke="#1f2937"
                strokeWidth="70"
                strokeDasharray="22 440"
                strokeDashoffset="-99"
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color education"></span>
                <span>Education: 45%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color healthcare"></span>
                <span>Healthcare: 25%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color climate"></span>
                <span>Climate: 20%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color women"></span>
                <span>Women Empowerment: 10%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <TrendingUp size={18} />
            <h3 className="chart-title">Monthly Giving Trend</h3>
          </div>
          <div className="bar-chart-container">
            <div className="bar-chart">
              <div className="bar" style={{ height: "45%" }}>
                <span className="bar-label">Aug</span>
              </div>
              <div className="bar" style={{ height: "55%" }}>
                <span className="bar-label">Sep</span>
              </div>
              <div className="bar" style={{ height: "50%" }}>
                <span className="bar-label">Oct</span>
              </div>
              <div className="bar" style={{ height: "70%" }}>
                <span className="bar-label">Nov</span>
              </div>
              <div className="bar" style={{ height: "80%" }}>
                <span className="bar-label">Dec</span>
              </div>
              <div className="bar" style={{ height: "90%" }}>
                <span className="bar-label">Jan</span>
              </div>
            </div>
            <div className="y-axis-labels">
              <span>100000</span>
              <span>75000</span>
              <span>50000</span>
              <span>25000</span>
              <span>0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="recommendations-section">
        <div className="recommendations-header">
          <CircleDot size={18} className="green-icon" />
          <h3 className="recommendations-title">Recommended For You</h3>
        </div>
        <p className="recommendations-subtitle">
          Because you supported Education projects, you may like these:
        </p>

        <div className="recommendations-grid">
          {recommendations.map((rec) => (
            <div key={rec.id} className="recommendation-card">
              <div className="recommendation-header">
                <h4 className="recommendation-title">{rec.title}</h4>
                <span className="recommendation-category">{rec.category}</span>
              </div>
              <div className="recommendation-reason">
                {getReasonIcon(rec.reasonIcon)}
                <span>{rec.reason}</span>
              </div>
              <div className="recommendation-funding">
                <div className="funding-amounts">
                  <span className="amount-raised">₦{rec.raised.toLocaleString()}</span>
                  <span className="amount-goal">of ₦{rec.goal.toLocaleString()}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.round((rec.raised / rec.goal) * 100)}%` }}
                  />
                </div>
              </div>
              <button
                className="quick-donate-button"
                onClick={() => handleQuickDonate(rec.title)}
              >
                <Heart size={16} />
                Quick Donate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;