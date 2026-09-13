import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import api from "../services/api";

import ninjaProfile from "../assets/images/ninja-profile.png";

import clickSound from "../assets/sounds/click.mp3";
import hoverSound from "../assets/sounds/hover.mp3";
import successSound from "../assets/sounds/success.mp3";


/* =========================================================
   ICONS
========================================================= */

function BackIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}


function HomeIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}


function JourneyIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="5" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <circle cx="18" cy="7" r="2.5" />
      <path d="M8.5 5h4a5 5 0 015 5v1" />
      <path d="M15.5 19h-4a5 5 0 01-5-5v-1" />
    </svg>
  );
}


function MissionIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3.5V1.8" />
      <path d="M20.5 12H22" />
      <path d="M12 22.2v-1.7" />
      <path d="M2 12h1.7" />
    </svg>
  );
}


function ProfileIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.6 3.2-5.5 7-5.5s6.2 1.9 7 5.5" />
    </svg>
  );
}


function ShopIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 8h16l-1 12H5L4 8z" />
      <path d="M8 8a4 4 0 018 0" />
      <circle cx="9" cy="21" r="1" />
      <circle cx="17" cy="21" r="1" />
    </svg>
  );
}


function EditIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1 1-4z" />
    </svg>
  );
}


/* =========================================================
   PROFILE
========================================================= */

function Profile() {

  const navigate = useNavigate();


  /* =======================================================
     TABS
  ======================================================= */

  const [activeTab, setActiveTab] = useState("overview");


  /* =======================================================
     LOADING / ERROR
  ======================================================= */

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /* =======================================================
     LEVEL INFO
  ======================================================= */

  const [levelInfo, setLevelInfo] = useState({
    title: "Personal Information",
    number: 1
  });


  /* =======================================================
     PLAYER DATA
  ======================================================= */

  const [player, setPlayer] = useState({

    name: "Cyber Ninja",

    username: "ShadowNinja",

    level: 1,

    xp: 0,

    nextLevelXp: 500,

    completedLessons: 0,

    totalLessons: 0,

    completedChallenges: 0,

    totalChallenges: 60,

    badges: 0,

    streak: 0,

    progress: 0

  });


  /* =======================================================
     MOUSE PARTICLES
  ======================================================= */

  const [mouseParticles, setMouseParticles] = useState([]);

  const particleId = useRef(0);

  const lastMouseTime = useRef(0);


  /* =======================================================
     AUDIO
  ======================================================= */

  const clickAudio = useRef(null);

  const hoverAudio = useRef(null);

  const successAudio = useRef(null);


  useEffect(() => {

    clickAudio.current = new Audio(clickSound);

    hoverAudio.current = new Audio(hoverSound);

    successAudio.current = new Audio(successSound);


    clickAudio.current.volume = 0.35;

    hoverAudio.current.volume = 0.18;

    successAudio.current.volume = 0.3;


    return () => {

      clickAudio.current?.pause();

      hoverAudio.current?.pause();

      successAudio.current?.pause();

    };

  }, []);


  /* =======================================================
     SOUND FUNCTIONS
  ======================================================= */

  const playClick = () => {

    if (!clickAudio.current) return;

    clickAudio.current.currentTime = 0;

    clickAudio.current.play().catch(() => {});

  };


  const playHover = () => {

    if (!hoverAudio.current) return;

    hoverAudio.current.currentTime = 0;

    hoverAudio.current.play().catch(() => {});

  };


  const playSuccess = () => {

    if (!successAudio.current) return;

    successAudio.current.currentTime = 0;

    successAudio.current.play().catch(() => {});

  };


  /* =======================================================
     MOUSE PARTICLE EFFECT
  ======================================================= */

  useEffect(() => {

    const handleMouseMove = (event) => {

      const now = Date.now();

      if (now - lastMouseTime.current < 35) {
        return;
      }

      lastMouseTime.current = now;


      const id = particleId.current++;


      const particle = {

        id,

        x: event.clientX,

        y: event.clientY,

        size:
          Math.random() * 5 + 3,

        rotate:
          Math.random() * 180,

        offsetX:
          (Math.random() - 0.5) * 24,

        offsetY:
          (Math.random() - 0.5) * 24

      };


      setMouseParticles((current) => [

        ...current.slice(-18),

        particle

      ]);


      setTimeout(() => {

        setMouseParticles((current) =>
          current.filter(
            (item) => item.id !== id
          )
        );

      }, 700);

    };


    window.addEventListener(
      "mousemove",
      handleMouseMove
    );


    return () => {

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

    };

  }, []);


  /* =======================================================
     LOAD PROFILE DATA
  ======================================================= */

  useEffect(() => {


    async function loadProfile() {


      try {


        setLoading(true);

        setError("");


        /* ============================
           CURRENT USER
        ============================ */

        const userResponse =
          await api.get("/auth/me");


        const user =
          userResponse.data;


        if (!user?.id) {

          throw new Error(
            "User not found"
          );

        }


        /* ============================
           DASHBOARD DATA
        ============================ */

        const dashboardResponse =
          await api.get(
            `/dashboard/${user.id}`
          );


        const data =
          dashboardResponse.data;


        console.log(
          "PROFILE DASHBOARD:",
          data
        );


        /* ============================
           CURRENT LEVEL INFO
        ============================ */

        let currentLevelTitle =
          "Personal Information";


        try {


          const levelsResponse =
            await api.get("/levels/");


          const levels =
            levelsResponse.data;


          const current =
            levels.find(
              (lvl) =>
                lvl.id === data.current_level
            );


          if (current) {


            currentLevelTitle =
              current.title_en;


            setLevelInfo({

              title:
                current.title_en,

              number:
                current.level_number

            });

          }


        }
        catch (levelError) {


          console.log(
            "Levels loading skipped",
            levelError
          );

        }


        /* ============================
           JOURNEY DATA
        ============================ */

        let totalLessons = 0;


        try {


          const journeyResponse =
            await api.get(
              `/journey/${user.id}/${data.current_level}`
            );


          const journey =
            journeyResponse.data;


          journey.units?.forEach(
            (unit) => {

              totalLessons +=
                unit.lessons?.length || 0;

            }
          );


        }
        catch (journeyError) {


          console.log(
            "Journey loading skipped",
            journeyError
          );

        }


        /* ============================
           SET PLAYER
        ============================ */

        setPlayer({

          name:
            data.display_name ||
            data.username ||
            "Cyber Ninja",


          username:
            data.username ||
            "ShadowNinja",


          level:
            data.current_level || 1,


          xp:
            data.xp || 0,


          nextLevelXp:
            500,


          completedLessons:
            data.completed_lessons || 0,


          totalLessons:
            totalLessons,


          completedChallenges:
            0,


          totalChallenges:
            60,


          badges:
            data.badges_count || 0,


          streak:
            data.streak_days || 0,


          progress:
            data.progress_percent || 0

        });


      }
      catch (err) {


        console.error(
          "PROFILE ERROR:",
          err
        );


        if (
          err?.response?.status === 401 ||
          err?.response?.status === 403
        ) {


          localStorage.removeItem(
            "token"
          );


          navigate("/login");


          return;

        }


        setError(

          err?.response?.data?.detail ||

          err.message ||

          "Failed loading profile"

        );


      }
      finally {


        setLoading(false);

      }


    }


    loadProfile();


  }, [navigate]);


  /* =======================================================
     XP
  ======================================================= */

  const xpProgress =
    Math.min(
      100,
      Math.round(
        (
          player.xp /
          player.nextLevelXp
        ) * 100
      )
    );


  /* =======================================================
     LESSON PROGRESS
  ======================================================= */

  const lessonProgress =
    player.totalLessons > 0
      ? Math.min(
          100,
          Math.round(
            (
              player.completedLessons /
              player.totalLessons
            ) * 100
          )
        )
      : 0;


  /* =======================================================
     CHALLENGE PROGRESS
  ======================================================= */

  const challengeProgress =
    player.totalChallenges > 0
      ? Math.min(
          100,
          Math.round(
            (
              player.completedChallenges /
              player.totalChallenges
            ) * 100
          )
        )
      : 0;


  /* =======================================================
     STREAK DAYS
  ======================================================= */

  const streakDays = [

    {
      letter: "M",
      active: player.streak >= 1
    },

    {
      letter: "T",
      active: player.streak >= 2
    },

    {
      letter: "W",
      active: player.streak >= 3
    },

    {
      letter: "T",
      active: player.streak >= 4
    },

    {
      letter: "F",
      active: player.streak >= 5
    },

    {
      letter: "S",
      active: player.streak >= 6
    },

    {
      letter: "S",
      active: player.streak >= 7
    }

  ];


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (

      <div className="profile-page">

        <div className="profile-background-grid" />

        <div className="profile-glow profile-glow-one" />

        <div className="profile-glow profile-glow-two" />


        <div className="dashboard-loading">

          <div className="dashboard-loading-spinner" />

          <h2>
            Loading Profile...
          </h2>

          <p>
            Preparing your ninja data
          </p>

        </div>

      </div>

    );

  }


  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {

    return (

      <div className="profile-page">

        <div className="profile-background-grid" />


        <div className="profile-error">

          <h2>
            ⚠️ Profile Error
          </h2>


          <p>
            {error}
          </p>


          <button
            onClick={() => {
              playClick();
              window.location.reload();
            }}
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }


  /* =======================================================
     MAIN
  ======================================================= */

  return (

    <div className="profile-page">


      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="profile-background-grid" />

      <div className="profile-glow profile-glow-one" />

      <div className="profile-glow profile-glow-two" />


      {/* =====================================================
          ORANGE MOUSE PARTICLES
      ====================================================== */}

      <div
        className="profile-mouse-particles"
        aria-hidden="true"
      >

        <AnimatePresence>

          {mouseParticles.map((particle) => (

            <motion.span

              key={particle.id}

              className="profile-mouse-particle"

              style={{

                left: particle.x,

                top: particle.y,

                width: particle.size,

                height: particle.size

              }}

              initial={{

                opacity: 0,

                scale: 0,

                x: 0,

                y: 0,

                rotate: 0

              }}

              animate={{

                opacity: [0, 1, 0],

                scale: [0.4, 1.4, 0],

                x: particle.offsetX,

                y: particle.offsetY - 22,

                rotate: particle.rotate

              }}

              exit={{

                opacity: 0

              }}

              transition={{

                duration: 0.7,

                ease: "easeOut"

              }}

            />

          ))}

        </AnimatePresence>

      </div>


      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="profile-header">

        <div className="profile-header-inner">


          {/* BACK */}

          <motion.button

            className="profile-back-button"

            onClick={() => {

              playClick();

              navigate("/dashboard");

            }}

            onMouseEnter={playHover}

            whileTap={{
              scale: 0.95
            }}

          >

            <BackIcon />

            <span>
              Dashboard
            </span>

          </motion.button>


          {/* BRAND */}

          <Link
            to="/"
            className="profile-brand"
            onClick={playClick}
            onMouseEnter={playHover}
          >

            <span className="profile-brand-icon">
              🥷
            </span>

            CYBER

            <strong>
              NINJAS
            </strong>

          </Link>


          {/* HEADER ACTIONS */}

          <div className="profile-header-actions">


            <Link

              to="/missions"

              className="profile-header-link"

              onClick={playClick}

              onMouseEnter={playHover}

            >
              🎯 Missions
            </Link>


            <Link

              to="/shop"

              className="profile-header-link"

              onClick={playClick}

              onMouseEnter={playHover}

            >
              🛍️ Shop
            </Link>


          </div>


        </div>

      </header>


      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="profile-main">


        {/* ===================================================
            PROFILE HERO
        ==================================================== */}

        <motion.section

          className="profile-hero"

          initial={{
            opacity: 0,
            y: 25
          }}

          animate={{
            opacity: 1,
            y: 0
          }}

          transition={{
            duration: 0.65,
            ease: "easeOut"
          }}

        >


          {/* AVATAR */}

          <div className="profile-avatar-area">


            <motion.div

              className="profile-avatar-ring"

              animate={{
                rotate: 360
              }}

              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear"
              }}

            />


            <motion.div

              className="profile-avatar"

              animate={{
                y: [0, -7, 0]
              }}

              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}

            >

              <img

                src={ninjaProfile}

                alt="CyberNinja profile"

                className="profile-avatar-image"

              />

            </motion.div>


            {/* LEVEL */}

            <div className="profile-level-badge">

              LVL {player.level}

            </div>


            {/* EDIT */}

            <motion.button

              className="profile-avatar-edit"

              onClick={() => {

                playClick();

                navigate("/profile/avatar");

              }}

              onMouseEnter={playHover}

              whileHover={{
                scale: 1.1,
                rotate: 8
              }}

              whileTap={{
                scale: 0.9
              }}

              aria-label="Customize ninja"

            >

              <EditIcon />

            </motion.button>


          </div>


          {/* PROFILE INFORMATION */}

          <div className="profile-hero-info">


            <span className="profile-kicker">

              CYBERNINJAS PROFILE

            </span>


            <h1>

              {player.name}

            </h1>


            <p className="profile-username">

              @{player.username}

            </p>


            <div className="profile-rank">

              <span className="profile-rank-icon">
                ✦
              </span>

              <span>
                Cyber Rookie
              </span>

            </div>


            {/* XP */}

            <div className="profile-xp-section">


              <div className="profile-xp-top">

                <span>
                  LEVEL {player.level}
                </span>

                <strong>

                  {player.xp}

                  {" / "}

                  {player.nextLevelXp}

                  {" XP"}

                </strong>

              </div>


              <div className="profile-xp-track">


                <motion.div

                  className="profile-xp-fill"

                  initial={{
                    width: 0
                  }}

                  animate={{
                    width: `${xpProgress}%`
                  }}

                  transition={{
                    duration: 1.1,
                    delay: 0.25,
                    ease: "easeOut"
                  }}

                />


              </div>


              <span className="profile-xp-hint">

                {Math.max(
                  0,
                  player.nextLevelXp -
                  player.xp
                )}

                {" XP until next level"}

              </span>


            </div>


          </div>


        </motion.section>


        {/* ===================================================
            STATS
        ==================================================== */}

        <section className="profile-stats">


          {[
            {
              icon: "⚡",
              value: player.xp,
              label: "Total XP"
            },

            {
              icon: "🔥",
              value: player.streak,
              label: "Day Streak"
            },

            {
              icon: "🎓",
              value: player.completedLessons,
              label: "Lessons"
            },

            {
              icon: "🏆",
              value: player.badges,
              label: "Badges"
            }

          ].map((stat, index) => (

            <motion.div

              key={stat.label}

              className="profile-stat-card"

              initial={{
                opacity: 0,
                y: 20
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              transition={{
                delay: 0.15 + index * 0.08
              }}

              whileHover={{
                y: -4
              }}

            >

              <div className="profile-stat-icon">

                {stat.icon}

              </div>


              <strong>

                {stat.value}

              </strong>


              <span>

                {stat.label}

              </span>


            </motion.div>

          ))}


        </section>


        {/* ===================================================
            TABS
        ==================================================== */}

        <div className="profile-tabs">


          <motion.button

            className={
              activeTab === "overview"
                ? "profile-tab active"
                : "profile-tab"
            }

            onClick={() => {

              playClick();

              setActiveTab("overview");

            }}

            onMouseEnter={playHover}

            whileTap={{
              scale: 0.95
            }}

          >

            Overview

          </motion.button>


          <motion.button

            className={
              activeTab === "progress"
                ? "profile-tab active"
                : "profile-tab"
            }

            onClick={() => {

              playClick();

              setActiveTab("progress");

            }}

            onMouseEnter={playHover}

            whileTap={{
              scale: 0.95
            }}

          >

            Progress

          </motion.button>


        </div>


        {/* ===================================================
            OVERVIEW
        ==================================================== */}

        {activeTab === "overview" && (

          <motion.section

            className="profile-content-grid"

            initial={{
              opacity: 0,
              y: 20
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            transition={{
              duration: 0.5
            }}

          >


            {/* ===============================================
                LEARNING PROGRESS
            ================================================ */}

            <div className="profile-panel">


              <div className="profile-panel-header">


                <div>

                  <span className="profile-panel-kicker">
                    TRAINING
                  </span>

                  <h2>
                    Learning Progress
                  </h2>

                </div>


                <span className="profile-panel-icon">
                  📚
                </span>


              </div>


              {/* LESSONS */}

              <div className="profile-progress-item">


                <div className="profile-progress-label">

                  <span>
                    Lessons completed
                  </span>

                  <strong>

                    {player.completedLessons}

                    {" / "}

                    {player.totalLessons}

                  </strong>

                </div>


                <div className="profile-small-track">

                  <motion.div

                    className="profile-small-fill"

                    initial={{
                      width: 0
                    }}

                    animate={{
                      width: `${lessonProgress}%`
                    }}

                    transition={{
                      duration: 0.9
                    }}

                  />

                </div>


              </div>


              {/* CHALLENGES */}

              <div className="profile-progress-item">


                <div className="profile-progress-label">

                  <span>
                    Challenges completed
                  </span>

                  <strong>

                    {player.completedChallenges}

                    {" / "}

                    {player.totalChallenges}

                  </strong>

                </div>


                <div className="profile-small-track">

                  <motion.div

                    className="profile-small-fill"

                    initial={{
                      width: 0
                    }}

                    animate={{
                      width: `${challengeProgress}%`
                    }}

                    transition={{
                      duration: 0.9,
                      delay: 0.1
                    }}

                  />

                </div>


              </div>


            </div>


            {/* ===============================================
                QUICK ACTIONS
            ================================================ */}

            <div className="profile-panel">


              <div className="profile-panel-header">


                <div>

                  <span className="profile-panel-kicker">
                    EXPLORE
                  </span>

                  <h2>
                    Quick Actions
                  </h2>

                </div>


                <span className="profile-panel-icon">
                  🚀
                </span>


              </div>


              <div className="profile-actions">


                <Link

                  to="/badges"

                  className="profile-action"

                  onClick={playClick}

                  onMouseEnter={playHover}

                >

                  <span>
                    🏆
                  </span>


                  <div>

                    <strong>
                      My Badges
                    </strong>

                    <small>
                      View your achievements
                    </small>

                  </div>


                  <b>
                    →
                  </b>

                </Link>


                <Link

                  to="/missions"

                  className="profile-action"

                  onClick={playClick}

                  onMouseEnter={playHover}

                >

                  <span>
                    🎯
                  </span>


                  <div>

                    <strong>
                      Daily Missions
                    </strong>

                    <small>
                      Complete missions and earn XP
                    </small>

                  </div>


                  <b>
                    →
                  </b>

                </Link>


                <Link

                  to="/shop"

                  className="profile-action"

                  onClick={playClick}

                  onMouseEnter={playHover}

                >

                  <span>
                    🛍️
                  </span>


                  <div>

                    <strong>
                      Ninja Shop
                    </strong>

                    <small>
                      Customize your ninja
                    </small>

                  </div>


                  <b>
                    →
                  </b>

                </Link>


              </div>


            </div>


          </motion.section>

        )}


        {/* ===================================================
            PROGRESS TAB
        ==================================================== */}

        {activeTab === "progress" && (

          <motion.section

            className="profile-panel profile-full-panel"

            initial={{
              opacity: 0,
              y: 20
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            transition={{
              duration: 0.5
            }}

          >


            <div className="profile-panel-header">


              <div>

                <span className="profile-panel-kicker">

                  YOUR JOURNEY

                </span>


                <h2>

                  Level Progress

                </h2>

              </div>


              <span className="profile-panel-icon">

                🗺️

              </span>


            </div>


            <div className="profile-level-progress">


              <div className="profile-level-progress-top">


                <div>

                  <span>

                    LEVEL{" "}

                    {String(
                      player.level
                    ).padStart(2, "0")}

                  </span>


                  <strong>

                    {levelInfo.title ||
                      "Personal Information"}

                  </strong>

                </div>


                <b>

                  {player.progress}%

                </b>


              </div>


              <div className="profile-large-track">


                <motion.div

                  className="profile-large-fill"

                  initial={{
                    width: 0
                  }}

                  animate={{
                    width:
                      `${Math.min(
                        100,
                        Math.max(
                          0,
                          player.progress
                        )
                      )}%`
                  }}

                  transition={{
                    duration: 1
                  }}

                />


              </div>


              <motion.button

                className="profile-continue-button"

                onClick={() => {

                  playSuccess();

                  navigate(
                    `/level/${player.level}`
                  );

                }}

                onMouseEnter={playHover}

                whileHover={{
                  y: -2,
                  scale: 1.02
                }}

                whileTap={{
                  scale: 0.96
                }}

              >

                Continue Learning →

              </motion.button>


            </div>


          </motion.section>

        )}


        {/* ===================================================
            BOTTOM ACTIONS
        ==================================================== */}

        <div className="profile-bottom-actions">


          <motion.div
            whileHover={{
              y: -2
            }}
          >

            <Link

              to="/profile/avatar"

              className="profile-bottom-button"

              onClick={playClick}

              onMouseEnter={playHover}

            >

              🥷 Customize Ninja

            </Link>

          </motion.div>


          <motion.div
            whileHover={{
              y: -2
            }}
          >

            <Link

              to="/dashboard"

              className="profile-bottom-button secondary"

              onClick={playClick}

              onMouseEnter={playHover}

            >

              ← Back to Dashboard

            </Link>

          </motion.div>


        </div>


      </main>


      {/* =====================================================
          MOBILE BOTTOM NAV
      ====================================================== */}

      <nav className="profile-mobile-nav">


        <Link

          to="/dashboard"

          onClick={playClick}

          onMouseEnter={playHover}

        >

          <HomeIcon />

          <span>
            Dashboard
          </span>

        </Link>


        <Link

          to="/journey"

          onClick={playClick}

          onMouseEnter={playHover}

        >

          <JourneyIcon />

          <span>
            Journey
          </span>

        </Link>


        <Link

          to="/missions"

          onClick={playClick}

          onMouseEnter={playHover}

        >

          <MissionIcon />

          <span>
            Missions
          </span>

        </Link>


        <Link

          to="/profile"

          className="active"

          onClick={playClick}

          onMouseEnter={playHover}

        >

          <ProfileIcon />

          <span>
            Profile
          </span>

        </Link>


        <Link

          to="/shop"

          onClick={playClick}

          onMouseEnter={playHover}

        >

          <ShopIcon />

          <span>
            Shop
          </span>

        </Link>


      </nav>


    </div>

  );

}


export default Profile;