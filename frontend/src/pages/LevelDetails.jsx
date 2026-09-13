import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

import levelNinja from "../assets/images/level-ninja.png";
import bossWow from "../assets/images/boss-wow.png";
import box from "../assets/images/box.png";

import clickSound from "../assets/sounds/click.mp3";
import hoverSound from "../assets/sounds/hover.mp3";
import successSound from "../assets/sounds/success.mp3";

/* =========================================================
   CYBERNINJAS — LEVEL DETAILS
   ========================================================= */

const LevelDetails = () => {
  const navigate = useNavigate();
  const { levelId } = useParams();

  const [hoveredUnit, setHoveredUnit] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [levelData, setLevelData] = useState(null);
  const [journeyData, setJourneyData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const bubbleLayerRef = useRef(null);

  /* =======================================================
     AUDIO
     ======================================================= */

  const playSound = (soundFile, volume = 0.45) => {
    try {
      const audio = new Audio(soundFile);

      audio.volume = volume;
      audio.currentTime = 0;

      audio.play().catch(() => {});
    } catch (error) {
      // Prevent audio errors from breaking the page.
    }
  };

  /* =======================================================
     MOUSE ORANGE BUBBLES
     ======================================================= */

  useEffect(() => {
    const layer = bubbleLayerRef.current;

    if (!layer) return;

    const bubbles = Array.from(
      layer.querySelectorAll(".level-cursor-bubble")
    );

    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;

      bubbles.forEach((bubble, index) => {
        const delayX = (index - 3) * 4;
        const delayY = (index - 3) * 3;

        bubble.style.left = `${clientX + delayX}px`;
        bubble.style.top = `${clientY + delayY}px`;

        bubble.style.opacity = `${0.25 + (index % 3) * 0.12}`;
      });
    };

    const handleMouseLeave = () => {
      bubbles.forEach((bubble) => {
        bubble.style.opacity = "0";
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  /* =======================================================
     FETCH LEVEL DATA
  ======================================================= */

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        setLoading(true);
        setError("");

        /* ===================================================
           CURRENT USER
        =================================================== */

        const userResponse = await api.get("/auth/me");

        const user = userResponse.data;

        if (!user?.id) {
          throw new Error("User information not found.");
        }

        setCurrentUser(user);

        /* ===================================================
           LEVEL ID

           If route is /level/1 use 1.
           Otherwise fallback to user's current level.
        =================================================== */

        const selectedLevelId = Number(
          levelId || user.current_level || 1
        );

        /* ===================================================
           LEVEL DETAILS
        =================================================== */

        const levelResponse = await api.get(
          `/levels/${selectedLevelId}`
        );

        console.log(
          "Level API:",
          levelResponse.data
        );

        setLevelData(levelResponse.data);

        /* ===================================================
           JOURNEY

           This gives us:
           - Units
           - Lessons
           - Challenge counts
           - Completion
           - Progress
        =================================================== */

        const journeyResponse = await api.get(
          `/journey/${user.id}/${selectedLevelId}`
        );

        console.log(
          "Journey API:",
          journeyResponse.data
        );

        setJourneyData(journeyResponse.data);
      } catch (err) {
        console.error(
          "Level Details API Error:",
          err
        );

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
            "Failed to load level details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLevelData();
  }, [levelId, navigate]);

  /* =======================================================
     LEVEL DATA
  ======================================================= */

  const selectedLevelId = Number(
    levelId ||
      currentUser?.current_level ||
      levelData?.id ||
      1
  );

  const levelTitle =
    levelData?.title_en ||
    levelData?.title ||
    levelData?.name_en ||
    levelData?.name ||
    "Personal information";

  const levelDescription =
    levelData?.description_en ||
    levelData?.description ||
    "Learn what personal information is, what is safe to share? How attackers Discover it and how to protect it in the digital world.";

  /* =======================================================
     JOURNEY DATA NORMALIZATION
  ======================================================= */

  const journeyUnits = useMemo(() => {
    if (!journeyData) return [];

    /*
      The current Journey API can return either:
      {
        units: [...]
      }

      or directly:
      [...]
    */

    if (Array.isArray(journeyData)) {
      return journeyData;
    }

    if (Array.isArray(journeyData.units)) {
      return journeyData.units;
    }

    return [];
  }, [journeyData]);

  /* =======================================================
     UNITS
     Keep original visual structure/colors/icons.
     Only replace static data with API data.
  ======================================================= */

  const units = useMemo(() => {
    const defaultUnits = [
      {
        id: 1,
        number: "01",
        title: "Understanding personal information",
        description:
          "Learn what personal information is and the different type of information?",
        color: "purple",
        icon: "🛡️",
      },
      {
        id: 2,
        number: "02",
        title: "safe and unsafe sharing",
        description:
          "learn what is safe to share and how accidental sharing can put you at risk.",
        color: "green",
        icon: "🔐",
      },
      {
        id: 3,
        number: "03",
        title: "How attackers discovered information",
        description:
          "see the ways attackers find information about you online.",
        color: "yellow",
        icon: "👁️",
      },
      {
        id: 4,
        number: "04",
        title: "Protecting personal information",
        description:
          "learn how to protect your information at home, school and online.",
        color: "purple",
        icon: "🛡️",
      },
    ];

    if (!journeyUnits.length) {
      return defaultUnits.map((unit) => ({
        ...unit,
        status: unit.id === 1 ? "completed" : "locked",
        progress: unit.id === 1 ? 100 : 0,
      }));
    }

    return journeyUnits.map((unit, index) => {
      const unitId =
        Number(unit.unit_id) ||
        Number(unit.id) ||
        index + 1;

      const number =
        unit.unit_number ??
        unit.number ??
        index + 1;

      const fallbackUnit =
        defaultUnits[index] ||
        defaultUnits[0];

      const isCompleted =
        unit.is_completed === true ||
        unit.status === "completed";

      const isStarted =
        unit.is_started === true ||
        unit.status === "in_progress";

      let status = "locked";

      if (isCompleted) {
        status = "completed";
      } else if (isStarted) {
        status = "in-progress";
      } else if (
        index === 0 ||
        unitId <=
          Number(currentUser?.current_level || 1)
      ) {
        status = "in-progress";
      }

      return {
        id: unitId,

        number: String(number).padStart(
          2,
          "0"
        ),

        title:
          unit.title_en ||
          unit.title ||
          fallbackUnit.title,

        description:
          unit.description_en ||
          unit.description ||
          fallbackUnit.description,

        color:
          fallbackUnit.color,

        icon:
          fallbackUnit.icon,

        status,

        progress: Number(
          unit.progress_percent ??
            unit.progress ??
            (isCompleted ? 100 : 0)
        ),

        lessons:
          unit.lessons ||
          [],

        lessonsCount:
          Number(
            unit.lessons_count ??
              unit.lesson_count ??
              unit.lessons?.length ??
              0
          ),

        challengesCount:
          Number(
            unit.challenges_count ??
              unit.challenge_count ??
              0
          ),
      };
    });
  }, [journeyUnits, currentUser]);

  /* =======================================================
     CALCULATED LEVEL PROGRESS
  ======================================================= */

  const totalUnits = units.length || 4;

  const completedUnits = units.filter(
    (unit) => unit.status === "completed"
  ).length;

  const totalLessonsFromUnits = units.reduce(
    (total, unit) =>
      total + Number(unit.lessonsCount || 0),
    0
  );

  const totalChallengesFromUnits = units.reduce(
    (total, unit) =>
      total + Number(unit.challengesCount || 0),
    0
  );

  const levelProgress =
    Number(
      levelData?.progress_percent ??
        levelData?.progress ??
        journeyData?.progress_percent ??
        journeyData?.progress ??
        0
    ) || 0;

  const completedChallenges =
    Number(
      levelData?.completed_challenges ??
        journeyData?.completed_challenges ??
        0
    ) || 0;

  const totalChallenges =
    Number(
      levelData?.challenges_count ??
        levelData?.total_challenges ??
        journeyData?.challenges_count ??
        journeyData?.total_challenges ??
        totalChallengesFromUnits ??
        60
    ) || 60;

  const totalLessons =
    Number(
      levelData?.lessons_count ??
        levelData?.total_lessons ??
        journeyData?.lessons_count ??
        journeyData?.total_lessons ??
        totalLessonsFromUnits ??
        12
    ) || 12;

  const totalChallengesDisplay =
    totalChallengesFromUnits > 0
      ? totalChallengesFromUnits
      : totalChallenges;

  const displayedCompletedChallenges =
    completedChallenges > 0
      ? completedChallenges
      : Math.round(
          (levelProgress / 100) *
            totalChallengesDisplay
        );

  /* =======================================================
     USER DATA
  ======================================================= */

  const totalXP = Number(
    currentUser?.xp || 0
  );

  const streakDays = Number(
    currentUser?.streak_days || 0
  );

  const displayName =
    currentUser?.display_name ||
    currentUser?.username ||
    "Ninja";

  const currentLevel = Number(
    currentUser?.current_level || 1
  );

  /* =======================================================
     CLICK
  ======================================================= */

  const handleClick = (callback) => {
    playSound(clickSound, 0.38);

    if (callback) {
      setTimeout(callback, 80);
    }
  };

  /* =======================================================
     HOVER
  ======================================================= */

  const handleHover = (id) => {
    setHoveredUnit(id);
    playSound(hoverSound, 0.16);
  };

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const goDashboard = () => {
    handleClick(() => {
      navigate("/dashboard");
    });
  };

  const goJourney = () => {
    handleClick(() => {
      navigate("/dashboard");
    });
  };

  const goMissions = () => {
    handleClick(() => {
      navigate("/missions");
    });
  };

  const goBadges = () => {
    handleClick(() => {
      navigate("/badges");
    });
  };

  const goLeaderboard = () => {
    handleClick(() => {
      navigate("/leaderboard");
    });
  };

  const goProfile = () => {
    handleClick(() => {
      navigate("/profile");
    });
  };

  const goShop = () => {
    handleClick(() => {
      navigate("/shop");
    });
  };

  const goSettings = () => {
    handleClick(() => {});
  };

  /* =======================================================
     UNIT NAVIGATION
  ======================================================= */

  const openUnit = (unit) => {
    if (unit.status === "locked") {
      playSound(clickSound, 0.22);
      return;
    }

    handleClick(() => {
      playSound(successSound, 0.35);

      navigate(`/unit/${unit.id}`);
    });
  };

  /* =======================================================
     START LEVEL
  ======================================================= */

  const startLevel = () => {
    const firstAvailableUnit =
      units.find(
        (unit) =>
          unit.status !== "locked"
      );

    handleClick(() => {
      navigate(
  `/unit/${
    firstAvailableUnit?.id || 1
  }`
);
    });
  };

  /* =======================================================
     BOSS
  ======================================================= */

  const openBoss = () => {
    handleClick(() => {
      navigate("/boss-challenge");
    });
  };

  /* =======================================================
     MOTION
  ======================================================= */

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 14,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 12,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <div className="level-details-page">
        <div className="level-details-background" />
        <div className="level-details-background-grid" />
        <div className="level-details-overlay" />

        <div className="level-loading">
          <div className="level-loading-spinner"></div>

          <h2>
            Loading Level...
          </h2>

          <p>
            Preparing your cybersecurity adventure
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR STATE
  ======================================================= */

  if (error) {
    return (
      <div className="level-details-page">
        <div className="level-details-background" />
        <div className="level-details-background-grid" />
        <div className="level-details-overlay" />

        <div className="level-error">
          <div className="level-error-icon">
            ⚠️
          </div>

          <h2>
            Something went wrong
          </h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="level-details-page">
      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div className="level-details-background" />
      <div className="level-details-background-grid" />
      <div className="level-details-overlay" />

      {/* ===================================================
          ORANGE CURSOR BUBBLES
      =================================================== */}

      <div
        ref={bubbleLayerRef}
        className="level-cursor-bubbles"
        aria-hidden="true"
      >
        <span className="level-cursor-bubble bubble-1" />
        <span className="level-cursor-bubble bubble-2" />
        <span className="level-cursor-bubble bubble-3" />
        <span className="level-cursor-bubble bubble-4" />
        <span className="level-cursor-bubble bubble-5" />
        <span className="level-cursor-bubble bubble-6" />
        <span className="level-cursor-bubble bubble-7" />
        <span className="level-cursor-bubble bubble-8" />
      </div>

      {/* ===================================================
          APP SHELL
      =================================================== */}

      <div className="level-app-shell">
        {/* =================================================
            LEFT SIDEBAR
        ================================================= */}

        <aside className="level-left-sidebar">
          {/* -----------------------------------------------
              BRAND
          ----------------------------------------------- */}

          <div className="level-sidebar-brand">
            <div className="level-sidebar-logo">
              <img
                src={levelNinja}
                alt="CyberNinjas"
                draggable="false"
              />
            </div>

            <div className="level-sidebar-brand-text">
              <div className="level-sidebar-brand-name">
                <span className="brand-cyber">
                  CYBER
                </span>

                <span className="brand-ninjas">
                  NINJAS
                </span>
              </div>

              <div className="level-sidebar-brand-teach">
                teach
              </div>

              <div className="level-sidebar-brand-tagline">
                BECOME A CYBER HERO
              </div>
            </div>
          </div>

          {/* -----------------------------------------------
              SIDEBAR NAV
          ----------------------------------------------- */}

          <nav className="level-sidebar-navigation">
            <button
              type="button"
              className="level-sidebar-link"
              onClick={goDashboard}
              onMouseEnter={() =>
                playSound(
                  hoverSound,
                  0.1
                )
              }
            >
              <span className="level-sidebar-icon">
                🏠
              </span>

              <span>
                Dashboard
              </span>
            </button>

            <button
              type="button"
              className="level-sidebar-link is-active"
              onClick={goJourney}
              onMouseEnter={() =>
                playSound(
                  hoverSound,
                  0.1
                )
              }
            >
              <span className="level-sidebar-icon">
                ♧
              </span>

              <span>
                Journey
              </span>
            </button>

            <button
              type="button"
              className="level-sidebar-link"
              onClick={goMissions}
              onMouseEnter={() =>
                playSound(
                  hoverSound,
                  0.1
                )
              }
            >
              <span className="level-sidebar-icon">
                ☑
              </span>

              <span>
                Missions
              </span>
            </button>

            <button
              type="button"
              className="level-sidebar-link"
              onClick={goLeaderboard}
              onMouseEnter={() =>
                playSound(
                  hoverSound,
                  0.1
                )
              }
            >
              <span className="level-sidebar-icon">
                🏆
              </span>

              <span>
                Leaderboard
              </span>
            </button>

            <button
              type="button"
              className="level-sidebar-link"
              onClick={goProfile}
              onMouseEnter={() =>
                playSound(
                  hoverSound,
                  0.1
                )
              }
            >
              <span className="level-sidebar-icon">
                👤
              </span>

              <span>
                Profile
              </span>
            </button>

            <button
              type="button"
              className="level-sidebar-link"
              onClick={goShop}
              onMouseEnter={() =>
                playSound(
                  hoverSound,
                  0.1
                )
              }
            >
              <span className="level-sidebar-icon">
                🛒
              </span>

              <span>
                Store
              </span>
            </button>

            <button
              type="button"
              className="level-sidebar-link"
              onClick={goSettings}
              onMouseEnter={() =>
                playSound(
                  hoverSound,
                  0.1
                )
              }
            >
              <span className="level-sidebar-icon">
                ⚙️
              </span>

              <span>
                Settings
              </span>
            </button>
          </nav>

          {/* =================================================
              PREMIUM CARD
          ================================================= */}

          <motion.div
            className="level-premium-card"
            whileHover={{
              y: -3,
              scale: 1.015,
            }}
          >
            <div className="level-premium-image">
              <img
                src={box}
                alt="Premium Reward Box"
                draggable="false"
              />
            </div>

            <h3>
              GET PREMIUM!
            </h3>

            <p>
              Unlock exclusive
              <br />
              rewards & missions
            </p>

            <button
              type="button"
              onClick={() =>
                handleClick(() =>
                  navigate("/shop")
                )
              }
              onMouseEnter={() =>
                playSound(
                  hoverSound,
                  0.14
                )
              }
            >
              UPGRADE
            </button>
          </motion.div>

          {/* =================================================
              INVITE CARD
          ================================================= */}

          <motion.div
            className="level-invite-card"
            whileHover={{
              y: -2,
            }}
          >
            <span className="level-invite-icon">
              🎁
            </span>

            <div className="level-invite-content">
              <strong>
                Invite a
                <br />
                friend
              </strong>

              <span>
                Earn +100 XP →
              </span>
            </div>
          </motion.div>
        </aside>

        {/* =================================================
            RIGHT WORKSPACE
        ================================================= */}

        <div className="level-workspace">
          {/* =================================================
              TOP HEADER — ONLY ONE
          ================================================= */}

          <header className="cyber-top-header">
            {/* ---------------------------------------------
                BRAND
            --------------------------------------------- */}

            <div className="cyber-brand">
              <div className="cyber-logo-circle">
                <img
                  src={levelNinja}
                  alt="CyberNinjas"
                  draggable="false"
                />
              </div>

              <div className="cyber-brand-text">
                <div className="cyber-brand-name">
                  <span className="brand-cyber">
                    CYBER
                  </span>

                  <span className="brand-ninjas">
                    NINJAS
                  </span>
                </div>

                <div className="cyber-brand-subtitle">
                  teach
                </div>

                <div className="cyber-brand-tagline">
                  BECOME A CYBER HERO
                </div>
              </div>
            </div>

            {/* ---------------------------------------------
                TOP NAVIGATION
            --------------------------------------------- */}

            <nav className="cyber-top-nav">
              <button
                type="button"
                className="is-active"
                onClick={goJourney}
                onMouseEnter={() =>
                  playSound(
                    hoverSound,
                    0.1
                  )
                }
              >
                Journey
              </button>

              <button
                type="button"
                onClick={goMissions}
                onMouseEnter={() =>
                  playSound(
                    hoverSound,
                    0.1
                  )
                }
              >
                Missions
              </button>

              <button
                type="button"
                onClick={goBadges}
                onMouseEnter={() =>
                  playSound(
                    hoverSound,
                    0.1
                  )
                }
              >
                Badges
              </button>

              <button
                type="button"
                onClick={goLeaderboard}
                onMouseEnter={() =>
                  playSound(
                    hoverSound,
                    0.1
                  )
                }
              >
                Leaderboard
              </button>
            </nav>

            {/* ---------------------------------------------
                HEADER STATS
            --------------------------------------------- */}

            <div className="cyber-header-stats">
              <div className="header-stat streak-stat">
                <span>🔥</span>

                <strong>
                  {streakDays} DAY STREAK
                </strong>
              </div>

              <div className="header-stat xp-stat">
                <span>⭐</span>

                <strong>
                  {totalXP} XP
                </strong>
              </div>

              <button
                type="button"
                className="header-user"
                onClick={goProfile}
              >
                <div className="header-user-avatar">
                  👤
                </div>

                <div className="header-user-info">
                  <strong>
                    {displayName}
                  </strong>

                  <span>
                    Level {currentLevel}
                  </span>
                </div>
              </button>
            </div>
          </header>

          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <motion.main
            className="level-details-main"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* ---------------------------------------------
                PAGE TITLE
            --------------------------------------------- */}

            <motion.div
              className="level-details-page-title"
              variants={itemVariants}
            >
              LEVEL DETAILS
            </motion.div>

            {/* ---------------------------------------------
                CONTENT GRID
            --------------------------------------------- */}

            <div className="level-page-content">
              <div className="level-details-layout">
                {/* =========================================
                    CENTER
                ========================================= */}

                <div className="level-details-center">
                  {/* =======================================
                      HERO
                  ======================================= */}

                  <motion.section
                    className="level-hero-card"
                    variants={itemVariants}
                  >
                    <div className="level-hero-background" />

                    <div className="level-hero-content">
                      <div className="level-number-badge">
                        <span className="level-number-shield">
                          {String(
                            selectedLevelId
                          ).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="level-hero-text">
                        <div className="level-hero-label">
                          Level{" "}
                          {String(
                            selectedLevelId
                          ).padStart(2, "0")}
                        </div>

                        <h1>
                          {levelTitle}
                        </h1>

                        <p>
                          {levelDescription}
                        </p>
                      </div>
                    </div>

                    {/* NINJA */}

                    <motion.img
                      src={levelNinja}
                      alt="Level Ninja"
                      className="level-hero-ninja"
                      draggable="false"
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    <div className="level-ninja-glow" />

                    {/* PROGRESS */}

                    <div className="level-progress-card">
                      <div className="level-progress-top">
                        <span className="level-progress-star">
                          ⭐
                        </span>

                        <strong>
                          {displayedCompletedChallenges}
                        </strong>

                        <span>
                          /{" "}
                          {totalChallengesDisplay}{" "}
                          challenges completed
                        </span>
                      </div>

                      <div className="level-progress-bar">
                        <div
                          className="level-progress-fill"
                          style={{
                            width: `${Math.min(
                              levelProgress,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </motion.section>

                  {/* =======================================
                      UNITS
                  ======================================= */}

                  <motion.section
                    className="level-units-card"
                    variants={itemVariants}
                  >
                    <div className="level-units-list">
                      {units.map((unit) => {
                        const isLocked =
                          unit.status === "locked";

                        const isCompleted =
                          unit.status ===
                          "completed";

                        return (
                          <motion.button
                            key={unit.id}
                            type="button"
                            className={[
                              "level-unit",
                              `level-unit-${unit.color}`,
                              isLocked
                                ? "is-locked"
                                : "",
                              isCompleted
                                ? "is-completed"
                                : "",
                              hoveredUnit ===
                              unit.id
                                ? "is-hovered"
                                : "",
                            ].join(" ")}
                            onClick={() =>
                              openUnit(unit)
                            }
                            onMouseEnter={() =>
                              handleHover(
                                unit.id
                              )
                            }
                            onMouseLeave={() =>
                              setHoveredUnit(
                                null
                              )
                            }
                            whileHover={
                              isLocked
                                ? {
                                    x: 2,
                                  }
                                : {
                                    x: 5,
                                    scale: 1.01,
                                  }
                            }
                            whileTap={{
                              scale: 0.985,
                            }}
                          >
                            <div className="level-unit-icon">
                              <span>
                                {unit.icon}
                              </span>
                            </div>

                            <div className="level-unit-number">
                              {unit.number}
                            </div>

                            <div className="level-unit-content">
                              <h3>
                                {unit.title}
                              </h3>

                              <p>
                                {unit.description}
                              </p>
                            </div>

                            <div className="level-unit-status">
                              {isCompleted ? (
                                <span className="unit-check">
                                  ✓
                                </span>
                              ) : (
                                <span className="unit-lock">
                                  🔒
                                </span>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.section>

                  {/* =======================================
                      BOTTOM ACTIONS
                  ======================================= */}

                  <motion.div
                    className="level-bottom-actions"
                    variants={itemVariants}
                  >
                    <motion.button
                      type="button"
                      className="level-back-button"
                      onClick={goJourney}
                      whileHover={{
                        x: -3,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                    >
                      <span>←</span>

                      BACK TO JOURNEY
                    </motion.button>

                    <div className="level-tip-card">
                      <div className="level-tip-icon">
                        💡
                      </div>

                      <div className="level-tip-text">
                        <strong>
                          Complete all units and the Boss
                          challenge to
                        </strong>

                        <span>
                          earn your level badge!
                        </span>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      className="level-start-button"
                      onClick={startLevel}
                      whileHover={{
                        scale: 1.04,
                      }}
                      whileTap={{
                        scale: 0.96,
                      }}
                    >
                      START LEVEL{" "}
                      {String(
                        selectedLevelId
                      ).padStart(2, "0")}
                    </motion.button>
                  </motion.div>
                </div>

                {/* =========================================
                    RIGHT SIDEBAR
                ========================================= */}

                <aside className="level-sidebar">
                  {/* =======================================
                      REWARDS
                  ======================================= */}

                  <motion.section
                    className="level-rewards-card"
                    variants={itemVariants}
                  >
                    <h2>
                      LEVEL REWARDS
                    </h2>

                    <div className="level-rewards-items">
                      {/* XP */}

                      <div className="level-reward">
                        <div className="reward-visual reward-xp">
                          💎
                        </div>

                        <span>
                          +{" "}
                          {Number(
                            levelData?.xp_reward ??
                              levelData?.reward_xp ??
                              200
                          )}{" "}
                          XP
                        </span>
                      </div>

                      {/* BOX */}

                      <div className="level-reward">
                        <div className="reward-visual reward-box">
                          <img
                            src={box}
                            alt="Reward Box"
                            draggable="false"
                          />
                        </div>

                        <span>
                          + 1 item
                        </span>
                      </div>
                    </div>

                    <div className="level-reward-details">
                      <div>
                        <span>
                          🌳 Units
                        </span>

                        <strong>
                          {totalUnits}
                        </strong>
                      </div>

                      <div>
                        <span>
                          📚 Lessons
                        </span>

                        <strong>
                          {totalLessons}
                        </strong>
                      </div>

                      <div>
                        <span>
                          ⚪ Challenges
                        </span>

                        <strong>
                          {totalChallengesDisplay}
                        </strong>
                      </div>

                      <div>
                        <span>
                          ⏱️ Estimated Time
                        </span>

                        <strong>
                          {levelData?.estimated_time ||
                            levelData?.estimated_time_hours ||
                            "2-3 hours"}
                        </strong>
                      </div>
                    </div>
                  </motion.section>

                  {/* =======================================
                      NINJA MESSAGE
                  ======================================= */}

                  <motion.section
                    className="level-ninja-message-card"
                    variants={itemVariants}
                  >
                    <div className="level-message-ninja">
                      <img
                        src={levelNinja}
                        alt="Ninja"
                        draggable="false"
                      />
                    </div>

                    <div className="level-message-content">
                      <h3>
                        Great choice Ninja!
                      </h3>

                      <p>
                        You are one step closer to
                        becoming a{" "}
                        <strong>
                          Cyber Guardian!
                        </strong>
                      </p>
                    </div>
                  </motion.section>

                  {/* =======================================
                      BOSS
                  ======================================= */}

                  <motion.section
                    className="level-boss-card"
                    variants={itemVariants}
                  >
                    <h2>
                      BOSS CHALLENGE
                    </h2>

                    <div className="boss-image-container">
                      <div className="boss-image-glow" />

                      <img
                        src={bossWow}
                        alt="Boss Challenge"
                        className="boss-image"
                        draggable="false"
                      />
                    </div>

                    <p>
                      Defeat the boss to complete the level
                      &amp; earn amazing rewards!
                    </p>

                    <motion.button
                      type="button"
                      className="boss-challenge-button"
                      onClick={openBoss}
                      onMouseEnter={() =>
                        playSound(
                          hoverSound,
                          0.18
                        )
                      }
                      whileHover={{
                        scale: 1.035,
                        y: -2,
                      }}
                      whileTap={{
                        scale: 0.96,
                      }}
                    >
                      <span>⚔️</span>

                      VIEW BOSS CHALLENGE
                    </motion.button>
                  </motion.section>
                </aside>
              </div>
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default LevelDetails;