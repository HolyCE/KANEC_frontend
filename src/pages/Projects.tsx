import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { Search, SlidersHorizontal, Users, TrendingUp, Eye, X } from "lucide-react";
import "./projects.css";

const projects = [
  {
    id: 1,
    title: "Digital Education for Rural Communities",
    description: "Providing tablets and internet access to 500 students in rural Kenya. Empowering the next generation with digital literacy.",
    category: "Education",
    image: "/mon1.PNG",
    raised: 12450,
    goal: 20000,
    backers: 187,
    funded: 62,
  },
  {
    id: 2,
    title: "Women Entrepreneurs Support Fund",
    description: "Microloans and training for 200 women entrepreneurs in Nigeria to start sustainable businesses and achieve financial independence.",
    category: "Women Empowerment",
    image: "/mon2.PNG",
    raised: 8900,
    goal: 15000,
    backers: 143,
    funded: 59,
  },
  {
    id: 3,
    title: "Community Healthcare Clinic",
    description: "Building and equipping a healthcare facility serving 10,000 people in rural Uganda with essential medical services.",
    category: "Healthcare",
    image: "/mon3.PNG",
    raised: 34500,
    goal: 50000,
    backers: 412,
    funded: 69,
  },
  {
    id: 4,
    title: "Clean Water Initiative",
    description: "Installing water purification systems in 5 villages across Tanzania, providing clean drinking water to 3,000 families.",
    category: "Water & Sanitation",
    image: "/mon4.PNG",
    raised: 16200,
    goal: 25000,
    backers: 234,
    funded: 65,
  },
  {
    id: 5,
    title: "Youth Skills Training Center",
    description: "Vocational training center teaching technology, agriculture, and trade skills to 300 young people in Ghana.",
    category: "Education",
    image: "/mon5.PNG",
    raised: 7800,
    goal: 18000,
    backers: 98,
    funded: 43,
  },
  {
    id: 6,
    title: "Solar Energy for Schools",
    description: "Providing solar panels and batteries to 10 schools in Rwanda, ensuring reliable electricity for learning.",
    category: "Energy",
    image: "/mon6.PNG",
    raised: 21300,
    goal: 30000,
    backers: 276,
    funded: 71,
  },
];

const categories = [
  "All Projects",
  "Education",
  "Healthcare",
  "Women Empowerment",
  "Water & Sanitation",
  "Energy",
];

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("All Projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("funded");
  const heroRef = useRef(null);
  const controlsRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    // Hero entrance animation with GSAP
    if (heroInView) {
      gsap.fromTo(
        heroRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        }
      );
    }
  }, [heroInView]);

  useEffect(() => {
    // Controls slide in animation
    gsap.fromTo(
      controlsRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.3,
        ease: "power2.out",
      }
    );
  }, []);

  const filteredProjects =
    activeCategory === "All Projects"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const searchedProjects = filteredProjects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProjects = [...searchedProjects].sort((a, b) => {
    if (sortBy === "funded") return b.funded - a.funded;
    if (sortBy === "raised") return b.raised - a.raised;
    if (sortBy === "backers") return b.backers - a.backers;
    return 0;
  });

  return (
    <div className="services-container">
      <motion.div
        ref={heroRef}
        className="services-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="services-title">
          Discover <span className="services-title-accent">Impact Projects</span>
        </h1>
        <p className="services-subtitle">
          Browse verified social impact projects across Africa. Every donation is
          tracked on blockchain.
        </p>
      </motion.div>

      <div ref={controlsRef} className="services-controls">
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="filter-button" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={18} />
          Advanced Filters
        </button>
      </div>

      {showFilters && (
        <motion.div
          className="filters-panel"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="filters-content">
            <div className="filter-header">
              <h3>Sort by</h3>
              <button onClick={() => setShowFilters(false)} className="close-filters">
                <X size={18} />
              </button>
            </div>
            <div className="sort-options">
              <button
                className={`sort-option ${sortBy === "funded" ? "active" : ""}`}
                onClick={() => setSortBy("funded")}
              >
                Most Funded
              </button>
              <button
                className={`sort-option ${sortBy === "raised" ? "active" : ""}`}
                onClick={() => setSortBy("raised")}
              >
                Highest Raised
              </button>
              <button
                className={`sort-option ${sortBy === "backers" ? "active" : ""}`}
                onClick={() => setSortBy("backers")}
              >
                Most Backers
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        className="category-tabs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {categories.map((category) => (
          <button
            key={category}
            className={`category-tab ${activeCategory === category ? "active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </motion.div>

      <div className="projects-grid">
        {sortedProjects.map((project, index) => (
          <motion.div
            key={project.id}
            className="project-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="project-image-wrapper">
              <img
                src={project.image}
                alt={project.title}
                className="project-image"
              />
              <div className="project-category-badge">{project.category}</div>
            </div>

            <div className="project-content">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>

              <div className="project-progress">
                <div className="progress-amounts">
                  <span className="amount-raised">{project.raised} HBAR</span>
                  <span className="amount-goal">of {project.goal} HBAR</span>
                </div>
                <div className="progress-bar-container">
                  <motion.div
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.funded}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
              </div>

              <div className="project-stats">
                <div className="stat-item">
                  <Users className="stat-icon" />
                  <span>{project.backers} backers</span>
                </div>
                <div className="stat-item">
                  <TrendingUp className="stat-icon" />
                  <span className="stat-percent">{project.funded}% funded</span>
                </div>
              </div>

              <div className="project-actions">
                <button className="btn-view">
                  <Eye size={16} />
                  View Details
                </button>
                <button className="btn-support">Support Project</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Services;