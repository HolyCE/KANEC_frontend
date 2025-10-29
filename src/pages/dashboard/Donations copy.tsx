import { useState } from "react";
import { CheckCircle, Wallet, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import "./Donations.css";

const projects = [
  { id: 1, name: "Clean Water Nigeria", category: "Water" },
  { id: 2, name: "Solar Power for Schools", category: "Energy" },
  { id: 3, name: "Healthcare for Rural Women", category: "Healthcare" },
  { id: 4, name: "Education Fund Initiative", category: "Education" },
  { id: 5, name: "Youth Empowerment Program", category: "Education" },
];

const currencies = [
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "HBAR", name: "Hedera HBAR", symbol: "ℏ" },
];

const Donations = () => {
  const [selectedProject, setSelectedProject] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  const walletAddress = "0xA3D...F98";
  const transactionFee = "~0.0001 HBAR";
  const network = "Hedera Mainnet";

  const handleDonate = () => {
    if (!selectedProject) {
      toast.error("Please select a project");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }
    toast.success(`Donation of ${getCurrencySymbol()}${amount} processed successfully via Hedera!`);
    setSelectedProject("");
    setAmount("");
  };

  const getCurrencySymbol = () => {
    const currency = currencies.find(curr => curr.code === selectedCurrency);
    return currency ? currency.symbol : "₦";
  };

  return (
    <div className="donations-page">
      <div className="donations-header">
        <h1 className="donations-title">Make a Donation</h1>
        <p className="donations-subtitle">Support verified social impact projects on Hedera</p>
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
          <div className="project-placeholder">
            {selectedProject ? (
              <div className="project-info">
                <h3 className="project-name">{selectedProject}</h3>
                <p className="project-category">
                  {projects.find(p => p.name === selectedProject)?.category}
                </p>
                <p className="project-description">
                  This project is verified and audited for maximum impact and transparency.
                </p>
              </div>
            ) : (
              <p>Select a project to see details</p>
            )}
          </div>
        </div>

        <div className="donation-details-card">
          <div className="card-header">
            <h2 className="card-title">Donation Details</h2>
          </div>
          <p className="blockchain-note">All transactions are recorded on Hedera blockchain</p>

          <div className="donation-form">
            <div className="form-field">
              <label htmlFor="project" className="form-label">Select Project</label>
              <div className="custom-select">
                <select 
                  id="project"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="select-trigger"
                >
                  <option value="">Choose a project to support</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.name}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <div className="select-arrow">▼</div>
              </div>
            </div>

            <div className="amount-section">
              <div className="form-field amount-input-field">
                <label htmlFor="amount" className="form-label">Donation Amount</label>
                <div className="amount-input-container">
                  <span className="currency-symbol">{getCurrencySymbol()}</span>
                  <input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="custom-input amount-input"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-field currency-field">
                <label htmlFor="currency" className="form-label">Currency</label>
                <div className="custom-select">
                  <select 
                    id="currency"
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="select-trigger"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                  <div className="select-arrow">▼</div>
                </div>
              </div>
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
                <span className="info-label">Selected Currency</span>
                <span className="info-value">
                  {selectedCurrency} ({getCurrencySymbol()})
                </span>
              </div>
            </div>

            <button className="donate-button" onClick={handleDonate}>
              <Wallet size={18} />
              Donate via Hedera
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donations;