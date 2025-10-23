import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './DonationChart.css';

const DonationChart = () => {
  const data = [
    { month: 'May', amount: 32000 },
    { month: 'Jun', amount: 42000 },
    { month: 'Jul', amount: 38000 },
    { month: 'Aug', amount: 48000 },
    { month: 'Sep', amount: 45000 },
    { month: 'Oct', amount: 60000 },
  ];

  return (
    <div className="donation-chart">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Donation Activity</h3>
          <p className="chart-subtitle">Your impact over the last 6 months</p>
        </div>
      </div>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => `₦${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Amount']}
              cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }}
            />
            <Bar 
              dataKey="amount" 
              fill="#22c55e" 
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DonationChart;
