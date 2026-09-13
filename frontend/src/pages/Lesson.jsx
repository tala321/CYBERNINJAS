import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../services/api";

// =========================================================
// IMAGES
// =========================================================

import ninjaGo from "../assets/icons/ninja-go.png";
import ninjaLesson from "../assets/icons/ninja-lesson.png";
import messageIcon from "../assets/icons/message.png";
import mapIcon from "../assets/icons/map.png";
import lockIcon from "../assets/icons/lock.png";
import xpIcon from "../assets/icons/xp.png";

// =========================================================
// SOUNDS
// =========================================================

import clickSound from "../assets/sounds/click.mp3";
import hoverSound from "../assets/sounds/hover.mp3";
import successSound from "../assets/sounds/success.mp3";


// =========================================================
// COMPONENT
// =========================================================

function Lesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [challenges, setChallenges] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [hoveredChallenge, setHoveredChallenge] = useState(null);

  const clickAudio = useRef(null);
  const hoverAudio = useRef(null);
  const successAudio = useRef(null);


  // =======================================================
  // AUDIO
  // =======================================================

  useEffect(() => {
    clickAudio.current = new Audio(clickSound);
    hoverAudio.current = new Audio(hoverSound);
    successAudio.current = new Audio(successSound);

    clickAudio.current.volume = 0.35;
    hoverAudio.current.volume = 0.16;
    successAudio.current.volume = 0.4;

    return () => {
      clickAudio.current = null;
      hoverAudio.current = null;
      successAudio.current = null;
    };
  }, []);


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


  // =======================================================
  // FETCH LESSON
  // =======================================================

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError("");

        const userResponse = await api.get("/auth/me");

        const currentUser = userResponse.data;

        if (!currentUser?.id) {
          navigate("/login");
          return;
        }

        const [
          lessonResponse,
          challengesResponse,
        ] = await Promise.all([
          api.get(
            `/lessons/${lessonId}/${currentUser.id}`
          ),

          api.get(
            `/challenges/lesson/${lessonId}`
          ),
        ]);

        console.log(
          "LESSON:",
          lessonResponse.data
        );

        console.log(
          "CHALLENGES:",
          challengesResponse.data
        );

        const lessonData =
          lessonResponse.data;

        const challengeData =
          Array.isArray(
            challengesResponse.data
          )
            ? challengesResponse.data
            : [];

        setLesson(lessonData);
        setChallenges(challengeData);

      } catch (err) {
        console.error(
          "LESSON ERROR:",
          err
        );

        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {
          localStorage.removeItem("token");

          navigate("/login");

          return;
        }

        setError(
          err.response?.data?.detail ||
          err.message ||
          "Server error"
        );

      } finally {
        setLoading(false);
      }
    };


    if (!lessonId) {
      setError("Lesson not found");
      setLoading(false);
      return;
    }

    fetchLesson();

  }, [lessonId, navigate]);


  // =======================================================
  // PROGRESS
  // =======================================================

  const progress = Math.round(
    Number(
      lesson?.progress_percent || 0
    )
  );


  const completedChallenges =
    challenges.filter(
      (challenge) =>
        challenge.is_completed === true
    ).length;


  // =======================================================
  // CHALLENGE OPEN
  // =======================================================

  const openChallenge = (challengeId) => {
    playClick();

    navigate(
      `/challenge/${challengeId}`
    );
  };


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <div className="lesson-page lesson-loading-page">

        <div className="lesson-background-grid" />

        <motion.img
          src={ninjaLesson}
          alt="Cyber Ninja"
          className="lesson-loading-ninja"
          animate={{
            y: [0, -12, 0],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="lesson-loading-text"
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <h2>
            Loading your lesson...
          </h2>

          <p>
            Preparing Lesson {lessonId}
          </p>
        </motion.div>

      </div>
    );
  }


  // =======================================================
  // ERROR
  // =======================================================

  if (error || !lesson) {
    return (
      <div className="lesson-page lesson-error-page">

        <div className="lesson-background-grid" />

        <motion.div
          className="lesson-error-card"
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >

          <div className="lesson-error-icon">
            !
          </div>

          <h2>
            Lesson unavailable
          </h2>

          <p>
            {error}
          </p>

          <button
            className="lesson-error-button"
            onClick={() => {
              playClick();
              navigate("/dashboard");
            }}
          >
            ← Back to Dashboard
          </button>

        </motion.div>

      </div>
    );
  }


  // =======================================================
  // MAIN
  // =======================================================

  return (
    <div className="lesson-page">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="lesson-background-grid" />

      <div className="lesson-orange-glow lesson-orange-glow-one" />
      <div className="lesson-orange-glow lesson-orange-glow-two" />


      {/* =================================================
          TOP HEADER
      ================================================= */}

      <header className="lesson-top-header">

        <div className="lesson-logo-area">

          <Link
            to="/"
            className="lesson-logo"
            onClick={playClick}
          >
            CYBERNINJAS
          </Link>

          <span className="lesson-logo-sub">
            teach
          </span>

        </div>


        <nav className="lesson-top-nav">

          <Link
            to="/dashboard"
            onClick={playClick}
          >
            Journey
          </Link>

          <Link
            to="/dashboard"
            onClick={playClick}
          >
            Missions
          </Link>

          <Link
            to="/dashboard"
            onClick={playClick}
          >
            Badges
          </Link>

          <Link
            to="/dashboard"
            onClick={playClick}
          >
            Leaderboard
          </Link>

        </nav>


        <div className="lesson-header-right">

          <div className="lesson-streak">

            <span>
              🔥
            </span>

            <strong>
              7
            </strong>

            <span>
              DAY STREAK
            </span>

          </div>


          <div className="lesson-xp-badge">

            <span>
              ★
            </span>

            <strong>
              750 XP
            </strong>

          </div>


          <div className="lesson-bell">
            ♟
          </div>


          <div className="lesson-user">

            <div className="lesson-user-avatar">

              <img
                src={ninjaGo}
                alt="Ninja"
              />

            </div>

            <div className="lesson-user-info">

              <strong>
                Ninja
              </strong>

              <span>
                Level 1
              </span>

            </div>

          </div>

        </div>

      </header>


      {/* =================================================
          BODY
      ================================================= */}

      <div className="lesson-layout">


        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="lesson-sidebar">


          <nav className="lesson-sidebar-nav">


            <Link
              to="/dashboard"
              className="lesson-sidebar-item"
              onClick={playClick}
            >

              <span className="lesson-sidebar-icon">
                ⌂
              </span>

              <span>
                Dashboard
              </span>

            </Link>


            <Link
              to="/dashboard"
              className="lesson-sidebar-item"
              onClick={playClick}
            >

              <span className="lesson-sidebar-icon">
                ♧
              </span>

              <span>
                Journey
              </span>

            </Link>


            <Link
              to="/dashboard"
              className="lesson-sidebar-item lesson-sidebar-active"
              onClick={playClick}
            >

              <span className="lesson-sidebar-icon">
                ✓
              </span>

              <span>
                Missions
              </span>

            </Link>


            <Link
              to="/dashboard"
              className="lesson-sidebar-item"
              onClick={playClick}
            >

              <span className="lesson-sidebar-icon">
                ♜
              </span>

              <span>
                Leaderboard
              </span>

            </Link>


            <Link
              to="/profile"
              className="lesson-sidebar-item"
              onClick={playClick}
            >

              <span className="lesson-sidebar-icon">
                ●
              </span>

              <span>
                Profile
              </span>

            </Link>


            <Link
              to="/store"
              className="lesson-sidebar-item"
              onClick={playClick}
            >

              <span className="lesson-sidebar-icon">
                ♢
              </span>

              <span>
                Store
              </span>

            </Link>


            <Link
              to="/settings"
              className="lesson-sidebar-item"
              onClick={playClick}
            >

              <span className="lesson-sidebar-icon">
                ⚙
              </span>

              <span>
                Settings
              </span>

            </Link>


          </nav>


          {/* SIDEBAR NINJA CARD */}

          <div className="lesson-sidebar-ninja-card">

            <div className="lesson-sidebar-ninja-image">

              <img
                src={ninjaGo}
                alt="Cyber Ninja"
              />

            </div>

            <p>
              small steps today
              <br />
              stronger hero
              <br />
              tomorrow ✦
            </p>

          </div>


        </aside>


        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="lesson-content">


          {/* =================================================
              HERO
          ================================================= */}

          <motion.section
            className="lesson-hero"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
            }}
          >


            <div className="lesson-hero-left">


              <span className="lesson-number">
                Lesson {String(
                  lesson.lesson_number || lessonId
                ).padStart(2, "0")}
              </span>


              <h1>
                {lesson.title_en}
              </h1>


              {lesson.description_en && (
                <p className="lesson-hero-description">
                  {lesson.description_en}
                </p>
              )}


              <div className="lesson-what-box">

                <strong>
                  In this lesson, you will
                </strong>

                <div className="lesson-bullet">
                  <span />
                  understand what personal information is.
                </div>

                <div className="lesson-bullet">
                  <span />
                  See real life examples.
                </div>

              </div>


            </div>


            {/* HERO ICONS */}

            <div className="lesson-hero-icons">

              <motion.img
                src={messageIcon}
                alt="Message"
                className="lesson-hero-icon lesson-message-icon"
                animate={{
                  y: [0, -7, 0],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.img
                src={mapIcon}
                alt="Map"
                className="lesson-hero-icon lesson-map-icon"
                animate={{
                  y: [0, 6, 0],
                }}
                transition={{
                  duration: 2.7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              />

              <motion.img
                src={lockIcon}
                alt="Lock"
                className="lesson-hero-icon lesson-lock-icon"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
              />

            </div>


            {/* NINJA */}

            <motion.div
              className="lesson-hero-ninja"
              initial={{
                opacity: 0,
                x: 35,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.2,
              }}
            >

              <motion.img
                src={ninjaLesson}
                alt="Cyber Ninja"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

            </motion.div>


            {/* PROGRESS */}

            <div className="lesson-progress-card">

              <div className="lesson-progress-heading">

                <span>
                  Lesson
                  <br />
                  Progress
                </span>

              </div>


              <div className="lesson-progress-circle">

                <svg
                  viewBox="0 0 100 100"
                >

                  <circle
                    cx="50"
                    cy="50"
                    r="37"
                    className="lesson-progress-circle-bg"
                  />

                  <motion.circle
                    cx="50"
                    cy="50"
                    r="37"
                    className="lesson-progress-circle-fill"
                    initial={{
                      strokeDasharray: "0 232",
                    }}
                    animate={{
                      strokeDasharray:
                        `${(progress / 100) * 232} 232`,
                    }}
                    transition={{
                      duration: 1,
                    }}
                  />

                </svg>

                <span>
                  {progress}%
                </span>

              </div>


              <div className="lesson-progress-count">

                {completedChallenges}
                {" / "}
                {challenges.length}

                <span>
                  challenges
                  <br />
                  completed
                </span>

              </div>


              <div className="lesson-reward">

                <img
                  src={xpIcon}
                  alt="XP"
                />

                <div>

                  <span>
                    XP REWARD
                  </span>

                  <strong>
                    +50 XP
                  </strong>

                </div>

              </div>

            </div>

          </motion.section>


          {/* =================================================
              CHALLENGES
          ================================================= */}

          <motion.section
            className="lesson-challenges-panel"
            initial={{
              opacity: 0,
              y: 25,
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


            <div className="lesson-panel-title">
              Lesson challenge
            </div>


            <div className="lesson-challenge-track">


              {challenges.length === 0 ? (

                <div className="lesson-empty-challenges">

                  <img
                    src={lockIcon}
                    alt="Locked"
                  />

                  <h3>
                    No challenges yet
                  </h3>

                  <p>
                    Challenges for this lesson are being prepared.
                  </p>

                </div>

              ) : (

                challenges.map(
                  (challenge, index) => {

                    const previousChallenge =
                      challenges[index - 1];

                    const isCompleted =
                      challenge.is_completed === true;

                    const isAvailable =
                      !previousChallenge ||
                      previousChallenge.is_completed === true;


                    let status =
                      "locked";

                    if (isCompleted) {
                      status = "completed";
                    } else if (isAvailable) {
                      status = "available";
                    }


                    return (
                      <div
                        key={challenge.id}
                        className={`lesson-challenge-node ${status}`}
                        onMouseEnter={() => {

                          setHoveredChallenge(
                            challenge.id
                          );

                          playHover();

                        }}
                        onMouseLeave={() =>
                          setHoveredChallenge(null)
                        }
                      >


                        <button
                          type="button"
                          className="lesson-challenge-circle"
                          disabled={!isAvailable}
                          onClick={() => {

                            if (
                              !isAvailable
                            ) {
                              return;
                            }

                            if (
                              isCompleted
                            ) {
                              playSuccess();
                            }

                            openChallenge(
                              challenge.id
                            );

                          }}
                        >

                          {isCompleted ? (
                            <span className="challenge-check">
                              ✓
                            </span>
                          ) : (
                            <img
                              src={lockIcon}
                              alt="Lock"
                            />
                          )}

                        </button>


                        <div className="lesson-challenge-label">

                          <strong>
                            challenge {String(
                              index + 1
                            ).padStart(2, "0")}
                          </strong>

                          <span>

                            {isCompleted
                              ? "completed"
                              : isAvailable
                              ? "start challenge"
                              : "complete to unlock"}

                          </span>

                        </div>


                        {hoveredChallenge ===
                          challenge.id &&
                          isAvailable && (
                            <motion.div
                              className="lesson-challenge-tooltip"
                              initial={{
                                opacity: 0,
                                y: 5,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                            >
                              {isCompleted
                                ? "Review challenge"
                                : "Start challenge"}
                            </motion.div>
                          )}

                      </div>
                    );
                  }
                )

              )}

            </div>

          </motion.section>


          {/* =================================================
              BOTTOM ACTIONS
          ================================================= */}

          <div className="lesson-bottom-actions">


            <button
              type="button"
              className="lesson-back-action"
              onClick={() => {

                playClick();

                if (lesson.unit_id) {

                  navigate(
                    `/unit/${lesson.unit_id}`
                  );

                } else {

                  navigate(-1);

                }

              }}
              onMouseEnter={playHover}
            >
              ← BACK TO JOURNEY
            </button>


            {challenges.length > 0 && (
              <button
                type="button"
                className="lesson-continue-action"
                onClick={() => {

                  const firstAvailable =
                    challenges.find(
                      (challenge, index) => {

                        const previous =
                          challenges[index - 1];

                        return (
                          !previous ||
                          previous.is_completed === true
                        );

                      }
                    );

                  if (
                    firstAvailable
                  ) {

                    playClick();

                    navigate(
                      `/challenge/${firstAvailable.id}`
                    );

                  }

                }}
                onMouseEnter={playHover}
              >
                CONTINUE TO LEVEL 02 →
              </button>
            )}

          </div>


        </main>

      </div>


      {/* =================================================
          ORANGE CURSOR PARTICLES
          CSS controls their appearance.
      ================================================= */}

      <CursorParticles />

    </div>
  );
}


// =========================================================
// CURSOR PARTICLES
// =========================================================

function CursorParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    let particleId = 0;
    let lastMove = 0;

    const handleMouseMove = (event) => {

      const now = Date.now();

      if (now - lastMove < 55) {
        return;
      }

      lastMove = now;

      const id = particleId++;

      const particle = {
        id,
        x: event.clientX,
        y: event.clientY,
        size:
          Math.random() * 5 + 3,
        rotation:
          Math.random() * 360,
      };

      setParticles((current) => [
        ...current.slice(-16),
        particle,
      ]);

      setTimeout(() => {

        setParticles((current) =>
          current.filter(
            (item) =>
              item.id !== id
          )
        );

      }, 650);
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


  return (
    <div className="lesson-cursor-particles">

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="lesson-cursor-particle"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            rotate: particle.rotation,
          }}
          initial={{
            opacity: 0,
            scale: 0,
            x: -2,
            y: -2,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.4, 1.2, 0],
            x:
              (Math.random() - 0.5) * 28,
            y:
              (Math.random() - 0.5) * 28,
          }}
          transition={{
            duration: 0.65,
            ease: "easeOut",
          }}
        />
      ))}

    </div>
  );
}


export default Lesson;
