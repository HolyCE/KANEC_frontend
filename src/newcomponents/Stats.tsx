import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './stats.css';

const Stats = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { value: '5,248', label: 'Trained Donors' },
    { value: '187', label: 'Verified Projects' },
    { value: '96', label: 'Communities Impacted' },
  ];

  return (
    <section className="stats" ref={ref}>
      <div className="stats-container">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-item"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
