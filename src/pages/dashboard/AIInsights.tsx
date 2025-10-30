import { useState } from "react";
import { RefreshCw, Heart, TrendingUp, Sparkles, BarChart3, PieChart, Target, CircleDot } from "lucide-react";
import { toast } from "sonner";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
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

// Data for Recharts
const categoryData = [
  { name: "Education", value: 45, color: "#10b981" },
  { name: "Healthcare", value: 25, color: "#fbbf24" },
  { name: "Climate", value: 20, color: "#22c55e" },
  { name: "Women Empowerment", value: 10, color: "#1f2937" },
];

const monthlyData = [
  { month: "Aug", amount: 45000 },
  { month: "Sep", amount: 55000 },
  { month: "Oct", amount: 50000 },
  { month: "Nov", amount: 70000 },
  { month: "Dec", amount: 80000 },
  { month: "Jan", amount: 90000 },
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

  // Custom tooltip for pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
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
            <PieChart size={18} />
            <h3 className="chart-title">Donation by Category</h3>
          </div>
          <div className="pie-chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Percentage']}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              {categoryData.map((entry, index) => (
                <div key={`legend-${index}`} className="legend-item">
                  <span 
                    className="legend-color" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span>{entry.name}: {entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <BarChart3 size={18} />
            <h3 className="chart-title">Monthly Giving Trend</h3>
          </div>
          <div className="bar-chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Amount']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
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