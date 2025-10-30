import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { Search, SlidersHorizontal, Users, TrendingUp, Eye, X } from "lucide-react";
import { API_CONFIG, buildUrl } from "../api/config";
import axios from "axios";
import "./projects.css";

const categories = [
  "All Projects",
  "Education",
  "Healthcare",
  "Women Empowerment",
  "Water & Sanitation",
  "Energy",
];

// API service function
const projectsAPI = {
  getProjects: async () => {
    try {
      const response = await axios({
        method: API_CONFIG.projects.list.method,
        url: buildUrl(API_CONFIG.projects.list.url),
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
};

const Services = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All Projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("funded");
  const heroRef = useRef(null);
  const controlsRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching projects from:", buildUrl(API_CONFIG.projects.list.url));
      
      const data = await projectsAPI.getProjects();
      console.log("API Response:", data);
      
      // Transform API data to match component expectations
      const transformedProjects = transformProjectsData(data);
      console.log("Transformed projects:", transformedProjects);
      
      setProjects(transformedProjects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please try again later.");
      setProjects([]); // Ensure empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Data transformation function
  const transformProjectsData = (apiData) => {
    // Handle different possible API response structures
    if (!apiData) return [];
    
    // If API returns array directly
    if (Array.isArray(apiData)) {
      return apiData.map(project => ({
        id: project.id || project._id,
        title: project.title || project.name || "Untitled Project",
        description: project.description || "No description available",
        category: project.category || project.type || "General",
        image: project.image || project.image_url || project.cover_image || "/placeholder-image.jpg",
        raised: project.raised || project.amount_raised || project.funds_raised || 0,
        goal: project.goal || project.funding_goal || project.target_amount || 0,
        backers: project.backers || project.donors_count || project.supporters || 0,
      }));
    }
    
    // If API returns object with data property
    if (apiData.data && Array.isArray(apiData.data)) {
      return apiData.data.map(project => ({
        id: project.id || project._id,
        title: project.title || project.name || "Untitled Project",
        description: project.description || "No description available",
        category: project.category || project.type || "General",
        image: project.image || project.image_url || project.cover_image || "/placeholder-image.jpg",
        raised: project.raised || project.amount_raised || project.funds_raised || 0,
        goal: project.goal || project.funding_goal || project.target_amount || 0,
        backers: project.backers || project.donors_count || project.supporters || 0,
      }));
    }
    
    // If API returns object with results property
    if (apiData.results && Array.isArray(apiData.results)) {
      return apiData.results.map(project => ({
        id: project.id || project._id,
        title: project.title || project.name || "Untitled Project",
        description: project.description || "No description available",
        category: project.category || project.type || "General",
        image: project.image || project.image_url || project.cover_image || "/placeholder-image.jpg",
        raised: project.raised || project.amount_raised || project.funds_raised || 0,
        goal: project.goal || project.funding_goal || project.target_amount || 0,
        backers: project.backers || project.donors_count || project.supporters || 0,
      }));
    }
    
    console.warn("Unexpected API response structure:", apiData);
    return [];
  };

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

  // Filter and sort projects
  const filteredProjects = activeCategory === "All Projects" 
    ? projects 
    : projects.filter((p) => p.category === activeCategory);

  const searchedProjects = filteredProjects.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProjects = [...searchedProjects].sort((a, b) => {
    if (sortBy === "funded") {
      const aFunded = calculateFundedPercentage(a.raised, a.goal);
      const bFunded = calculateFundedPercentage(b.raised, b.goal);
      return bFunded - aFunded;
    }
    if (sortBy === "raised") return (b.raised || 0) - (a.raised || 0);
    if (sortBy === "backers") return (b.backers || 0) - (a.backers || 0);
    return 0;
  });

  const calculateFundedPercentage = (raised, goal) => {
    if (!goal || goal === 0) return 0;
    return Math.min(Math.round((raised / goal) * 100), 100);
  };

  // Debug: Check what data we have
  console.log("Current projects state:", projects);
  console.log("Filtered projects:", filteredProjects);
  console.log("Sorted projects:", sortedProjects);

  if (loading) {
    return (
      <div className="services-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          Loading projects from API...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchProjects} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
        
        {/* Debug info - remove in production */}
        <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          Showing {sortedProjects.length} projects from API
        </div>
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
        {sortedProjects.length === 0 ? (
          <div className="no-projects">
            <p>No projects found matching your criteria.</p>
            <button onClick={fetchProjects} className="retry-button">
              Refresh Projects
            </button>
          </div>
        ) : (
          sortedProjects.map((project, index) => {
            const fundedPercentage = calculateFundedPercentage(project.raised, project.goal);
            
            return (
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
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                  <div className="project-category-badge">{project.category}</div>
                </div>

                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>

                  <div className="project-progress">
                    <div className="progress-amounts">
                      <span className="amount-raised">{project.raised.toLocaleString()} HBAR</span>
                      <span className="amount-goal">of {project.goal.toLocaleString()} HBAR</span>
                    </div>
                    <div className="progress-bar-container">
                      <motion.div
                        className="progress-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${fundedPercentage}%` }}
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
                      <span className="stat-percent">{fundedPercentage}% funded</span>
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
            );
          })
        )}
      </div>
    </div>
  );
};

export default Services;