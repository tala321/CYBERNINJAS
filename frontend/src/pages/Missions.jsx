import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const missionsData = [
  {
    id: 1,
    title: "Complete 3 Challenges",
    titleAr: "أكمل 3 تحديات",
    description: "Finish any three cybersecurity challenges.",
    descriptionAr: "أكمل أي ثلاثة تحديات في رحلتك التعليمية.",
    icon: "🎯",
    reward: 30,
    progress: 2,
    target: 3,
    category: "daily",
    difficulty: "Easy",
    completed: false,
  },
  {
    id: 2,
    title: "Earn 50 XP",
    titleAr: "اجمع 50 XP",
    description: "Earn experience points by completing challenges.",
    descriptionAr: "اجمع نقاط الخبرة من خلال إكمال التحديات.",
    icon: "⚡",
    reward: 25,
    progress: 35,
    target: 50,
    category: "daily",
    difficulty: "Easy",
    completed: false,
  },
  {
    id: 3,
    title: "Finish a Lesson",
    titleAr: "أكمل درسًا",
    description: "Complete one full lesson.",
    descriptionAr: "أكمل درسًا كاملًا من رحلتك التعليمية.",
    icon: "📚",
    reward: 40,
    progress: 1,
    target: 1,
    category: "daily",
    difficulty: "Medium",
    completed: true,
  },
  {
    id: 4,
    title: "Cyber Guardian",
    titleAr: "حارس الإنترنت",
    description: "Complete five cybersecurity challenges.",
    descriptionAr: "أكمل خمسة تحديات في الأمن السيبراني.",
    icon: "🛡️",
    reward: 75,
    progress: 3,
    target: 5,
    category: "weekly",
    difficulty: "Medium",
    completed: false,
  },
  {
    id: 5,
    title: "XP Hunter",
    titleAr: "صياد الـ XP",
    description: "Earn 200 XP this week.",
    descriptionAr: "اجمع 200 نقطة XP خلال هذا الأسبوع.",
    icon: "💎",
    reward: 100,
    progress: 140,
    target: 200,
    category: "weekly",
    difficulty: "Hard",
    completed: false,
  },
  {
    id: 6,
    title: "Perfect Lesson",
    titleAr: "الدرس المثالي",
    description: "Complete a lesson without a mistake.",
    descriptionAr: "أكمل درسًا كاملًا دون ارتكاب أي خطأ.",
    icon: "🌟",
    reward: 90,
    progress: 0,
    target: 1,
    category: "special",
    difficulty: "Hard",
    completed: false,
  },
];

const filters = [
  { id: "all", label: "All", labelAr: "الكل" },
  { id: "daily", label: "Daily", labelAr: "يومية" },
  { id: "weekly", label: "Weekly", labelAr: "أسبوعية" },
  { id: "special", label: "Special", labelAr: "خاصة" },
  { id: "completed", label: "Completed", labelAr: "مكتملة" },
];

function Missions() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");

  const completedCount = missionsData.filter(
    (mission) => mission.completed
  ).length;

  const totalRewards = missionsData
    .filter((mission) => mission.completed)
    .reduce((sum, mission) => sum + mission.reward, 0);

  const filteredMissions = useMemo(() => {
    if (activeFilter === "all") {
      return missionsData;
    }

    if (activeFilter === "completed") {
      return missionsData.filter((mission) => mission.completed);
    }

    return missionsData.filter(
      (mission) => mission.category === activeFilter
    );
  }, [activeFilter]);

  const getProgressPercent = (mission) => {
    if (mission.target <= 0) return 0;

    return Math.min((mission.progress / mission.target) * 100, 100);
  };

  return (
    <div className="missions-page">
      <div className="missions-background">
        <div className="missions-orb missions-orb-one" />
        <div className="missions-orb missions-orb-two" />
        <div className="missions-grid" />
      </div>

      <header className="missions-header">
        <button
          className="missions-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <span>←</span>
          <span>Dashboard</span>
        </button>

        <div className="missions-header-title">
          <span className="missions-title-icon">🎯</span>

          <div>
            <p>CYBERNINJAS</p>
            <h1>Missions</h1>
            <span>المهمات</span>
          </div>
        </div>

        <button
          className="missions-profile-button"
          onClick={() => navigate("/profile")}
        >
          <span className="missions-profile-avatar">🥷</span>
          <span>Profile</span>
        </button>
      </header>

      <main className="missions-content">
        <motion.section
          className="missions-hero"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="missions-hero-text">
            <div className="missions-kicker">
              <span>⚡</span>
              <span>YOUR DAILY OBJECTIVES</span>
            </div>

            <h2>
              Complete missions.
              <br />
              <strong>Become a Cyber Ninja.</strong>
            </h2>

            <p>
              Complete missions to earn XP, rewards and prove your
              cybersecurity skills.
            </p>
          </div>

          <motion.div
            className="missions-hero-ninja"
            animate={{
              y: [0, -8, 0],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🥷
          </motion.div>
        </motion.section>

        <section className="missions-stats">
          <motion.div
            className="missions-stat-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="missions-stat-icon">🎯</div>
            <div>
              <strong>{completedCount}/6</strong>
              <span>Completed</span>
            </div>
          </motion.div>

          <motion.div
            className="missions-stat-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <div className="missions-stat-icon">⚡</div>
            <div>
              <strong>140 XP</strong>
              <span>Current XP</span>
            </div>
          </motion.div>

          <motion.div
            className="missions-stat-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
          >
            <div className="missions-stat-icon">🏆</div>
            <div>
              <strong>{totalRewards}</strong>
              <span>XP Earned</span>
            </div>
          </motion.div>
        </section>

        <section className="missions-toolbar">
          <div>
            <h2>Your Missions</h2>
            <p>مهامك الحالية</p>
          </div>

          <div className="missions-filters">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={
                  activeFilter === filter.id
                    ? "missions-filter active"
                    : "missions-filter"
                }
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        <section className="missions-list">
          {filteredMissions.map((mission, index) => {
            const percent = getProgressPercent(mission);

            return (
              <motion.article
                key={mission.id}
                className={
                  mission.completed
                    ? "mission-card completed"
                    : "mission-card"
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.08 * index,
                  duration: 0.4,
                }}
                whileHover={{
                  y: -4,
                }}
              >
                <div className="mission-card-icon">
                  {mission.icon}
                </div>

                <div className="mission-card-main">
                  <div className="mission-card-heading">
                    <div>
                      <div className="mission-card-title-row">
                        <h3>{mission.title}</h3>

                        {mission.completed && (
                          <span className="mission-completed-badge">
                            ✓ Completed
                          </span>
                        )}
                      </div>

                      <h4>{mission.titleAr}</h4>
                    </div>

                    <span
                      className={`mission-difficulty ${mission.difficulty.toLowerCase()}`}
                    >
                      {mission.difficulty}
                    </span>
                  </div>

                  <p className="mission-description">
                    {mission.description}
                  </p>

                  <p className="mission-description-ar">
                    {mission.descriptionAr}
                  </p>

                  <div className="mission-progress-section">
                    <div className="mission-progress-labels">
                      <span>Progress</span>

                      <strong>
                        {mission.progress}/{mission.target}
                      </strong>
                    </div>

                    <div className="mission-progress-track">
                      <motion.div
                        className="mission-progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{
                          duration: 0.8,
                          delay: 0.15 + index * 0.05,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mission-card-reward">
                  <span className="reward-icon">⚡</span>
                  <strong>+{mission.reward}</strong>
                  <span>XP</span>

                  {mission.completed ? (
                    <button
                      className="mission-action completed-action"
                      disabled
                    >
                      Completed ✓
                    </button>
                  ) : (
                    <button
                      className="mission-action"
                      onClick={() => navigate("/dashboard")}
                    >
                      Start Mission
                      <span>→</span>
                    </button>
                  )}
                </div>
              </motion.article>
            );
          })}
        </section>

        {filteredMissions.length === 0 && (
          <div className="missions-empty">
            <span>🥷</span>
            <h3>No missions here yet</h3>
            <p>جرّب فلترًا آخر وشوف مهماتك.</p>
          </div>
        )}

        <motion.section
          className="missions-bottom-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div>
            <span className="missions-cta-icon">🚀</span>

            <div>
              <h3>Ready for your next challenge?</h3>
              <p>Continue your cybersecurity journey.</p>
            </div>
          </div>

          <button onClick={() => navigate("/dashboard")}>
            Continue Journey
            <span>→</span>
          </button>
        </motion.section>
      </main>
    </div>
  );
}

export default Missions;