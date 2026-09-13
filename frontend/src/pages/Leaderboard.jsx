import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const leaderboardData = [
  {
    rank: 1,
    name: "Shadow Ninja",
    avatar: "🥷",
    level: 5,
    xp: 1280,
    badge: "👑",
  },
  {
    rank: 2,
    name: "Cyber Fox",
    avatar: "🦊",
    level: 4,
    xp: 1040,
    badge: "⚡",
  },
  {
    rank: 3,
    name: "Byte Ninja",
    avatar: "🥷",
    level: 4,
    xp: 920,
    badge: "🔥",
  },
  {
    rank: 4,
    name: "Cyber Kid",
    avatar: "🧑‍💻",
    level: 3,
    xp: 760,
    badge: "🛡️",
  },
  {
    rank: 5,
    name: "Code Ninja",
    avatar: "🥷",
    level: 3,
    xp: 690,
    badge: "⭐",
  },
  {
    rank: 6,
    name: "Pixel Guard",
    avatar: "🤖",
    level: 2,
    xp: 530,
    badge: "🎯",
  },
  {
    rank: 7,
    name: "Cyber Star",
    avatar: "🧑‍🚀",
    level: 2,
    xp: 410,
    badge: "💎",
  },
];

function Leaderboard() {
  const navigate = useNavigate();

  const currentUser = {
    rank: 12,
    name: "Cyber Ninja",
    avatar: "🥷",
    level: 1,
    xp: 140,
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-background">
        <div className="leaderboard-orb leaderboard-orb-one" />
        <div className="leaderboard-orb leaderboard-orb-two" />
        <div className="leaderboard-stars">
          <span>✦</span>
          <span>✧</span>
          <span>✦</span>
          <span>·</span>
          <span>✧</span>
        </div>
      </div>

      <header className="leaderboard-header">
        <button
          className="leaderboard-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <span>←</span>
          <span>Dashboard</span>
        </button>

        <div className="leaderboard-header-title">
          <div className="leaderboard-header-icon">🏆</div>

          <div>
            <span>CYBERNINJAS</span>
            <h1>Leaderboard</h1>
            <small>لوحة المتصدرين</small>
          </div>
        </div>

        <button
          className="leaderboard-profile-button"
          onClick={() => navigate("/profile")}
        >
          <span>🥷</span>
          <span>Profile</span>
        </button>
      </header>

      <main className="leaderboard-content">
        <motion.section
          className="leaderboard-hero"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="leaderboard-hero-copy">
            <div className="leaderboard-kicker">
              <span>⚡</span>
              <span>CYBER CHAMPIONS</span>
            </div>

            <h2>
              Rise through the
              <br />
              <strong>Cyber Ninja ranks.</strong>
            </h2>

            <p>
              Earn XP, complete challenges and climb the leaderboard.
            </p>
          </div>

          <motion.div
            className="leaderboard-trophy"
            animate={{
              y: [0, -10, 0],
              rotate: [-3, 3, -3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🏆
          </motion.div>
        </motion.section>

        <section className="leaderboard-season">
          <div>
            <span className="season-icon">⚡</span>

            <div>
              <strong>Weekly Cyber League</strong>
              <span>Ends in 4 days</span>
            </div>
          </div>

          <div className="season-progress">
            <span>Season Progress</span>
            <div>
              <i />
            </div>
          </div>
        </section>

        <section className="leaderboard-top-three">
          {leaderboardData.slice(0, 3).map((player, index) => {
            const positionClass =
              player.rank === 1
                ? "first"
                : player.rank === 2
                ? "second"
                : "third";

            return (
              <motion.div
                key={player.rank}
                className={`leaderboard-podium-card ${positionClass}`}
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.15 + index * 0.12,
                  duration: 0.45,
                }}
              >
                <div className="podium-rank">
                  {player.rank === 1
                    ? "👑"
                    : player.rank === 2
                    ? "🥈"
                    : "🥉"}
                </div>

                <div className="podium-avatar">
                  {player.avatar}
                </div>

                <h3>{player.name}</h3>

                <span className="podium-level">
                  Level {player.level}
                </span>

                <strong>{player.xp.toLocaleString()} XP</strong>

                <div className="podium-platform">
                  <span>#{player.rank}</span>
                </div>
              </motion.div>
            );
          })}
        </section>

        <section className="leaderboard-list-section">
          <div className="leaderboard-section-title">
            <div>
              <h2>Top Ninjas</h2>
              <p>أفضل النينجا</p>
            </div>

            <span className="leaderboard-season-label">
              This Week
            </span>
          </div>

          <div className="leaderboard-list">
            {leaderboardData.slice(3).map((player, index) => (
              <motion.div
                key={player.rank}
                className="leaderboard-player-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.3 + index * 0.08,
                }}
                whileHover={{
                  x: 4,
                }}
              >
                <div className="player-rank">
                  #{player.rank}
                </div>

                <div className="player-avatar">
                  {player.avatar}
                </div>

                <div className="player-info">
                  <strong>{player.name}</strong>
                  <span>Level {player.level}</span>
                </div>

                <div className="player-badge">
                  {player.badge}
                </div>

                <div className="player-xp">
                  <strong>{player.xp.toLocaleString()}</strong>
                  <span>XP</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.section
          className="leaderboard-your-position"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="your-position-rank">
            <span>Your Rank</span>
            <strong>#{currentUser.rank}</strong>
          </div>

          <div className="your-position-avatar">
            {currentUser.avatar}
          </div>

          <div className="your-position-info">
            <strong>{currentUser.name}</strong>
            <span>
              Level {currentUser.level} • Keep learning!
            </span>
          </div>

          <div className="your-position-xp">
            <strong>{currentUser.xp}</strong>
            <span>XP</span>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
          >
            Climb Higher
            <span>→</span>
          </button>
        </motion.section>

        <section className="leaderboard-tip">
          <span>💡</span>

          <div>
            <strong>How to climb the leaderboard?</strong>
            <p>
              Complete challenges, finish lessons and earn more XP
              to move up the rankings.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Leaderboard;