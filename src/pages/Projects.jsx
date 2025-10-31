import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { Search, SlidersHorizontal, Users, TrendingUp, Eye, X, MapPin, CheckCircle } from "lucide-react";
import { API_CONFIG, API_BASE_URL } from "../api/config";
import axios from "axios";
import "./projects.css";

const categories = [
  "All Projects",
  "Environment",
  "Education",
  "Healthcare",
  "Women Empowerment",
  "Water & Sanitation",
  "Energy",
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All Projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("funded");
  const [selectedProject, setSelectedProject] = useState(null);
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
      console.log("Fetching projects from:", `${API_BASE_URL}${API_CONFIG.projects.list.url}`);
      
      const response = await axios({
        method: API_CONFIG.projects.list.method,
        url: `${API_BASE_URL}${API_CONFIG.projects.list.url}`,
      });
      
      const data = response.data;
      console.log("API Response:", data);
      
      const transformedProjects = transformProjectsData(data);
      console.log("Transformed projects:", transformedProjects);
      
      setProjects(transformedProjects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please try again later.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // IMPROVED: Better image URL construction with multiple fallbacks
  const transformProjectsData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) {
      console.warn("Unexpected API response structure:", apiData);
      return [];
    }
    
    return apiData.map(project => {
      let imageUrl;
      
      // Try multiple image URL strategies
      if (project.image) {
        if (project.image.startsWith('/static/')) {
          // Format: "/static/projects/filename.webp"
          imageUrl = `${API_BASE_URL}${project.image}`;
        } else if (project.image.startsWith('/projects/') && project.image.endsWith('/image')) {
          // Format: "/projects/{id}/image"
          imageUrl = `${API_BASE_URL}${project.image}`;
        } else if (project.image.startsWith('http')) {
          // Already full URL
          imageUrl = project.image;
        } else {
          // Unknown format, try project ID approach
          imageUrl = project.id ? `${API_BASE_URL}/api/v1/projects/${project.id}/image` : getPlaceholderImage(project.title);
        }
      } else if (project.id) {
        // No image provided, try to construct from project ID
        imageUrl = `${API_BASE_URL}/api/v1/projects/${project.id}/image`;
      } else {
        // Final fallback
        imageUrl = getPlaceholderImage(project.title);
      }
      
      console.log(`Image URL for ${project.title}:`, imageUrl);
      
      return {
        id: project.id,
        title: project.title || "Untitled Project",
        description: project.description || "No description available",
        category: project.category || "General",
        image: imageUrl,
        raised: project.amount_raised || 0,
        goal: project.target_amount || 0,
        backers: project.backers_count || 0,
        location: project.location || "Unknown",
        verified: project.verified || false,
        wallet_address: project.wallet_address,
        created_at: project.created_at,
      };
    });
  };

  const getPlaceholderImage = (title) => {
    const colors = ['22c55e', '3b82f6', 'f59e0b', 'ef4444', '8b5cf6', '06b6d4'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const text = encodeURIComponent(title || 'Project Image');
    return `https://via.placeholder.com/400x250/${color}/ffffff?text=${text}`;
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  const handleSupportProject = (project) => {
    // Store project for donation page
    const projectData = {
      id: project.id,
      name: project.title,
      category: project.category
    };
    localStorage.setItem('selectedProject', JSON.stringify(projectData));
    // Navigate to donations page
    window.location.href = '/donations';
  };

  useEffect(() => {
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
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProjects = [...searchedProjects].sort((a, b) => {
    if (sortBy === "funded") {
      const aFunded = calculateFundedPercentage(a.raised, a.goal);
      const bFunded = calculateFundedPercentage(b.raised, b.goal);
      return bFunded - aFunded;
    }
    if (sortBy === "raised") return (b.raised || 0) - (a.raised || 0);
    if (sortBy === "backers") return (b.backers || 0) - (a.backers || 0);
    if (sortBy === "recent") return new Date(b.created_at) - new Date(a.created_at);
    return 0;
  });

  const calculateFundedPercentage = (raised, goal) => {
    if (!goal || goal === 0) return 0;
    return Math.min(Math.round((raised / goal) * 100), 100);
  };

  const formatCurrency = (amount) => {
    return `₦${parseInt(amount).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="services-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          Loading projects...
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
          tracked on blockchain for complete transparency.
        </p>
        
        <div className="projects-stats">
          <div className="stat-badge">
            <strong>{projects.length}</strong> Active Projects
          </div>
          <div className="stat-badge">
            <strong>{projects.filter(p => p.verified).length}</strong> Verified
          </div>
          <div className="stat-badge">
            <strong>₦{projects.reduce((sum, p) => sum + (p.raised || 0), 0).toLocaleString()}</strong> Total Raised
          </div>
        </div>
      </motion.div>

      <div ref={controlsRef} className="services-controls">
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search projects by title, description, or location..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="filter-button" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={18} />
          Filters & Sort
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
              <h3>Sort Projects</h3>
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
              <button
                className={`sort-option ${sortBy === "recent" ? "active" : ""}`}
                onClick={() => setSortBy("recent")}
              >
                Most Recent
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
            {searchQuery && <p>Try adjusting your search terms or browse all categories.</p>}
            <button onClick={() => { setSearchQuery(''); setActiveCategory('All Projects'); }} className="retry-button">
              View All Projects
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
                      console.error(`Failed to load image: ${project.image}`);
                      // Try alternative URL
                      const altUrl = project.id ? 
                        `${API_BASE_URL}/api/v1/projects/${project.id}/image` : 
                        getPlaceholderImage(project.title);
                      
                      if (e.target.src !== altUrl) {
                        e.target.src = altUrl;
                      } else {
                        e.target.src = getPlaceholderImage(project.title);
                      }
                    }}
                    onLoad={() => console.log(`✅ Image loaded: ${project.image}`)}
                  />
                  <div className="project-category-badge">{project.category}</div>
                  {project.verified && (
                    <div className="verified-badge">
                      <CheckCircle size={14} />
                      Verified
                    </div>
                  )}
                </div>

                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  
                  <div className="project-location">
                    <MapPin size={14} />
                    <span>{project.location}</span>
                  </div>

                  <div className="project-progress">
                    <div className="progress-amounts">
                      <span className="amount-raised">{formatCurrency(project.raised)}</span>
                      <span className="amount-goal">of {formatCurrency(project.goal)} goal</span>
                    </div>
                    <div className="progress-bar-container">
                      <motion.div
                        className="progress-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${fundedPercentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                    <div className="progress-percentage">{fundedPercentage}% funded</div>
                  </div>

                  <div className="project-stats">
                    <div className="stat-item">
                      <Users size={14} />
                      <span>{project.backers} backers</span>
                    </div>
                    <div className="stat-item">
                      <TrendingUp size={14} />
                      <span className="stat-percent">{fundedPercentage}% funded</span>
                    </div>
                  </div>

                  <div className="project-actions">
                    <button 
                      className="btn-view"
                      onClick={() => handleViewDetails(project)}
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                    <button 
                      className="btn-support"
                      onClick={() => handleSupportProject(project)}
                    >
                      Support Project
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="project-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Project Details</h2>
              <button className="close-button" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              <div className="project-hero-modal">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="project-hero-image"
                  onError={(e) => {
                    e.target.src = getPlaceholderImage(selectedProject.title);
                  }}
                />
                <div className="project-badges-modal">
                  {selectedProject.verified && (
                    <span className="badge verified">
                      <CheckCircle size={16} />
                      Verified Project
                    </span>
                  )}
                  <span className="badge category">{selectedProject.category}</span>
                </div>
              </div>

              <div className="project-info-modal">
                <h1 className="project-title-modal">{selectedProject.title}</h1>
                <p className="project-description-modal">{selectedProject.description}</p>

                <div className="project-stats-modal">
                  <div className="stat-card-modal">
                    <div className="stat-value">{formatCurrency(selectedProject.raised)}</div>
                    <div className="stat-label">Amount Raised</div>
                  </div>
                  <div className="stat-card-modal">
                    <div className="stat-value">{formatCurrency(selectedProject.goal)}</div>
                    <div className="stat-label">Funding Goal</div>
                  </div>
                  <div className="stat-card-modal">
                    <div className="stat-value">{selectedProject.backers}</div>
                    <div className="stat-label">Supporters</div>
                  </div>
                  <div className="stat-card-modal">
                    <div className="stat-value">{calculateFundedPercentage(selectedProject.raised, selectedProject.goal)}%</div>
                    <div className="stat-label">Funded</div>
                  </div>
                </div>

                <div className="project-meta-modal">
                  <div className="meta-item">
                    <MapPin size={16} />
                    <span><strong>Location:</strong> {selectedProject.location}</span>
                  </div>
                  <div className="meta-item">
                    <strong>Wallet Address:</strong> 
                    <span className="wallet-address">{selectedProject.wallet_address || 'Not specified'}</span>
                  </div>
                  {selectedProject.created_at && (
                    <div className="meta-item">
                      <strong>Created:</strong> {formatDate(selectedProject.created_at)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="secondary-btn" onClick={handleCloseModal}>
                Close
              </button>
              <button 
                className="primary-btn"
                onClick={() => handleSupportProject(selectedProject)}
              >
                Support This Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;