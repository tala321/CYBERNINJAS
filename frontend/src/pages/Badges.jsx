import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const badges = [
  {
    id: 1,
    name: "Information Guardian",
    description: "Complete Level 1 and learn how to protect personal information.",
    icon: "🛡️",
    category: "Levels",
    level: "LEVEL 1",
    earned: true,
    xp: 100,
  },
  {
    id: 2,
    name: "Cyber Explorer",
    description: "Complete your first learning journey.",
    icon: "🧭",
    category: "Progress",
    level: "LEVEL 1",
    earned: true,
    xp: 75,
  },
  {
    id: 3,
    name: "Challenge Master",
    description: "Complete 10 cybersecurity challenges.",
    icon: "⚡",
    category: "Challenges",
    level: "LEVEL 1",
    earned: true,
    xp: 100,
  },
  {
    id: 4,
    name: "Safety Scout",
    description: "Learn how to identify safe and unsafe information sharing.",
    icon: "🔐",
    category: "Skills",
    level: "LEVEL 2",
    earned: false,
    xp: 125,
  },
  {
    id: 5,
    name: "Password Protector",
    description: "Master the basics of strong and secure passwords.",
    icon: "🔑",
    category: "Skills",
    level: "LEVEL 2",
    earned: false,
    xp: 150,
  },
  {
    id: 6,
    name: "Cyber Detective",
    description: "Complete a series of security investigation challenges.",
    icon: "🔎",
    category: "Challenges",
    level: "LEVEL 3",
    earned: false,
    xp: 175,
  },
  {
    id: 7,
    name: "Ninja Warrior",
    description: "Defeat your first Boss Challenge.",
    icon: "🥷",
    category: "Boss",
    level: "LEVEL 3",
    earned: false,
    xp: 250,
  },
  {
    id: 8,
    name: "Cyber Hero",
    description: "Complete five cybersecurity levels.",
    icon: "🦸",
    category: "Levels",
    level: "LEVEL 5",
    earned: false,
    xp: 500,
  },
];

const categories = [
  "All",
  "Earned",
  "Levels",
  "Challenges",
  "Skills",
  "Boss",
  "Progress",
];

export default function Badges() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");

  const earnedCount = badges.filter((badge) => badge.earned).length;

  const filteredBadges = useMemo(() => {
    if (activeCategory === "All") {
      return badges;
    }

    if (activeCategory === "Earned") {
      return badges.filter((badge) => badge.earned);
    }

    return badges.filter((badge) => badge.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="badges-page">
      <div className="badges-background-grid" />
      <div className="badges-glow badges-glow-one" />
      <div className="badges-glow badges-glow-two" />

      <header className="badges-header">
        <button
          className="badges-back-button"
          onClick={() => navigate("/profile")}
        >
          ← Back to Profile
        </button>

        <div className="badges-brand">
          <div className="badges-brand-icon">🏆</div>

          <div>
            <span>CYBERNINJAS</span>
            <h1>Badges</h1>
          </div>
        </div>

        <div className="badges-progress-mini">
          <span>🏆</span>
          <strong>
            {earnedCount}/{badges.length}
          </strong>
        </div>
      </header>

      <main className="badges-main">
        <motion.section
          className="badges-hero"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="badges-hero-content">
            <span className="badges-kicker">YOUR ACHIEVEMENTS</span>

            <h2>Collect Your Cyber Badges 🏆</h2>

            <p>
              Every badge represents a skill, challenge, or milestone you
              achieved on your CyberNinja journey.
            </p>
          </div>

          <div className="badges-hero-stats">
            <div className="badges-big-stat">
              <strong>{earnedCount}</strong>
              <span>Earned</span>
            </div>

            <div className="badges-stat-divider" />

            <div className="badges-big-stat">
              <strong>{badges.length - earnedCount}</strong>
              <span>Locked</span>
            </div>

            <div className="badges-stat-divider" />

            <div className="badges-big-stat">
              <strong>
                {Math.round((earnedCount / badges.length) * 100)}%
              </strong>
              <span>Complete</span>
            </div>
          </div>
        </motion.section>

        <section className="badges-section">
          <div className="badges-section-heading">
            <div>
              <span className="badges-kicker">BADGE COLLECTION</span>
              <h2>Your Badges</h2>
            </div>

            <span className="badges-count-label">
              {filteredBadges.length} badges
            </span>
          </div>

          <div className="badges-tabs">
            {categories.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? "active" : ""}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="badges-grid">
            {filteredBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                className={`badge-card ${
                  badge.earned ? "earned" : "locked"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.05,
                }}
                whileHover={
                  badge.earned
                    ? {
                        y: -6,
                        scale: 1.015,
                      }
                    : {}
                }
              >
                <div className="badge-card-top">
                  <span className="badge-category">
                    {badge.category}
                  </span>

                  {badge.earned ? (
                    <span className="badge-earned-label">✓ EARNED</span>
                  ) : (
                    <span className="badge-locked-label">🔒 LOCKED</span>
                  )}
                </div>

                <div className="badge-icon-wrapper">
                  <div className="badge-icon-ring" />

                  <span className="badge-icon">
                    {badge.icon}
                  </span>

                  {!badge.earned && (
                    <div className="badge-lock-overlay">
                      <span>🔒</span>
                    </div>
                  )}
                </div>

                <div className="badge-card-info">
                  <h3>{badge.name}</h3>

                  <p>{badge.description}</p>

                  <div className="badge-card-footer">
                    <span>{badge.level}</span>

                    <strong>+{badge.xp} XP</strong>
                  </div>
                </div>

                {badge.earned && (
                  <motion.div
                    className="badge-shine"
                    animate={{
                      x: ["-120%", "120%"],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatDelay: 5,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </section>

        <motion.section
          className="badges-next-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="badges-next-icon">🎯</div>

          <div className="badges-next-content">
            <span className="badges-kicker">NEXT GOAL</span>
            <h2>Keep Going, CyberNinja!</h2>
            <p>
              Complete more challenges and levels to unlock new badges.
            </p>
          </div>

          <button
            className="badges-journey-button"
            onClick={() => navigate("/dashboard")}
          >
            Continue Journey →
          </button>
        </motion.section>
      </main>
    </div>
  );
}