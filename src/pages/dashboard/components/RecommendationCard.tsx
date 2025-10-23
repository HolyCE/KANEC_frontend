import './RecommendationCard.css';

interface RecommendationCardProps {
  title: string;
  matchScore: string;
  description: string;
  category: string;
}

const RecommendationCard = ({ title, matchScore, description, category }: RecommendationCardProps) => {
  return (
    <div className="recommendation-card">
      <div className="rec-header">
        <h4 className="rec-title">{title}</h4>
        <span className="match-badge">{matchScore}</span>
      </div>
      <p className="rec-description">{description}</p>
      <div className="rec-footer">
        <span className="category-badge">{category}</span>
        <button className="donate-btn">Donate Now</button>
      </div>
    </div>
  );
};

export default RecommendationCard;