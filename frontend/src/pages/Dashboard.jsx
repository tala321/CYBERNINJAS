import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import api from "../services/api";



/* ============================================================
   IMAGES
============================================================ */

import cyberBackground from "../assets/images/cyber-background.png";
import ninjaDash from "../assets/images/ninja-dash.png";
import apprentice from "../assets/images/apprentice.png";
import goal from "../assets/images/goal.png";
import greenOne from "../assets/images/green-one.png";
import blueGift from "../assets/images/blue-gift.png";
import redGift from "../assets/images/red-gift.png";
import box from "../assets/images/box.png";

/* ============================================================
   SOUNDS
============================================================ */

import hoverSound from "../assets/sounds/hover.mp3";
import clickSound from "../assets/sounds/click.mp3";
import successSound from "../assets/sounds/success.mp3";
import levelUpSound from "../assets/sounds/level-up.mp3.mp3";

/* ============================================================
   LEVELS
   10 levels حسب محتوى المشروع النهائي
============================================================ */

const levels = [
  {
    id: 1,
    number: "01",
    title: "Personal Information",
    subtitle: "PERSONAL INFORMATION",
    color: "orange",
  },
  {
    id: 2,
    number: "02",
    title: "Password Master",
    subtitle: "PASSWORD MASTER",
    color: "cyan",
  },
  {
    id: 3,
    number: "03",
    title: "Link Detective",
    subtitle: "LINK DETECTIVE",
    color: "purple",
  },
  {
    id: 4,
    number: "04",
    title: "Phishing Detective",
    subtitle: "PHISHING DETECTIVE",
    color: "gray",
  },
  {
    id: 5,
    number: "05",
    title: "Social Engineering",
    subtitle: "SOCIAL ENGINEERING",
    color: "gray",
  },
  {
    id: 6,
    number: "06",
    title: "Digital Privacy",
    subtitle: "DIGITAL PRIVACY",
    color: "gray",
  },
  {
    id: 7,
    number: "07",
    title: "Gaming Safety",
    subtitle: "GAMING SAFETY",
    color: "gray",
  },
  {
    id: 8,
    number: "08",
    title: "Social Media Safety",
    subtitle: "SOCIAL MEDIA SAFETY",
    color: "gray",
  },
  {
    id: 9,
    number: "09",
    title: "Device Security",
    subtitle: "DEVICE SECURITY",
    color: "gray",
  },
  {
    id: 10,
    number: "10",
    title: "Digital Critical Thinking",
    subtitle: "DIGITAL CRITICAL THINKING",
    color: "gray",
  },
];

/* ============================================================
   DAILY MISSIONS
============================================================ */

const missions = [
  {
    id: 1,
    title: "Complete 3 challenges",
    progress: 2,
    total: 3,
    reward: "+50 XP",
  },
  {
    id: 2,
    title: "Earn 100 XP",
    progress: 100,
    total: 100,
    reward: "+30 XP",
  },
  {
    id: 3,
    title: "Study 1 Lesson",
    progress: 1,
    total: 1,
    reward: "+20 XP",
  },
];

/* ============================================================
   SMALL ICONS
============================================================ */

function SidebarIcon({ type }) {
  const commonProps = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (type) {
    case "dashboard":
      return (
        <svg {...commonProps}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9 21v-6h6v6" />
        </svg>
      );

    case "journey":
      return (
        <svg {...commonProps}>
          <circle cx="5" cy="18" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="6" r="2" />
          <path d="m7 17 3.2-3.4M13.8 10.4 17 7.8" />
        </svg>
      );

    case "missions":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
      );

    case "leaderboard":
      return (
        <svg {...commonProps}>
          <path d="M6 20h12" />
          <path d="M9 20v-5h6v5" />
          <path d="M7 15h10V4H7z" />
          <path d="M9 7h6M9 10h4" />
        </svg>
      );

    case "profile":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c1.2-3.2 3.6-5 7-5s5.8 1.8 7 5" />
        </svg>
      );

    case "store":
      return (
        <svg {...commonProps}>
          <path d="M4 9h16l-1 11H5L4 9Z" />
          <path d="M8 9a4 4 0 0 1 8 0" />
        </svg>
      );

    case "settings":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-2.6v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6v-2.6h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3h2.6v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v2.6h-.1a1.7 1.7 0 0 0-1.6 1Z" />
        </svg>
      );

    case "bell":
      return (
        <svg {...commonProps}>
          <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 8h18c0-1-3-1-3-8" />
          <path d="M10 21h4" />
        </svg>
      );

    default:
      return null;
  }
}

/* ============================================================
   DASHBOARD
============================================================ */

function Dashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ==========================================================
     CURSOR SPARKS
  ========================================================== */

  const [sparks, setSparks] = useState([]);

  const lastSparkTime = useRef(0);

  /* ==========================================================
     SOUNDS
  ========================================================== */

  const playSound = (file, volume = 0.25) => {
    try {
      const sound = new Audio(file);
      sound.volume = volume;
      sound.currentTime = 0;

      sound.play().catch(() => {});
    } catch {
      // الصوت لا يؤثر على عمل الصفحة إذا تعذر تشغيله.
    }
  };

  const playHover = () => {
    playSound(hoverSound, 0.08);
  };

  const playClick = () => {
    playSound(clickSound, 0.18);
  };

  /* ==========================================================
     CURSOR EFFECT
  ========================================================== */

  const handleMouseMove = (event) => {
    const now = Date.now();

    if (now - lastSparkTime.current < 55) {
      return;
    }

    lastSparkTime.current = now;

    const spark = {
      id: `${now}-${Math.random()}`,
      x: event.clientX,
      y: event.clientY,
    };

    setSparks((current) => [...current.slice(-10), spark]);

    setTimeout(() => {
      setSparks((current) =>
        current.filter((item) => item.id !== spark.id)
      );
    }, 500);
  };

  /* ==========================================================
     GET DASHBOARD DATA
     نفس الربط الأساسي الموجود عندك
  ========================================================== */

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const currentUserResponse = await api.get("/auth/me");

        const currentUser = currentUserResponse.data;

        console.log("Current User:", currentUser);

        if (!currentUser?.id) {
          throw new Error("User information not found.");
        }

        const response = await api.get(
          `/dashboard/${currentUser.id}`
        );

        console.log("Dashboard API:", response.data);

        setDashboardData(response.data);
      } catch (err) {
        console.error("Dashboard API Error:", err);

        if (
          err?.response?.status === 401 ||
          err?.response?.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
          return;
        }

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.detail ||
            err?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  /* ==========================================================
     FALLBACK
  ========================================================== */

  const user = dashboardData || {
    user_id: 1,
    username: "ninja03",
    display_name: "Ninja",
    avatar_id: 1,
    xp: 750,
    streak_days: 7,
    completed_lessons: 0,
    completed_units: 0,
    completed_levels: 0,
    completed_challenges: 12,
    progress_percent: 20,
    current_level: 3,
    badges_count: 1,
    inventory_count: 0,
    equipped_items_count: 0,
  };

  /* ==========================================================
     VALUES
  ========================================================== */

  const currentLevel = Math.min(
    Math.max(Number(user.current_level || 1), 1),
    10
  );

  const totalXP = Number(user.xp || 0);

  const streakDays = Number(
    user.streak_days || 0
  );

  const badgesCount = Number(
    user.badges_count || 0
  );

  const completedLessons = Number(
    user.completed_lessons || 0
  );

  const progressPercent = Math.min(
    Math.max(Number(user.progress_percent || 0), 0),
    100
  );

  const completedChallenges = Math.min(
    Number(
      user.completed_challenges ??
        Math.round((progressPercent / 100) * 60)
    ),
    60
  );

  /* ==========================================================
     CURRENT LEVEL TITLE
  ========================================================== */

  const currentLevelData =
    levels.find(
      (level) => level.id === currentLevel
    ) || levels[0];

  /* ==========================================================
     LEVEL DATA
  ========================================================== */

  const dashboardLevels = useMemo(() => {
    return levels.map((level) => {
      if (level.id < currentLevel) {
        return {
          ...level,
          status: "Completed",
          progress: 100,
        };
      }

      if (level.id === currentLevel) {
        return {
          ...level,
          status: "In Progress",
          progress: progressPercent,
        };
      }

      return {
        ...level,
        status: "Locked",
        progress: 0,
      };
    });
  }, [currentLevel, progressPercent]);

  /* ==========================================================
     JOURNEY LEVELS SHOWN IN SCREENSHOT
     01 02 03 04 05 ........ 10
  ========================================================== */

  const journeyLevels = [
    ...dashboardLevels.slice(0, 5),
    dashboardLevels[9],
  ].filter(Boolean);

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-bg">
          <img
            src={cyberBackground}
            alt=""
            className="dashboard-bg-image"
          />
        </div>

        <div className="dashboard-loading">
          <div className="dashboard-loading-spinner"></div>

          <h2>
            Loading your Ninja Dashboard...
          </h2>

          <p>
            Preparing your cybersecurity adventure
          </p>
        </div>
      </div>
    );
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-bg">
          <img
            src={cyberBackground}
            alt=""
            className="dashboard-bg-image"
          />
        </div>

        <div className="dashboard-error">

          <div className="dashboard-error-icon">
            ⚠
          </div>

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            className="dashboard-retry-btn"
            onClick={() => {
              playClick();
              window.location.reload();
            }}
            onMouseEnter={playHover}
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  /* ==========================================================
     MAIN
  ========================================================== */

  return (
    <div
      className="dashboard-page"
      onMouseMove={handleMouseMove}
    >

      {/* ======================================================
          ORANGE CURSOR SPARKS
      ======================================================= */}

      <div className="cursor-sparks-layer">
        {sparks.map((spark) => (
          <span
            key={spark.id}
            className="cursor-spark"
            style={{
              left: spark.x,
              top: spark.y,
            }}
          />
        ))}
      </div>

      {/* ======================================================
          GLOBAL BACKGROUND
      ======================================================= */}

      <div className="dashboard-bg">

        <img
          src={cyberBackground}
          alt=""
          className="dashboard-bg-image"
        />

        <div className="dashboard-bg-overlay"></div>

        <div className="dashboard-grid"></div>

        <div className="dashboard-orange-particles">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>

      {/* ======================================================
          MAIN APP
      ======================================================= */}

      <div className="dashboard-shell">

        {/* ====================================================
            LEFT SIDEBAR
        ===================================================== */}

        <aside className="dashboard-sidebar">

          {/* LOGO */}

          <Link
            to="/"
            className="sidebar-logo"
            onClick={playClick}
            onMouseEnter={playHover}
          >

            <div className="sidebar-logo-text">
              <strong>
                CYBERNINJAS
              </strong>

              <span>
                teach
              </span>
            </div>

          </Link>

          {/* SIDE NAV */}

          <nav className="sidebar-nav">

            <Link
              to="/dashboard"
              className="sidebar-nav-item active"
              onClick={playClick}
              onMouseEnter={playHover}
            >
              <SidebarIcon type="dashboard" />

              <span>
                Dashboard
              </span>
            </Link>

            <Link
              to="/journey"
              className="sidebar-nav-item"
              onClick={playClick}
              onMouseEnter={playHover}
            >
              <SidebarIcon type="journey" />

              <span>
                Journey
              </span>
            </Link>

            <Link
              to="/missions"
              className="sidebar-nav-item"
              onClick={playClick}
              onMouseEnter={playHover}
            >
              <SidebarIcon type="missions" />

              <span>
                Missions
              </span>
            </Link>

            <Link
              to="/leaderboard"
              className="sidebar-nav-item"
              onClick={playClick}
              onMouseEnter={playHover}
            >
              <SidebarIcon type="leaderboard" />

              <span>
                Leaderboard
              </span>
            </Link>

            <Link
              to="/profile"
              className="sidebar-nav-item"
              onClick={playClick}
              onMouseEnter={playHover}
            >
              <SidebarIcon type="profile" />

              <span>
                Profile
              </span>
            </Link>

            <Link
              to="/shop"
              className="sidebar-nav-item"
              onClick={playClick}
              onMouseEnter={playHover}
            >
              <SidebarIcon type="store" />

              <span>
                Store
              </span>
            </Link>

            <Link
              to="/settings"
              className="sidebar-nav-item"
              onClick={playClick}
              onMouseEnter={playHover}
            >
              <SidebarIcon type="settings" />

              <span>
                Settings
              </span>
            </Link>

          </nav>

          {/* PREMIUM */}

          <motion.div
            className="sidebar-premium"
            whileHover={{ y: -3 }}
          >

            <img
              src={box}
              alt="Premium rewards"
            />

            <strong>
              GET PREMIUM!
            </strong>

            <p>
              Unlock exclusive rewards
              and missions.
            </p>

            <Link
              to="/shop"
              onClick={playClick}
              onMouseEnter={playHover}
            >
              UPGRADE
            </Link>

          </motion.div>

          {/* INVITE */}

          <motion.div
            className="sidebar-invite"
            whileHover={{ y: -2 }}
          >

            <img
              src={redGift}
              alt="Invite a friend"
            />

            <div>
              <strong>
                Invite a friend
              </strong>

              <span>
                Earn +100 XP
              </span>
            </div>

            <button
              type="button"
              onClick={playClick}
              onMouseEnter={playHover}
            >
              →
            </button>

          </motion.div>

        </aside>

        {/* ====================================================
            RIGHT / MAIN CONTENT
        ===================================================== */}

        <main className="dashboard-main">

          {/* ==================================================
              TOP BAR
          =================================================== */}

          <motion.header
            className="dashboard-topbar"
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
          >

            <nav className="topbar-nav">

              <Link
                to="/dashboard"
                className="active"
                onClick={playClick}
                onMouseEnter={playHover}
              >
                Journey
              </Link>

              <Link
                to="/missions"
                onClick={playClick}
                onMouseEnter={playHover}
              >
                Missions
              </Link>

              <Link
                to="/badges"
                onClick={playClick}
                onMouseEnter={playHover}
              >
                Badges
              </Link>

              <Link
                to="/leaderboard"
                onClick={playClick}
                onMouseEnter={playHover}
              >
                Leaderboard
              </Link>

            </nav>

            <div className="topbar-right">

              <div className="topbar-streak">
                🔥{" "}
                <strong>
                  {streakDays || 7}
                </strong>

                <span>
                  DAY STREAK
                </span>
              </div>

              <div className="topbar-xp">
                ⭐

                <strong>
                  {totalXP} XP
                </strong>
              </div>

              <button
                type="button"
                className="topbar-bell"
                onClick={playClick}
                onMouseEnter={playHover}
                aria-label="Notifications"
              >
                <SidebarIcon type="bell" />

                <span>
                  1
                </span>
              </button>

              <Link
                to="/profile"
                className="topbar-user"
                onClick={playClick}
                onMouseEnter={playHover}
              >

                <img
                  src={ninjaDash}
                  alt="Ninja"
                />

                <div>
                  <strong>
                    Ninja
                  </strong>

                  <span>
                    Level {currentLevel}
                  </span>
                </div>

                <b>
                  ▾
                </b>

              </Link>

            </div>

          </motion.header>

          {/* ==================================================
              HERO
          =================================================== */}

          <motion.section
            className="dashboard-main-hero"
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.05,
            }}
          >

            <img
              src={cyberBackground}
              alt=""
              className="main-hero-bg"
            />

            <div className="main-hero-overlay"></div>

            {/* LEFT */}

            <div className="main-hero-left">

              <div className="welcome-text">
                WELCOME BACK,
              </div>

              <h1>
                {user.display_name || "NINJA"}!{" "}
                <span>
                  👋
                </span>
              </h1>

              <p>
                Ready for your next mission?
              </p>

              <div className="current-mission">

                <span className="mission-label">
                  CURRENT MISSION
                </span>

                <h2>
                  Level 01 -
                  {" "}
                  {currentLevelData.title}
                </h2>

                <div className="mission-count">
                  {completedChallenges} / 60
                  {" "}
                  Challenges Completed
                </div>

                <div className="mission-progress">

                  <div>
                    <motion.span
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${progressPercent}%`,
                      }}
                      transition={{
                        duration: 1,
                        delay: 0.5,
                      }}
                    ></motion.span>
                  </div>

                  <strong>
                    {Math.round(progressPercent)}%
                  </strong>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    navigate(
                      `/level/${currentLevel}`
                    );
                  }}
                  onMouseEnter={playHover}
                >
                  CONTINUE MISSION →
                </button>

              </div>

            </div>

            {/* NINJA */}

            <div className="main-hero-ninja">

              <div className="hero-ninja-cyan-ring"></div>

              <div className="hero-ninja-orange-glow"></div>

              <img
                src={ninjaDash}
                alt="CyberNinjas"
              />

            </div>

            {/* RIGHT */}

            <div className="main-hero-right">

              <div className="your-level-card">

                <img
                  src={apprentice}
                  alt="Level"
                />

                <div>
                  <span>
                    YOUR LEVEL
                  </span>

                  <strong>
                    {currentLevel}
                  </strong>

                  <p>
                    Cyber Apprentice
                  </p>
                </div>

              </div>

              <div className="today-goal">

                <span className="today-title">
                  TODAY'S GOAL
                </span>

                <div className="goal-item">

                  <img
                    src={goal}
                    alt=""
                  />

                  <span>
                    Complete 3 challenges
                  </span>

                  <strong>
                    2 / 3
                  </strong>

                </div>

                <div className="goal-item">

                  <span className="goal-round-check">
                    ✓
                  </span>

                  <span>
                    Earn 100 XP
                  </span>

                  <strong className="done">
                    ✓
                  </strong>

                </div>

                <div className="goal-item">

                  <span className="goal-round-check">
                    ✓
                  </span>

                  <span>
                    Study 1 Lesson
                  </span>

                  <strong className="done">
                    ✓
                  </strong>

                </div>

              </div>

            </div>

          </motion.section>

          {/* ==================================================
              JOURNEY
          =================================================== */}

          <motion.section
            className="cyber-journey-section"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
              delay: 0.15,
            }}
          >

            <div className="journey-title">
              YOUR CYBER JOURNEY
            </div>

            <div className="journey-map">

              <div className="journey-line"></div>

              {journeyLevels.map(
                (level, index) => {

                  const completed =
                    level.status ===
                    "Completed";

                  const current =
                    level.id === currentLevel;

                  const locked =
                    level.status ===
                    "Locked";

                  return (
                    <motion.div
                      key={level.id}
                      className={`journey-step ${
                        current
                          ? "current"
                          : ""
                      } ${
                        completed
                          ? "completed"
                          : ""
                      } ${
                        locked
                          ? "locked"
                          : ""
                      }`}
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          0.25 +
                          index * 0.1,
                      }}
                    >

                      {/* LOCK */}

                      {locked && (
                        <span className="level-lock">
                          🔒
                        </span>
                      )}

                      {/* STAR ON LEVEL 01 */}

                      {completed &&
                        level.id === 1 && (
                          <span className="level-star">
                            ★
                          </span>
                        )}

                      {/* NODE */}

                      <button
                        type="button"
                        className={`journey-circle ${
                          level.color
                        }`}
                        disabled={locked}
                        onClick={() => {

                          if (locked) {
                            return;
                          }

                          playClick();

                          if (completed) {
                            playSound(
                              successSound,
                              0.18
                            );
                          }

                          if (current) {
                            playSound(
                              levelUpSound,
                              0.10
                            );
                          }

                          navigate(
                            `/level/${level.id}`
                          );
                        }}
                        onMouseEnter={() => {
                          if (!locked) {
                            playHover();
                          }
                        }}
                      >

                        {completed ? (
                          level.id === 1 ? (
                            "01"
                          ) : (
                            level.number
                          )
                        ) : (
                          level.number
                        )}

                      </button>

                      {/* LABEL */}

                      <div className="journey-step-label">

                        <span className="journey-level-number">
                          {level.number}
                        </span>

                        <strong>
                          {level.subtitle}
                        </strong>

                        {completed && (
                          <small>
                            Completed
                          </small>
                        )}

                        {current && (
                          <small className="current-label">
                            In Progress
                          </small>
                        )}

                      </div>

                    </motion.div>
                  );
                }
              )}

            </div>

            <button
              type="button"
              className="view-all-levels"
              onClick={() => {
                playClick();
                navigate("/journey");
              }}
              onMouseEnter={playHover}
            >
              VIEW ALL LEVELS →
            </button>

          </motion.section>

          {/* ==================================================
              BOTTOM ROW
          =================================================== */}

          <section className="dashboard-bottom-row">

            {/* DAILY MISSION */}

            <motion.article
              className="dashboard-bottom-card daily-card"
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.2,
              }}
            >

              <div className="bottom-card-title">

                <img
                  src={goal}
                  alt=""
                />

                <div>
                  <span>
                    DAILY MISSION
                  </span>

                  <strong>
                    Complete 3 challenges
                  </strong>
                </div>

              </div>

              <div className="daily-bar-row">

                <div className="daily-bar">
                  <span
                    style={{
                      width: "67%",
                    }}
                  ></span>
                </div>

                <strong>
                  2 / 3
                </strong>

              </div>

              <div className="reward-row">

                <span>
                  Reward
                  {" "}
                  <strong>
                    +50 XP
                  </strong>
                </span>

                <img
                  src={blueGift}
                  alt=""
                />

              </div>

            </motion.article>

            {/* STREAK */}

            <motion.article
              className="dashboard-bottom-card streak-card"
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.28,
              }}
            >

              <div className="streak-card-title">

                <span className="streak-fire">
                  🔥
                </span>

                <div>
                  <strong>
                    {streakDays || 7} DAY STREAK
                  </strong>

                  <small>
                    Amazing! Keep it up!
                  </small>
                </div>

              </div>

              <div className="streak-week">

                {[
                  "S",
                  "S",
                  "M",
                  "T",
                  "W",
                  "T",
                  "F",
                ].map((day, index) => (
                  <div
                    key={`${day}-${index}`}
                    className={
                      index <
                      Math.min(
                        streakDays || 7,
                        7
                      )
                        ? "active"
                        : ""
                    }
                  >

                    <span>
                      ✓
                    </span>

                    <small>
                      {day}
                    </small>

                  </div>
                ))}

              </div>

            </motion.article>

            {/* BADGE */}

            <motion.article
              className="dashboard-bottom-card badge-card"
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.36,
              }}
            >

              <div>
                <span>
                  RECENT BADGE
                </span>

                <h3>
                  Lesson Learner
                </h3>

                <p>
                  Completed your first lesson!
                </p>
              </div>

              <img
                src={greenOne}
                alt="Lesson Learner"
              />

            </motion.article>

          </section>

        </main>
      </div>
    </div>
  );
}

export default Dashboard;