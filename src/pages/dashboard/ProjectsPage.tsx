import { useState } from "react";
import { MapPin, CheckCircle, TrendingUp, Sparkles, X } from "lucide-react";
import "./Projects.css";

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  raised: number;
  goal: number;
  location: string;
  verified: boolean;
  trending?: boolean;
  new?: boolean;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Clean Water Nigeria",
    description: "Providing access to clean water for 5,000 rural families",
    category: "Water",
    image: "/mon1.PNG",
    raised: 180000,
    goal: 250000,
    location: "Nigeria",
    verified: true,
  },
  {
    id: 2,
    title: "Solar Power for Schools",
    description: "Installing solar panels in 20 rural schools",
    category: "Energy",
    image: "/mon2.PNG",
    raised: 420000,
    goal: 500000,
    location: "Kenya",
    verified: true,
    trending: true,
  },
  {
    id: 3,
    title: "Healthcare for Rural Women",
    description: "Mobile clinics serving 10,000 women in remote areas",
    category: "Healthcare",
    image: "/mon3.PNG",
    raised: 95000,
    goal: 200000,
    location: "Uganda",
    verified: true,
    new: true,
  },
  {
    id: 4,
    title: "Education Fund Initiative",
    description: "Scholarships for 500 underprivileged students",
    category: "Education",
    image: "/mon4.PNG",
    raised: 310000,
    goal: 400000,
    location: "Ghana",
    verified: true,
  },
  {
    id: 5,
    title: "Youth Empowerment Programme",
    description: "Skills training for 1,000 youth in tech and entrepreneurship",
    category: "Education",
    image: "/mon5.PNG",
    raised: 145000,
    goal: 300000,
    location: "Tanzania",
    verified: true,
  },
  {
    id: 6,
    title: "Renewable Energy Initiative",
    description: "Community-owned wind farm project",
    category: "Energy",
    image: "/mon6.PNG",
    raised: 560000,
    goal: 750000,
    location: "Morocco",
    verified: true,
    trending: true,
  },
];

const ProjectsPage = () => {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && project.verified) ||
      (statusFilter === "trending" && project.trending) ||
      (statusFilter === "new" && project.new);
    return matchesCategory && matchesStatus;
  });

  const calculateProgress = (raised: number, goal: number) =>
    Math.round((raised / goal) * 100);

  const openModal = (project: Project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  // Mock donation data for the modal
  const recentDonations = [
    { amount: 50000, time: "2 days ago" },
    { amount: 25000, time: "5 days ago" },
    { amount: 100000, time: "1 week ago" },
  ];

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div>
          <h1 className="projects-title">Projects</h1>
          <p className="projects-subtitle">
            Discover and support verified social impact projects
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="projects-filters">
        <div className="filter-left">
          <span className="filter-label">Filter by:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-select"
          >
            <option value="all">All Categories</option>
            <option value="Water">Water</option>
            <option value="Energy">Energy</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
          </select>
        </div>

        <div className="filter-right">
          <button
            className={`status-badge verified ${statusFilter === "verified" ? "active" : ""}`}
            onClick={() =>
              setStatusFilter(statusFilter === "verified" ? "all" : "verified")
            }
          >
            <CheckCircle size={14} />
            Verified
          </button>
          <button
            className={`status-badge trending ${statusFilter === "trending" ? "active" : ""}`}
            onClick={() =>
              setStatusFilter(statusFilter === "trending" ? "all" : "trending")
            }
          >
            <TrendingUp size={14} />
            Trending
          </button>
          <button
            className={`status-badge new ${statusFilter === "new" ? "active" : ""}`}
            onClick={() =>
              setStatusFilter(statusFilter === "new" ? "all" : "new")
            }
          >
            <Sparkles size={14} />
            New
          </button>
        </div>
      </div>

      {/* Project Grid */}
      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-image-container">
              <img
                src={project.image}
                alt={project.title}
                className="project-image"
              />
              {project.verified && (
                <div className="verified-badge">
                  <CheckCircle size={18} />
                </div>
              )}
            </div>

            <div className="project-card-content">
              <h3 className="project-card-title">{project.title}</h3>
              <p className="project-card-description">{project.description}</p>

              <div className="project-meta">
                <div className="project-location">
                  <MapPin size={14} />
                  <span>{project.location}</span>
                </div>
                <span className="project-category-badge">{project.category}</span>
              </div>

              <div className="project-funding">
                <div className="funding-amounts">
                  <span className="amount-raised">
                    ₦{project.raised.toLocaleString()}
                  </span>
                  <span className="amount-goal">
                    of ₦{project.goal.toLocaleString()}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${calculateProgress(project.raised, project.goal)}%`,
                    }}
                  />
                </div>
              </div>

              <button 
                className="view-details-btn"
                onClick={() => openModal(project)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedProject.title}</h2>
              <button className="close-button" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="modal-image-container">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="modal-image"
                />
                {selectedProject.verified && (
                  <div className="verified-badge">
                    <CheckCircle size={18} />
                  </div>
                )}
              </div>

              <p className="modal-description">{selectedProject.description}</p>

              <div className="modal-stats">
                <div className="stat-item">
                  <span className="stat-value">
                    ₦{selectedProject.raised.toLocaleString()}
                  </span>
                  <span className="stat-label">Raised</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {calculateProgress(selectedProject.raised, selectedProject.goal)}%
                  </span>
                  <span className="stat-label">Funded</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">234</span>
                  <span className="stat-label">Donors</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">1,250</span>
                  <span className="stat-label">Beneficiaries</span>
                </div>
              </div>

              <div className="modal-funding">
                <div className="funding-amounts">
                  <span className="amount-raised">
                    ₦{selectedProject.raised.toLocaleString()}
                  </span>
                  <span className="amount-goal">
                    of ₦{selectedProject.goal.toLocaleString()}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${calculateProgress(selectedProject.raised, selectedProject.goal)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="modal-donations">
                <h3 className="donations-title">Recent Donations</h3>
                {recentDonations.map((donation, index) => (
                  <div key={index} className="donation-item">
                    <span className="donation-amount">
                      ₦{donation.amount.toLocaleString()}
                    </span>
                    <span className="donation-time">{donation.time}</span>
                  </div>
                ))}
              </div>

              <button className="donate-button">Donate Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;