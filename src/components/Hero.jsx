import React from "react";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      {/* LEFT SIDE */}
      <div className="hero-content">
        <span className="transparency-badge">
          🌍 Global Donor Transparency Ledger
        </span>

        <h1>
          Fund Verified African Impact.
          <span className="highlight">Guaranteed <br />by Hedera.</span>
        </h1>

        <p>
          With <span className="bold">Kanec Impact Ledger</span>, donors see
          every dollar <br />
          move in real time ensuring funds reach verified African <br />
          impact projects without corruption.
        </p>

        <div className="hero-buttons">
          <button className="donate-btn">Donate Now</button>
          <button className="join-btn">Join the Network</button>
        </div>
      </div>

      {/* RIGHT SIDE (recreated cleanly) */}
      <div className="hero-visual">
        {/* Top Floating Tag */}
        <div className="verified-tag">✅ 100% Verified Blockchain Proven</div>

        {/* Main Project Card */}
        <div className="project-card">
          <img
            src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=800&q=80"
            alt="Education for All"
          />
          <div className="project-info">
            <div className="header-row">
              <h3>Education for All</h3>
              <span className="status">Active</span>
            </div>

            <div className="details">
              <p>
                <strong>$45,000</strong> raised of $100,000
              </p>
              <p>
                <strong>850</strong> donors
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Floating Tag */}
        <div className="tracking-tag">📊 Real-Time Impact Tracking</div>
      </div>
    </section>
  );
}

export default Hero;
