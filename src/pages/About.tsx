import { motion } from "framer-motion";
import { Users, Globe, DollarSign, TrendingUp } from "lucide-react";
import "./About.css";

const About = () => {
  const teamMembers = [
    {
      name: "Elizabeth Okokon",
      role: "PROJECT MANAGER / HEDERA DEVELOPER",
      image: "/kanecteam6.jpg"
    },
    {
      name: "Akinrogunde Omomijudeoluwa",
      role: "BACKEND & BLOCKCHAIN DEVELOPER",
      image: "/kanecteam1.jpg"
    },
    {
      name: "Eze kelechi Joseph",
      role: "FRONTEND DEVELOPER",
      image: "/hue2.png"
    },
    {
      name: "Esimke Chisom Emmanuel",
      role: "FRONTEND DEVELOPER",
      image: "aichisom.jpg"
    },
    {
      name: "Olise Oseyenum Kenneth",
      role: "UI/UX DESIGNER",
      image: "/kanecteam2.jpg"
    },
    {
      name: "Isaac Ugwu Chinenye",
      role: "BACKEND & BLOCKCHAIN DEVELOPER",
      image: "/kanecteam3.jpg"
    }
  ];

  return (
    <div className="about-page">
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="hero-label">Our Story</p>
            <h1 className="hero-title">Who We Are</h1>
            <p className="hero-description">
              We're a team of innovators, blockchain enthusiasts, and social impact advocates building the future of transparent charitable giving. Our mission is to connect donors with verified projects through the power of Hedera's distributed ledger technology.
            </p>
            <button className="hero-button">Read Donating</button>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="about-container">
          <div className="mission-vision-grid">
            <motion.div 
              className="mission-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="section-subtitle green">Our Mission</h3>
              <p className="section-text">
                To revolutionize charitable giving by using Hedera's blockchain and AI to ensure every donation is traceable, transparent, and impactful, empowering both donors and communities through a decentralized ledger approach.
              </p>
            </motion.div>
            <motion.div 
              className="vision-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="section-subtitle yellow">Our Vision</h3>
              <p className="section-text">
                To create a world where every donation is transparent, accountable, and impactful, empowering donors and communities through a decentralized ledger system on Hedera.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="impact-section">
        <div className="about-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-title">Our Impact</h3>
            <p className="section-description">
              Real numbers that demonstrate our commitment to transparency and measurable change
            </p>
          </motion.div>

          <div className="impact-grid">
            <motion.div 
              className="impact-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="impact-icon green">
                <Users size={32} />
              </div>
              <h3 className="impact-number">50K+ Donors</h3>
              <p className="impact-text">Building a community of transparent</p>
            </motion.div>

            <motion.div 
              className="impact-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="impact-icon green">
                <Globe size={32} />
              </div>
              <h3 className="impact-number">100+ Projects</h3>
              <p className="impact-text">Verified social impact initiatives</p>
            </motion.div>

            <motion.div 
              className="impact-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="impact-icon green">
                <Globe size={32} />
              </div>
              <h3 className="impact-number">25 Countries</h3>
              <p className="impact-text">Global reach and impact</p>
            </motion.div>

            <motion.div 
              className="impact-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="impact-icon green">
                <DollarSign size={32} />
              </div>
              <h3 className="impact-number">$2M+ Raised</h3>
              <p className="impact-text">Transparent donations on blockchain</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="about-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="section-label">Meet The Team</p>
            <h3 className="text-title">The People Behind KANEC</h3>
            <p className="section-description">
              Our diverse team brings together expertise in blockchain technology, social impact, and community building to create meaningful change.
            </p>
          </motion.div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="team-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="team-image-wrapper">
                  <img src={member.image} alt={member.name} />
                </div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="values-section">
        <div className="about-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-title">Our Core Values</h3>
          </motion.div>

          <div className="values-grid">
            <motion.div
              className="value-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="value-icon">T</div>
              <h3 className="value-title">Transparency</h3>
              <p className="value-text">
                Every transaction is recorded on the blockchain, ensuring complete visibility and accountability.
              </p>
            </motion.div>

            <motion.div
              className="value-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="value-icon">I</div>
              <h3 className="value-title">Impact</h3>
              <p className="value-text">
                We measure and report real-world outcomes, ensuring donations create meaningful change.
              </p>
            </motion.div>

            <motion.div
              className="value-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="value-icon">C</div>
              <h3 className="value-title">Community</h3>
              <p className="value-text">
                Building a global network of donors, projects, and changemakers working together.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="about-container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="cta-title">Ready to Make an Impact?</h3>
            <p className="cta-description">
              Join thousands of donors making a difference through transparent, blockchain-verified donations
            </p>
            <div className="cta-buttons">
              <button className="cta-button primary">Start Donating</button>
              <button className="cta-button secondary">Explore Projects</button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;