// src/components/DonationModal/DonationModal.jsx
import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './DonationModal.css';

const DonationModal = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const amountNgn = searchParams.get('amount') || '250'; // fallback
  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigate = useNavigate();

  // Mock data (replace with real project fetch)
  const projectName = 'Solar Power for Schools';
  const hbarRate = 0.001; // 1 NGN = 0.001 HBAR
  const transactionFee = 0.0001;
  const amountHbar = (parseFloat(amountNgn) * hbarRate).toFixed(4);
  const totalHbar = (parseFloat(amountHbar) + transactionFee).toFixed(4);

  const closeModal = () => {
    navigate(-1);
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    // Simulate API call
    setTimeout(() => {}, 1500);
  };

  if (isConfirmed) {
    return (
      <div className="donate-modal-overlay" onClick={closeModal}>
        <div className="donate-modal congrats" onClick={(e) => e.stopPropagation()}>
          <button className="close-x" onClick={closeModal}>
            <X size={24} />
          </button>
          <CheckCircle size={64} className="success-check" />
          <h2>Donation Successful!</h2>
          <p>Thank you for supporting <strong>{projectName}</strong></p>
          <p>Your ₦{amountNgn} has been processed on Hedera blockchain.</p>
          <p className="tx-id">Transaction ID: <strong>0.0.123456</strong></p>
          <button className="done-btn" onClick={closeModal}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="donate-modal-overlay" onClick={closeModal}>
      <div className="donate-modal confirm" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={closeModal}>
          <X size={20} />
        </button>
        <h2>Confirm Donation</h2>
        <p className="subtitle">
          You're about to donate ₦{amountNgn} to <strong>{projectName}</strong>
        </p>

        <div className="amount-line">
          <span>Amount in HBAR:</span>
          <span className="value">- {amountHbar} HBAR</span>
        </div>
        <div className="amount-line">
          <span>Transaction Fee:</span>
          <span className="value">- {transactionFee} HBAR</span>
        </div>
        <div className="amount-line total">
          <span>Total:</span>
          <span className="value">- {totalHbar} HBAR</span>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={closeModal}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            Confirm & Donate
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;