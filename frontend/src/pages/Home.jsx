import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
  useInView,
} from "framer-motion";

import { useNavigate } from "react-router-dom";

/* =========================================================
   IMAGES
========================================================= */

import heroNinja from "../assets/images/hero-ninja.png";
import ninjaAbout from "../assets/images/ninja-about.png";
import bossNinja from "../assets/images/boss-ninja.png";
import readyNinja from "../assets/images/ready-ninja.png";
import readyCharacters from "../assets/images/ready-characters.png";
import cyberBackground from "../assets/images/cyber-background.png";

/* =========================================================
   ICONS
========================================================= */

import logo from "../assets/icons/logo.png";

import engagingIcon from "../assets/icons/engaging.png";
import realSkillsIcon from "../assets/icons/real-skills.png";
import shieldIcon from "../assets/icons/shield.png";

import learnIcon from "../assets/icons/learn-icon.png";
import practiceIcon from "../assets/icons/practice-icon.png";
import earnXpIcon from "../assets/icons/learn-xp-icon.png";
import heroIcon from "../assets/icons/hero-icon.png";

import lessonsIcon from "../assets/icons/lessons-icon.png";
import challengesIcon from "../assets/icons/challenges-icon.png";
import badgesIcon from "../assets/icons/badges-icon.png";
import leaderboardIcon from "../assets/icons/leaderboard-icon.png";
import missionsIcon from "../assets/icons/missions-icon.png";

import kidsIcon from "../assets/icons/kids-icon.png";
import expertIcon from "../assets/icons/expert-icon.png";
import safeIcon from "../assets/icons/safe-icon.png";
import funIcon from "../assets/icons/fun-icon.png";

import phoneIcon from "../assets/icons/phone.png";
import facebookIcon from "../assets/icons/facebook.png";
import instagramIcon from "../assets/icons/instagram.png";
import discordIcon from "../assets/icons/discord.png";
import youtubeIcon from "../assets/icons/youtube.png";

/* =========================================================
   SOUNDS
========================================================= */

import clickSound from "../assets/sounds/click.mp3";
import hoverSound from "../assets/sounds/hover.mp3";
import successSound from "../assets/sounds/success.mp3";
import levelUpSound from "../assets/sounds/level-up.mp3.mp3";

/* =========================================================
   SOUND HELPER
========================================================= */

const playSound = (src, volume = 0.35) => {
  try {
    const audio = new Audio(src);

    audio.volume = volume;
    audio.currentTime = 0;

    audio.play().catch(() => {});
  } catch (error) {
    // Ignore browser audio errors
  }
};

/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 45,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -60,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeRight = {
  hidden: {
    opacity: 0,
    x: 60,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

/* =========================================================
   REUSABLE SECTION WRAPPER
========================================================= */

function AnimatedSection({
  children,
  className = "",
  variant = fadeUp,
  once = true,
  id,
}) {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once,
    amount: 0.12,
  });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      variants={variant}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </motion.section>
  );
}

/* =========================================================
   HOME
========================================================= */

export default function Home() {
  const navigate = useNavigate();



  /* =======================================================
     MOUSE BUBBLES
  ======================================================= */

  const [mouseBubbles, setMouseBubbles] = useState([]);

  const bubbleIdRef = useRef(0);
  const bubbleTimeoutsRef = useRef([]);

  useEffect(() => {
    return () => {
      bubbleTimeoutsRef.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
  }, []);

  const handleMouseMove = (event) => {
    const id = bubbleIdRef.current++;

    const bubble = {
      id,
      x: event.clientX,
      y: event.clientY,
      size: 6 + Math.random() * 12,
      drift:
        Math.random() > 0.5
          ? 1
          : -1,
    };

    setMouseBubbles((current) => {
      const next = [...current, bubble];

      return next.slice(-16);
    });

    const timeout = setTimeout(() => {
      setMouseBubbles((current) =>
        current.filter(
          (item) => item.id !== id
        )
      );
    }, 900);

    bubbleTimeoutsRef.current.push(timeout);
  };

  /* =======================================================
     PRELOAD SOUNDS
  ======================================================= */

  useEffect(() => {
    const sounds = [
      clickSound,
      hoverSound,
      successSound,
      levelUpSound,
    ];

    sounds.forEach((src) => {
      const audio = new Audio(src);

      audio.preload = "auto";
    });
  }, []);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const goTo = (path) => {
    playSound(clickSound, 0.35);

    navigate(path);
  };

  const scrollToSection = (id) => {
    playSound(clickSound, 0.25);

    const element =
      document.getElementById(id);

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleHover = () => {
    playSound(hoverSound, 0.12);
  };

 
  /* =======================================================
     DATA
  ======================================================= */

  const navigationItems = [
    {
      label: "About",
      target: "about",
    },
    {
      label: "How It Works",
      target: "how-it-works",
    },
    {
      label: "Learning Journey",
      target: "journey",
    },
    {
      label: "Awesome Features",
      target: "features",
    },
    {
      label: "Why CyberNinjas",
      target: "why-cyberninjas",
    },
    {
      label: "Ready",
      target: "ready",
    },
  ];

  const journeyLevels = [
    {
      number: "01",
      title: "Personal",
      subtitle: "Information",
      unlocked: true,
      active: true,
    },

    {
      number: "02",
      title: "Password",
      subtitle: "Security",
      unlocked: true,
      active: true,
    },

    {
      number: "03",
      title: "Phishing",
      subtitle: "Awareness",
      unlocked: true,
      active: true,
    },

    {
      number: "04",
      title: "Online",
      subtitle: "Safety",
      unlocked: false,
      active: false,
    },

    {
      number: "05",
      title: "Social",
      subtitle: "Engineering",
      unlocked: false,
      active: false,
    },
  ];

  const howItWorks = [
    {
      number: "1",
      icon: learnIcon,
      title: "Learn",
      description:
        "Explore lessons and watch stories",
      colorClass: "how-learn",
    },

    {
      number: "2",
      icon: practiceIcon,
      title: "Practice",
      description:
        "Complete fun challenges and missions",
      colorClass: "how-practice",
    },

    {
      number: "3",
      icon: earnXpIcon,
      title: "Earn XP",
      description:
        "Gain XP and unlock rewards and level up",
      colorClass: "how-xp",
    },

    {
      number: "4",
      icon: heroIcon,
      title: "Become a Hero",
      description:
        "Defeat bosses, earn badges and top the leaderboard.",
      colorClass: "how-hero",
    },
  ];

  const features = [
    {
      icon: lessonsIcon,
      title: "Interactive Lessons",
      description:
        "Learn with stories, video and animation",
    },

    {
      icon: challengesIcon,
      title: "Challenges & Quizzes",
      description:
        "Test your skills with fun challenges",
    },

    {
      icon: badgesIcon,
      title: "Badges & Rewards",
      description:
        "Earn badges and unlock cool rewards.",
    },

    {
      icon: leaderboardIcon,
      title: "Leaderboards",
      description:
        "Compete with friends and become one",
    },

    {
      icon: missionsIcon,
      title: "Daily Missions",
      description:
        "Complete the missions and earn extra XP",
    },
  ];

  const whyCyberNinjas = [
    {
      icon: kidsIcon,
      title: "Built for Kids",
      description:
        "Age-appropriate content made for young heroes.",
      colorClass: "why-kids",
    },

    {
      icon: expertIcon,
      title: "Expert Approved",
      description:
        "Created with cybersecurity experts and educators.",
      colorClass: "why-expert",
    },

    {
      icon: safeIcon,
      title: "100% Safe",
      description:
        "A safer environment for every learner.",
      colorClass: "why-safe",
    },

    {
      icon: funIcon,
      title: "Fun First",
      description:
        "Learning that feels like playing, not studying.",
      colorClass: "why-fun",
    },
  ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="cyber-home"
      onMouseMove={handleMouseMove}
    >

      {/* =================================================
          REAL PAGE BACKGROUND IMAGE
      ================================================= */}

      <div
        className="cyber-background"
        style={{
          backgroundImage: `url(${cyberBackground})`,
        }}
        aria-hidden="true"
      >
        <div className="cyber-background-overlay" />

        <div className="cyber-grid" />

        <div className="cyber-glow cyber-glow-one" />

        <div className="cyber-glow cyber-glow-two" />

        <div className="cyber-glow cyber-glow-three" />

        <div className="cyber-particle particle-one" />
        <div className="cyber-particle particle-two" />
        <div className="cyber-particle particle-three" />
        <div className="cyber-particle particle-four" />
        <div className="cyber-particle particle-five" />
      </div>

      {/* =================================================
          ORANGE MOUSE BUBBLES
      ================================================= */}

      <div
        className="mouse-bubbles-layer"
        aria-hidden="true"
      >
        {mouseBubbles.map((bubble) => (
          <motion.span
            key={bubble.id}
            className="mouse-bubble"
            initial={{
              opacity: 0,
              scale: 0.35,
              x: bubble.x,
              y: bubble.y,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.35, 1, 0.75],
              x:
                bubble.x +
                bubble.drift * 16,
              y: bubble.y - 34,
            }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}
            style={{
              width: bubble.size,
              height: bubble.size,
            }}
          />
        ))}
      </div>

      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="home-navbar">

        {/* BRAND */}

        <div
          className="home-brand"
          onClick={() =>
            scrollToSection("home")
          }
          onMouseEnter={handleHover}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              scrollToSection("home");
            }
          }}
        >

          <img
            src={logo}
            alt="CyberNinjas Logo"
            className="home-brand-logo"
          />

          <div className="home-brand-text">

            <div className="home-brand-title">
              CYBER
              <span>NINJAS</span>
            </div>

            <div className="home-brand-subtitle">
              BECOME A CYBER HERO
            </div>

          </div>

        </div>

        {/* HOME SECTION NAVIGATION */}

        <nav
          className="home-nav-links"
          aria-label="Home navigation"
        >

          {navigationItems.map(
            (item) => (
              <button
                key={item.target}
                type="button"
                onClick={() =>
                  scrollToSection(
                    item.target
                  )
                }
                onMouseEnter={handleHover}
              >
                {item.label}
              </button>
            )
          )}

        </nav>

        {/* RIGHT NAV */}

        <div className="home-navbar-actions">

         

          {/* LOGIN */}

          <button
            type="button"
            className="navbar-login-button"
            onClick={() =>
              goTo("/login")
            }
            onMouseEnter={handleHover}
          >
            LOG IN
          </button>

        </div>

      </header>

      {/* =================================================
          HERO
      ================================================= */}

      <section
        className="home-hero"
        id="home"
      >

        <div
          className="hero-cyber-lines"
          aria-hidden="true"
        />

        {/* HERO PANEL */}

        <div className="hero-panel">

          <div className="hero-content">

            {/* ===========================================
                HERO TEXT
            =========================================== */}

            <motion.div
              className="hero-text"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >

              <motion.div
                className="hero-small-title"
                variants={fadeUp}
              >
                BECOME A
              </motion.div>

              <motion.h1
                className="hero-main-title"
                variants={fadeUp}
              >
                CYBER HERO
              </motion.h1>

              <motion.p
                className="hero-description"
                variants={fadeUp}
              >
                Join CyberNinjas and learn real
                cybersecurity
                <br className="desktop-break" />
                skills in the most fun way ever!
              </motion.p>

              {/* HERO ACTIONS */}

              <motion.div
                className="hero-actions"
                variants={fadeUp}
              >

                {/* START */}

                <motion.button
                  type="button"
                  className="primary-orange-button hero-start-button"
                  whileHover={{
                    scale: 1.04,
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  onMouseEnter={
                    handleHover
                  }
                  onClick={() => {

                    /*
                      IMPORTANT:
                      This is the requested
                      level-up sound.
                    */

                    playSound(
                      levelUpSound,
                      0.42
                    );

                    navigate(
                      "/dashboard"
                    );
                  }}
                >
                  START YOUR JOURNEY

                  <span className="button-arrow">
                    →
                  </span>
                </motion.button>

                {/* TRAILER */}

                <button
                  type="button"
                  className="watch-trailer-button"
                  onMouseEnter={
                    handleHover
                  }
                  onClick={() =>
                    scrollToSection(
                      "how-it-works"
                    )
                  }
                >

                  <span>
                    WATCH TRAILER
                  </span>

                  <span className="play-circle">
                    ▶
                  </span>

                </button>

              </motion.div>

              {/* HERO STATS */}

              <motion.div
                className="hero-stats"
                variants={fadeUp}
              >

                <div className="hero-stat">

                  <span className="hero-stat-symbol">
                    ♧
                  </span>

                  <div>
                    <strong>
                      10
                    </strong>

                    <small>
                      LEVELS
                    </small>
                  </div>

                </div>

                <div className="hero-stat">

                  <span className="hero-stat-symbol">
                    ✧
                  </span>

                  <div>
                    <strong>
                      600+
                    </strong>

                    <small>
                      CHALLENGES
                    </small>
                  </div>

                </div>

                <div className="hero-stat">

                  <span className="hero-stat-symbol">
                    ♧
                  </span>

                  <div>
                    <strong>
                      40+
                    </strong>

                    <small>
                      BADGES
                    </small>
                  </div>

                </div>

                <div className="hero-stat">

                  <span className="hero-stat-symbol">
                    ✦
                  </span>

                  <div>
                    <strong>
                      ENDLESS
                    </strong>

                    <small>
                      FUN
                    </small>
                  </div>

                </div>

              </motion.div>

            </motion.div>

            {/* ===========================================
                HERO NINJA
            =========================================== */}

            <motion.div
              className="hero-character-area"
              initial={{
                opacity: 0,
                x: 70,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >

              <div className="hero-character-glow" />

              <motion.div
                className="hero-platform-glow"
                animate={{
                  scaleX: [
                    1,
                    1.08,
                    1,
                  ],
                  opacity: [
                    0.55,
                    0.85,
                    0.55,
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="hero-platform"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255,117,0,0.45)",
                    "0 0 55px rgba(255,117,0,0.85)",
                    "0 0 20px rgba(255,117,0,0.45)",
                  ],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                }}
              />

              <motion.img
                src={heroNinja}
                alt="CyberNinjas Hero Ninja"
                className="hero-ninja-image hero-ninja-large"
                animate={{
                  y: [
                    0,
                    -12,
                    0,
                  ],
                  rotate: [
                    0,
                    1,
                    0,
                    -1,
                    0,
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

            </motion.div>

          </div>

        </div>

        <div
          className="hero-bottom-fade"
          aria-hidden="true"
        />

      </section>

      {/* =================================================
          WHAT IS CYBERNINJAS
      ================================================= */}

      <AnimatedSection
        id="about"
        className="home-section about-section"
        variant={fadeUp}
      >

        <div className="section-panel about-panel">

          <div className="about-content">

            {/* LEFT TEXT */}

            <motion.div
              className="about-text"
              variants={fadeLeft}
            >

              <div className="section-mini-heading">
                WHAT IS
              </div>

              <h2 className="section-orange-title">
                CYBERNINJAS?
              </h2>

              <p>
                cyberninjas is an interactive
                learning platform that teaches
                kids the basics of cybersecurity
                through games, stories, challenge
                and missions.
              </p>

            </motion.div>

            {/* CENTER NINJA */}

            <motion.div
              className="about-character about-character-large"
              variants={fadeUp}
            >

              <div className="about-character-glow" />

              <motion.img
                src={ninjaAbout}
                alt="CyberNinjas"
                className="ninja-about-large"
                animate={{
                  y: [
                    0,
                    -7,
                    0,
                  ],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

            </motion.div>

            {/* RIGHT BENEFITS */}

            <motion.div
              className="about-benefits"
              variants={staggerContainer}
            >

              <motion.div
                className="about-benefit benefit-purple"
                variants={fadeRight}
                onMouseEnter={
                  handleHover
                }
              >

                <img
                  src={engagingIcon}
                  alt=""
                />

                <div>

                  <h3>
                    Fun &amp; Engaging
                  </h3>

                  <p>
                    Learn through games and
                    exciting missions.
                  </p>

                </div>

              </motion.div>

              <motion.div
                className="about-benefit benefit-green"
                variants={fadeRight}
                onMouseEnter={
                  handleHover
                }
              >

                <img
                  src={realSkillsIcon}
                  alt=""
                />

                <div>

                  <h3>
                    Build Real Skills
                  </h3>

                  <p>
                    Learn essential cyber
                    security skills for the
                    digital world.
                  </p>

                </div>

              </motion.div>

              <motion.div
                className="about-benefit benefit-blue"
                variants={fadeRight}
                onMouseEnter={
                  handleHover
                }
              >

                <img
                  src={shieldIcon}
                  alt=""
                />

                <div>

                  <h3>
                    Safe &amp; Educational
                  </h3>

                  <p>
                    Designed for kids with
                    expert-approved content.
                  </p>

                </div>

              </motion.div>

            </motion.div>

          </div>

        </div>

      </AnimatedSection>

      {/* =================================================
          HOW IT WORKS
      ================================================= */}

      <AnimatedSection
        id="how-it-works"
        className="home-section how-section"
        variant={fadeUp}
      >

        <div className="section-panel how-panel">

          <div className="section-heading">
            HOW IT{" "}
            <span>
              WORKS
            </span>
          </div>

          <motion.div
            className="how-steps"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.25,
            }}
          >

            {howItWorks.map(
              (step, index) => (
                <React.Fragment
                  key={step.title}
                >

                  <motion.div
                    className={`how-step ${step.colorClass}`}
                    variants={fadeUp}
                    onMouseEnter={
                      handleHover
                    }
                  >

                    <div className="how-step-number">
                      {step.number}
                    </div>

                    <motion.div
                      className="how-icon-wrapper"
                      whileHover={{
                        scale: 1.08,
                        rotate: 2,
                      }}
                    >

                      <img
                        src={step.icon}
                        alt={step.title}
                      />

                    </motion.div>

                    <h3>
                      {step.title}
                    </h3>

                    <p>
                      {step.description}
                    </p>

                  </motion.div>

                  {index <
                    howItWorks.length -
                      1 && (
                    <motion.div
                      className="how-arrow"
                      variants={fadeUp}
                    >
                      <span>
                        →
                      </span>
                    </motion.div>
                  )}

                </React.Fragment>
              )
            )}

          </motion.div>

        </div>

      </AnimatedSection>

      {/* =================================================
          LEARNING JOURNEY
      ================================================= */}

      <AnimatedSection
        id="journey"
        className="home-section journey-section"
        variant={fadeUp}
      >

        <div className="section-panel journey-panel">

          <div className="section-heading">
            YOUR LEARNING{" "}
            <span>
              JOURNEY
            </span>
          </div>

          <div className="journey-road">

            {/* CONNECTING LINE */}

            <div className="journey-line">

              <div className="journey-line-active" />

              <div className="journey-line-dashed" />

            </div>

            {/* LEVELS */}

            <div className="journey-levels">

              {journeyLevels.map(
                (level, index) => (
                  <React.Fragment
                    key={level.number}
                  >

                    <motion.div
                      className={`journey-level ${
                        level.active
                          ? "journey-level-active"
                          : "journey-level-locked"
                      }`}
                      initial={{
                        opacity: 0,
                        y: 25,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.55,
                        delay:
                          index * 0.1,
                      }}
                      viewport={{
                        once: true,
                      }}
                      onMouseEnter={
                        handleHover
                      }
                    >

                      <motion.div
                        className="journey-circle"
                        whileHover={{
                          scale: 1.08,
                          y: -4,
                        }}
                      >

                        <span className="journey-number">
                          {level.number}
                        </span>

                        {!level.unlocked && (
                          <span className="journey-lock">
                            🔒
                          </span>
                        )}

                        {level.number ===
                          "01" && (
                          <span className="journey-star">
                            ★
                          </span>
                        )}

                      </motion.div>

                      <div className="journey-level-name">

                        <strong>
                          {level.title}
                        </strong>

                        <span>
                          {level.subtitle}
                        </span>

                      </div>

                    </motion.div>

                    {index <
                      journeyLevels.length -
                        1 && (
                      <div className="journey-mobile-arrow">
                        →
                      </div>
                    )}

                  </React.Fragment>
                )
              )}

              {/* BOSS */}

              <motion.div
                className="journey-boss"
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.55,
                }}
                viewport={{
                  once: true,
                }}
                onMouseEnter={
                  handleHover
                }
              >

                <motion.div
                  className="boss-image-wrapper"
                  animate={{
                    y: [
                      0,
                      -6,
                      0,
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >

                  <div className="boss-glow" />

                  <img
                    src={bossNinja}
                    alt="CyberNinjas Boss"
                    className="boss-image"
                  />

                </motion.div>

                <div className="boss-title">
                  BOSS
                </div>

                <div className="boss-description">
                  Can you defeat
                  <br />
                  the final boss?
                </div>

              </motion.div>

            </div>

          </div>

          <motion.button
            type="button"
            className="explore-journey-button"
            whileHover={{
              scale: 1.04,
              boxShadow:
                "0 0 28px rgba(35,171,255,0.55)",
            }}
            whileTap={{
              scale: 0.97,
            }}
            onMouseEnter={
              handleHover
            }
            onClick={() =>
              goTo("/dashboard")
            }
          >
            EXPLORE JOURNEY
          </motion.button>

        </div>

      </AnimatedSection>

      {/* =================================================
          AWESOME FEATURES
      ================================================= */}

      <AnimatedSection
        id="features"
        className="home-section features-section"
        variant={fadeUp}
      >

        <div className="section-panel features-panel">

          <div className="section-heading">
            AWESOME{" "}
            <span>
              FEATURES
            </span>
          </div>

          <motion.div
            className="features-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
          >

            {features.map(
              (feature, index) => (
                <motion.div
                  key={feature.title}
                  className={`feature-card feature-card-${
                    index + 1
                  }`}
                  variants={fadeUp}
                  whileHover={{
                    y: -8,
                    scale: 1.025,
                  }}
                  onMouseEnter={
                    handleHover
                  }
                >

                  <div className="feature-icon-wrapper">

                    <img
                      src={feature.icon}
                      alt={feature.title}
                    />

                  </div>

                  <h3>
                    {feature.title}
                  </h3>

                  <p>
                    {feature.description}
                  </p>

                </motion.div>
              )
            )}

          </motion.div>

        </div>

      </AnimatedSection>

      {/* =================================================
          WHY CYBERNINJAS
      ================================================= */}

      <AnimatedSection
        id="why-cyberninjas"
        className="home-section why-section"
        variant={fadeUp}
      >

        <div className="section-panel why-panel">

          <div className="section-heading">
            WHY{" "}
            <span>
              CYBERNINJAS?
            </span>
          </div>

          <motion.div
            className="why-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
          >

            {whyCyberNinjas.map(
              (item) => (
                <motion.div
                  key={item.title}
                  className={`why-item ${item.colorClass}`}
                  variants={fadeUp}
                  whileHover={{
                    y: -5,
                  }}
                  onMouseEnter={
                    handleHover
                  }
                >

                  {/* FIXED ICON AREA */}

                  <div className="why-icon">

                    <img
                      src={item.icon}
                      alt={item.title}
                    />

                  </div>

                  <div className="why-copy">

                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      {item.description}
                    </p>

                  </div>

                </motion.div>
              )
            )}

          </motion.div>

        </div>

      </AnimatedSection>

      {/* =================================================
          READY CTA
      ================================================= */}

      <AnimatedSection
        id="ready"
        className="home-section ready-section"
        variant={fadeUp}
      >

        <div className="ready-panel">

          {/* LEFT NINJA */}

          <div className="ready-character-left">

            <div className="ready-character-glow" />

            <motion.img
              src={readyNinja}
              alt="CyberNinjas Ninja"
              className="ready-ninja-large"
              animate={{
                y: [
                  0,
                  -9,
                  0,
                ],
              }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

          </div>

          {/* CENTER CONTENT */}

          <div className="ready-content">

            <h2>
              READY TO START
              <br />
              YOUR{" "}
              <span>
                JOURNEY?
              </span>
            </h2>

            <p>
              Join thousands of young ninjas
              and start your adventure today!
            </p>

            {/* BUTTON IS NOW INSIDE CENTER */}

            <motion.button
              type="button"
              className="primary-orange-button ready-button"
              whileHover={{
                scale: 1.04,
                y: -3,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onMouseEnter={
                handleHover
              }
              onClick={() => {

                playSound(
                  levelUpSound,
                  0.42
                );

                navigate(
                  "/dashboard"
                );
              }}
            >

              START LEARNING NOW

              <span className="button-arrow">
                →
              </span>

            </motion.button>

          </div>

          {/* RIGHT CHARACTERS */}

          <div className="ready-character-right">

            <motion.img
              src={readyCharacters}
              alt="Young CyberNinjas"
              className="ready-characters-large"
              animate={{
                y: [
                  0,
                  -5,
                  0,
                ],
              }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

          </div>

        </div>

      </AnimatedSection>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="home-footer">

        <div className="footer-main">

          {/* =============================================
              BRAND COLUMN
          ============================================= */}

          <div className="footer-brand-column">

            <div className="footer-brand">

              <img
                src={logo}
                alt="CyberNinjas Logo"
                className="footer-logo footer-logo-large"
              />

              <div>

                <div className="footer-brand-title">
                  CYBER
                  <span>
                    NINJAS
                  </span>
                </div>

                <div className="footer-brand-subtitle">
                  BECOME A CYBER HERO
                </div>

              </div>

            </div>

            <p className="footer-description">
              Empowering kids with cyber security
              skills to build a safer Digital World.
            </p>

            {/* SOCIALS */}

            <div className="footer-socials">

              <a
                href="#phone"
                onClick={(event) => {
                  event.preventDefault();

                  playSound(
                    clickSound,
                    0.2
                  );
                }}
                onMouseEnter={
                  handleHover
                }
                aria-label="Phone"
              >
                <img
                  src={phoneIcon}
                  alt="Phone"
                />
              </a>

              <a
                href="#facebook"
                onClick={(event) => {
                  event.preventDefault();

                  playSound(
                    clickSound,
                    0.2
                  );
                }}
                onMouseEnter={
                  handleHover
                }
                aria-label="Facebook"
              >
                <img
                  src={facebookIcon}
                  alt="Facebook"
                />
              </a>

              <a
                href="#instagram"
                onClick={(event) => {
                  event.preventDefault();

                  playSound(
                    clickSound,
                    0.2
                  );
                }}
                onMouseEnter={
                  handleHover
                }
                aria-label="Instagram"
              >
                <img
                  src={instagramIcon}
                  alt="Instagram"
                />
              </a>

              <a
                href="#discord"
                onClick={(event) => {
                  event.preventDefault();

                  playSound(
                    clickSound,
                    0.2
                  );
                }}
                onMouseEnter={
                  handleHover
                }
                aria-label="Discord"
              >
                <img
                  src={discordIcon}
                  alt="Discord"
                />
              </a>

              <a
                href="#youtube"
                onClick={(event) => {
                  event.preventDefault();

                  playSound(
                    clickSound,
                    0.2
                  );
                }}
                onMouseEnter={
                  handleHover
                }
                aria-label="YouTube"
              >
                <img
                  src={youtubeIcon}
                  alt="YouTube"
                />
              </a>

            </div>

          </div>

          {/* =============================================
              EXPLORE
          ============================================= */}

          <div className="footer-column">

            <h3>
              Explore
            </h3>

            <button
              type="button"
              onClick={() =>
                scrollToSection(
                  "journey"
                )
              }
              onMouseEnter={
                handleHover
              }
            >
              Journey
            </button>

            <button
              type="button"
              onClick={() =>
                goTo("/missions")
              }
              onMouseEnter={
                handleHover
              }
            >
              Missions
            </button>

            <button
              type="button"
              onClick={() =>
                goTo("/badges")
              }
              onMouseEnter={
                handleHover
              }
            >
              Badges
            </button>

            <button
              type="button"
              onClick={() =>
                goTo("/leaderboard")
              }
              onMouseEnter={
                handleHover
              }
            >
              Leaderboard
            </button>

          </div>

          {/* =============================================
              RESOURCES
          ============================================= */}

          <div className="footer-column">

            <h3>
              Resources
            </h3>

            <button
              type="button"
              onMouseEnter={
                handleHover
              }
            >
              For Parents
            </button>

            <button
              type="button"
              onMouseEnter={
                handleHover
              }
            >
              Safety Tips
            </button>

            <button
              type="button"
              onMouseEnter={
                handleHover
              }
            >
              Help Center
            </button>

            <button
              type="button"
              onMouseEnter={
                handleHover
              }
            >
              Privacy &amp; Policy
            </button>

          </div>

          {/* =============================================
              COMPANY
          ============================================= */}

          <div className="footer-column">

            <h3>
              Company
            </h3>

            <button
              type="button"
              onClick={() =>
                scrollToSection(
                  "about"
                )
              }
              onMouseEnter={
                handleHover
              }
            >
              About Us
            </button>

            <button
              type="button"
              onMouseEnter={
                handleHover
              }
            >
              Contact Us
            </button>

            <button
              type="button"
              onMouseEnter={
                handleHover
              }
            >
              Terms of Service
            </button>

          </div>

          {/* =============================================
              NEWSLETTER
          ============================================= */}

          <div className="footer-newsletter">

            <h3>
              Stay Updated!
            </h3>

            <p>
              Get tips, Updates and special
              missions delivered to your inbox.
            </p>

            <form
              className="newsletter-form"
              onSubmit={(event) => {
                event.preventDefault();

                playSound(
                  successSound,
                  0.25
                );
              }}
            >

              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
              />

              <button
                type="submit"
                onMouseEnter={
                  handleHover
                }
                aria-label="Subscribe"
              >
                ✓
              </button>

            </form>

          </div>

        </div>

        {/* COPYRIGHT */}

        <div className="footer-bottom">

          <p>
            Copyright © 2025, CYBERNINJAS.
            All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}