import { useState } from "react";
import { CheckCircle, Wallet, ExternalLink, Eye, Download } from "lucide-react";
import { toast } from "sonner";
import "./Donations.css";

const projects = [
  { 
    id: 1, 
    name: "Clean Water Nigeria", 
    category: "Water",
    image: "/mon1.PNG",
    description: "Bringing sustainable impact to communities through verified, transparent funding.",
    raised: 45000,
    goal: 80000,
    explorerUrl: "#"
  },
  { 
    id: 2, 
    name: "Solar Power for Schools", 
    category: "Energy",
    image: "/mon2.PNG",
    description: "Bringing sustainable impact to communities through verified, transparent funding.",
    raised: 65000,
    goal: 80000,
    explorerUrl: "#"
  },
  { 
    id: 3, 
    name: "Healthcare for Rural Women", 
    category: "Healthcare",
    image: "/mon3.PNG",
    description: "Bringing sustainable impact to communities through verified, transparent funding.",
    raised: 52000,
    goal: 80000,
    explorerUrl: "#"
  },
  { 
    id: 4, 
    name: "Education Fund Initiative", 
    category: "Education",
    image: "/mon4.PNG",
    description: "Bringing sustainable impact to communities through verified, transparent funding.",
    raised: 70000,
    goal: 80000,
    explorerUrl: "#"
  },
  { 
    id: 5, 
    name: "Youth Empowerment Program", 
    category: "Education",
    image: "/mon5.PNG",
    description: "Bringing sustainable impact to communities through verified, transparent funding.",
    raised: 38000,
    goal: 80000,
    explorerUrl: "#"
  },
];

const initialDonationHistory = [
  {
    projectName: "Clean Water Nigeria",
    amount: "₦50,000",
    status: "Confirmed",
    date: "Jan 15, 2025",
    transactionId: "0x7f8a...3c2d"
  },
  {
    projectName: "Solar Power for Schools",
    amount: "₦80,000",
    status: "Confirmed",
    date: "Jan 10, 2025",
    transactionId: "0x9b3c...5e1f"
  },
  {
    projectName: "Healthcare for Rural Women",
    amount: "₦35,000",
    status: "Confirmed",
    date: "Jan 5, 2025",
    transactionId: "0x2d4f...8a9c"
  },
  {
    projectName: "Education Fund Initiative",
    amount: "₦120,000",
    status: "Confirmed",
    date: "Dec 28, 2024",
    transactionId: "0x3e6g...4b2a"
  },
  {
    projectName: "Youth Empowerment Program",
    amount: "₦25,000",
    status: "Pending",
    date: "Dec 20, 2024",
    transactionId: "0x5h2j...9c3d"
  }
];

const Donations = () => {
  const [view, setView] = useState<"history" | "form">("history");
  const [selectedProject, setSelectedProject] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [donationHistory, setDonationHistory] = useState(initialDonationHistory);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const walletAddress = "0xA3D...F98";
  const transactionFee = "~0.0001 HBAR";
  const network = "Hedera Mainnet";
  const hbarConversionRate = 20;

  // Exchange rates (example rates - you can update these with real-time rates)
  const exchangeRates = {
    NGN: 1,        // 1 NGN = 1 NGN (base currency)
    USD: 1500,     // 1 USD = 1500 NGN
    EUR: 1600,     // 1 EUR = 1600 NGN
    GBP: 1900,     // 1 GBP = 1900 NGN
    HBAR: 75       // 1 HBAR = 75 NGN
  };

  const selectedProjectData = projects.find(p => p.name === selectedProject);
  const amountInHBAR = amount ? (parseFloat(amount) * hbarConversionRate).toFixed(2) : "0.00";
  const totalHBAR = amount ? (parseFloat(amount) * hbarConversionRate + 0.0001).toFixed(4) : "0.0001";

  // Filter donations based on status and search query
  const filteredDonations = donationHistory.filter(donation => {
    const matchesStatus = statusFilter === "all" || donation.status.toLowerCase() === statusFilter;
    const matchesSearch = donation.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDonateClick = () => {
    if (!selectedProject) {
      toast.error("Please select a project");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmDonation = () => {
    // Generate new transaction data with proper currency symbol
    const currencySymbols = {
      NGN: "₦",
      USD: "$",
      EUR: "€",
      GBP: "£",
      HBAR: "⧓" // HBAR symbol
    };

    const newDonation = {
      projectName: selectedProject,
      amount: `${currencySymbols[currency]}${parseFloat(amount).toLocaleString()}`,
      originalAmount: parseFloat(amount),
      originalCurrency: currency,
      status: "Confirmed",
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      transactionId: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`
    };

    // Add new donation to history
    setDonationHistory(prev => [newDonation, ...prev]);
    
    setShowConfirmDialog(false);
    toast.success(`${currency} ${amount} donated to ${selectedProject}`, {
      icon: "✅",
      description: `Donation Successful!`
    });
    setSelectedProject("");
    setAmount("");
    setView("history");
  };

  const exportToCSV = () => {
    const headers = ['Project Name', 'Amount', 'Status', 'Date', 'Transaction ID'];
    const csvData = filteredDonations.map(donation => [
      donation.projectName,
      donation.amount,
      donation.status,
      donation.date,
      donation.transactionId
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success("CSV exported successfully!");
  };

  // Enhanced totalDonated calculation with currency conversion
  const totalDonated = donationHistory.reduce((sum, donation) => {
    // For new donations with originalAmount and originalCurrency
    if (donation.originalAmount && donation.originalCurrency) {
      const amountInNGN = donation.originalAmount * exchangeRates[donation.originalCurrency];
      return sum + amountInNGN;
    }
    
    // For existing donations (backward compatibility)
    // Remove all currency symbols and commas, then parse as float
    const numericValue = donation.amount.replace(/[₦$,€£⧓]/g, '').replace(/,/g, '');
    const value = parseFloat(numericValue);
    
    // Assume existing donations are in NGN
    return isNaN(value) ? sum : sum + value;
  }, 0);

  const projectsSupported = new Set(donationHistory.map(d => d.projectName)).size;
  const totalTransactions = donationHistory.length;

  // Calculate conversion for display in the form
  const getConversionRate = () => {
    if (currency === "NGN") return "1 NGN = 1 NGN";
    if (currency === "USD") return `1 USD = ${exchangeRates.USD.toLocaleString()} NGN`;
    if (currency === "EUR") return `1 EUR = ${exchangeRates.EUR.toLocaleString()} NGN`;
    if (currency === "GBP") return `1 GBP = ${exchangeRates.GBP.toLocaleString()} NGN`;
    if (currency === "HBAR") return `1 HBAR = ${exchangeRates.HBAR.toLocaleString()} NGN`;
    return "";
  };

  return (
    <div className="donations-page">
      {view === "history" ? (
        <>
          <div className="donations-header">
            <div>
              <h1 className="donations-title">My Donations</h1>
              <p className="donations-subtitle">Track and manage all your contributions</p>
            </div>
            <button className="make-donation-button" onClick={() => setView("form")}>
              Make New Donation
            </button>
          </div>

          <div className="tracking-stats">
            <div className="tracking-stat">
              <span className="stat-label">Total Donated</span>
              <span className="stat-value">₦{totalDonated.toLocaleString()}</span>
            </div>
            <div className="tracking-stat">
              <span className="stat-label">Projects Supported</span>
              <span className="stat-value">{projectsSupported}</span>
            </div>
            <div className="tracking-stat">
              <span className="stat-label">Total Transactions</span>
              <span className="stat-value">{totalTransactions}</span>
            </div>
          </div>

          <div className="search-filter-section">
            <div className="search-box">
              <input 
                placeholder="Search by project name..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-section">
              <span className="filter-label">Status</span>
              <select 
                className="status-filter" 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
              </select>
              <button className="export-button" onClick={exportToCSV}>
                <Download size={14} />
                Export CSV
              </button>
            </div>
          </div>

          <div className="donations-table-wrapper">
            <table className="donations-history-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Transaction ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((donation, index) => (
                  <tr key={index}>
                    <td className="project-name-cell">{donation.projectName}</td>
                    <td className="amount-cell">{donation.amount}</td>
                    <td>
                      <span className={`status-badge ${donation.status.toLowerCase()}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="date-cell">{donation.date}</td>
                    <td className="transaction-cell">
                      <a href="#" className="transaction-link">
                        {donation.transactionId}
                        <ExternalLink size={12} />
                      </a>
                    </td>
                    <td className="actions-cell">
                      <button className="action-button">
                        <Download size={14} />
                        Receipt
                      </button>
                      <div style={{ width: '8px', display: 'inline-block' }}></div>
                      <button className="action-button">
                        <ExternalLink size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          {filteredDonations.map((donation, index) => (
            <div key={index} className="donation-card">
              <div className="donation-card-row">
                <span className="donation-card-label">Project</span>
                <span className="donation-card-value">{donation.projectName}</span>
              </div>
              <div className="donation-card-row">
                <span className="donation-card-label">Amount</span>
                <span className="donation-card-value">{donation.amount}</span>
              </div>
              <div className="donation-card-row">
                <span className="donation-card-label">Status</span>
                <span className={`status-badge ${donation.status.toLowerCase()}`}>
                  {donation.status}
                </span>
              </div>
              <div className="donation-card-row">
                <span className="donation-card-label">Date</span>
                <span className="donation-card-value">{donation.date}</span>
              </div>
              <div className="donation-card-row">
                <span className="donation-card-label">Transaction ID</span>
                <a href="#" className="transaction-link">
                  {donation.transactionId}
                  <ExternalLink size={12} />
                </a>
              </div>
              <div className="donation-card-actions">
                <button className="card-action-button" style={{ flex: 1 }}>
                  <Download size={14} />
                  Receipt
                </button>
                <div style={{ width: '8px' }}></div>
                <button className="card-action-button" style={{ flex: 1 }}>
                  <ExternalLink size={14} />
                  View
                </button>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <div className="donations-header">
            <div>
              <h1 className="donations-title">Make a Donation</h1>
              <p className="donations-subtitle">Support verified social impact projects on Hedera</p>
            </div>
            <button className="view-donations-button" onClick={() => setView("history")} style={{ background: '#10b981 !important', color: 'white !important', borderColor: '#10b981 !important' }}>
              <Eye size={16} />
              View My Donations
            </button>
          </div>

          <div className="donations-content">
            <div className="project-details-card">
              <div className="card-header">
                <h2 className="card-title">Project Details</h2>
                <span className="verified-badge">
                  <CheckCircle size={14} />
                  Verified
                </span>
              </div>
              {selectedProjectData ? (
                <div className="project-preview">
                  <img src={selectedProjectData.image} alt={selectedProjectData.name} className="project-image" />
                  <h3 className="project-name">{selectedProjectData.name}</h3>
                  <p className="project-description">{selectedProjectData.description}</p>
                  
                  <div className="funding-info">
                    <div className="funding-row">
                      <span className="funding-label">Raised</span>
                      <span className="funding-value">₦{selectedProjectData.raised.toLocaleString()}</span>
                    </div>
                    <div className="funding-row">
                      <span className="funding-label">Goal</span>
                      <span className="funding-value">₦{selectedProjectData.goal.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(selectedProjectData.raised / selectedProjectData.goal) * 100}%` }}
                    />
                  </div>
                  
                  <button className="explorer-button">
                    View on Hedera Explorer
                  </button>
                </div>
              ) : (
                <div className="project-placeholder">
                  <p>Select a project to see details</p>
                </div>
              )}
            </div>

            <div className="donation-details-card">
              <div className="card-header">
                <h2 className="card-title">Donation Details</h2>
              </div>
              <p className="blockchain-note">All transactions are recorded on Hedera blockchain</p>

              <div className="donation-form">
                <div className="form-field">
                  <label htmlFor="project">Select Project</label>
                  <select 
                    id="project" 
                    value={selectedProject} 
                    onChange={(e) => setSelectedProject(e.target.value)}
                  >
                    <option value="">Choose a project to support</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.name}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="amount">Donation Amount</label>
                  <div className="amount-input-group">
                    <select 
                      value={currency} 
                      onChange={(e) => setCurrency(e.target.value)}
                      className="currency-selector"
                    >
                      <option value="NGN">NGN</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="HBAR">HBAR</option>
                    </select>
                    <input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="amount-input"
                    />
                  </div>
                  {amount && parseFloat(amount) > 0 && (
                    <div className="conversion-info">
                      <p className="hbar-conversion">≈ {amountInHBAR} HBAR</p>
                      <p className="currency-conversion">
                        {currency !== "NGN" && `≈ ₦${(parseFloat(amount) * exchangeRates[currency]).toLocaleString()} NGN`}
                        {currency === "NGN" && `(${getConversionRate()})`}
                      </p>
                    </div>
                  )}
                </div>

                <div className="transaction-info">
                  <div className="info-row">
                    <span className="info-label">Network</span>
                    <span className="info-value">{network}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Transaction Fee</span>
                    <span className="info-value">{transactionFee}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Wallet</span>
                    <span className="info-value">{walletAddress}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Exchange Rate</span>
                    <span className="info-value">{getConversionRate()}</span>
                  </div>
                </div>

                <button className="donate-button" onClick={handleDonateClick}>
                  <Wallet size={18} />
                  Donate via Hedera
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="dialog-overlay">
          <div className="confirm-donation-dialog">
            <div className="dialog-header">
              <h3 className="dialog-title">Confirm Donation</h3>
              <p className="dialog-description">
                You're about to donate {currency} {amount} to {selectedProject}
              </p>
            </div>
            
            <div className="confirmation-details">
              <div className="confirmation-row">
                <span className="confirmation-label">Amount:</span>
                <span className="confirmation-value">{currency} {parseFloat(amount).toLocaleString()}</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-label">In NGN:</span>
                <span className="confirmation-value">₦{(parseFloat(amount) * exchangeRates[currency]).toLocaleString()}</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-label">Amount in HBAR:</span>
                <span className="confirmation-value">~{amountInHBAR} HBAR</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-label">Transaction Fee:</span>
                <span className="confirmation-value">{transactionFee}</span>
              </div>
              <div className="confirmation-total">
                <span className="confirmation-label">Total:</span>
                <span className="confirmation-value">~{totalHBAR} HBAR</span>
              </div>
            </div>

            <div className="dialog-actions">
              <button className="cancel-button" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </button>
              <button className="confirm-button" onClick={handleConfirmDonation}>
                Confirm & Donate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donations;