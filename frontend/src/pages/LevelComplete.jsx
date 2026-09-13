import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

/*
============================================================
  ICONS
  Exact filenames from:
  src/assets/icons
============================================================
*/

import accuracyIcon from "../assets/icons/ACCURACY.png";
import coinsIcon from "../assets/icons/coins.png";
import completedIcon from "../assets/icons/Completed.png";
import completeNinja from "../assets/icons/complete-ninja.png";
import guardianIcon from "../assets/icons/guardian.png";
import jewelIcon from "../assets/icons/jewel.png";
import keyIcon from "../assets/icons/key.png";
import keepGoingNinja from "../assets/icons/ninja-keep-going.png";
import oneIcon from "../assets/icons/one.png";
import outfitIcon from "../assets/icons/outfit.png";
import timeTakenIcon from "../assets/icons/time-taken.png";
import twoIcon from "../assets/icons/two.png";
import xpIcon from "../assets/icons/xp.png";

/*
============================================================
  SOUNDS
  Only the sounds needed for this page
============================================================
*/

import successSound from "../assets/sounds/success.mp3";
import clickSound from "../assets/sounds/click.mp3";
import hoverSound from "../assets/sounds/hover.mp3";
import levelUpSound from "../assets/sounds/level-up.mp3.mp3";


function LevelComplete() {

  const { levelId } = useParams();

  const navigate = useNavigate();

  /*
  ============================================================
      AUDIO
  ============================================================
  */

  const successAudioRef = useRef(null);
  const clickAudioRef = useRef(null);
  const hoverAudioRef = useRef(null);
  const levelUpAudioRef = useRef(null);


  /*
  ============================================================
      MOUSE PARTICLES
  ============================================================
  */

  const [mouseParticles, setMouseParticles] = useState([]);


  /*
  ============================================================
      LEVEL DATA
  ============================================================
  */

  const currentLevel =
    Number(levelId) || 1;

  const nextLevel =
    currentLevel + 1;

  const currentLevelFormatted =
    String(currentLevel).padStart(2, "0");

  const nextLevelFormatted =
    String(nextLevel).padStart(2, "0");


  /*
  ============================================================
      SOUND HELPERS
  ============================================================
  */

  const playSound = (audioRef, volume = 0.45) => {

    if (!audioRef.current) {
      return;
    }

    try {

      audioRef.current.currentTime = 0;
      audioRef.current.volume = volume;

      const playPromise =
        audioRef.current.play();

      if (playPromise?.catch) {
        playPromise.catch(() => {});
      }

    } catch (error) {

      console.log(
        "Sound playback skipped:",
        error
      );

    }

  };


  const handleHoverSound = () => {

    playSound(
      hoverAudioRef,
      0.16
    );

  };


  const handleClickSound = () => {

    playSound(
      clickAudioRef,
      0.30
    );

  };


  /*
  ============================================================
      LEVEL COMPLETE SOUND
  ============================================================
  */

  useEffect(() => {

    const timer =
      setTimeout(() => {

        playSound(
          successAudioRef,
          0.38
        );

      }, 450);


    return () => {
      clearTimeout(timer);
    };

  }, []);


  /*
  ============================================================
      MOUSE ORANGE SPARKS / BUBBLES
  ============================================================
  */

  useEffect(() => {

    let particleId = 0;

    const handleMouseMove = (event) => {

      /*
      Don't create particles for every single
      mouse event. Randomly skip some events.
      */

      if (Math.random() > 0.42) {
        return;
      }


      const id =
        `${Date.now()}-${particleId++}`;


      const particle = {

        id,

        x: event.clientX,

        y: event.clientY,

        size:
          Math.random() * 5 + 3,

        rotation:
          Math.random() * 360,

        type:
          Math.random() > 0.45
            ? "spark"
            : "bubble"

      };


      setMouseParticles((previous) => [

        ...previous.slice(-18),

        particle

      ]);


      setTimeout(() => {

        setMouseParticles((previous) =>

          previous.filter(
            item => item.id !== id
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


  /*
  ============================================================
      BUTTON ACTIONS
  ============================================================
  */

  const handleBossNavigation = () => {

    handleClickSound();

    /*
      Existing route from App.jsx:
      /boss/:levelId
    */

    setTimeout(() => {

      navigate(
        `/boss/${currentLevel}`
      );

    }, 120);

  };


  const handleDashboardNavigation = () => {

    handleClickSound();

    /*
      Existing route from App.jsx:
      /dashboard
    */

    setTimeout(() => {

      navigate("/dashboard");

    }, 120);

  };


  const handleContinueLevel = () => {

    handleClickSound();

    /*
      Level-up sound is appropriate for
      moving to the next level.
    */

    playSound(
      levelUpAudioRef,
      0.35
    );


    setTimeout(() => {

      navigate(
        `/level/${nextLevel}`
      );

    }, 180);

  };


  /*
  ============================================================
      RENDER
  ============================================================
  */

  return (

    <div className="level-complete-page">


      {/* =====================================================
          AUDIO
      ====================================================== */}

      <audio
        ref={successAudioRef}
        src={successSound}
        preload="auto"
      />

      <audio
        ref={clickAudioRef}
        src={clickSound}
        preload="auto"
      />

      <audio
        ref={hoverAudioRef}
        src={hoverSound}
        preload="auto"
      />

      <audio
        ref={levelUpAudioRef}
        src={levelUpSound}
        preload="auto"
      />



      {/* =====================================================
          MOUSE PARTICLES
      ====================================================== */}

      <div className="level-complete-mouse-particles">

        {mouseParticles.map((particle) => (

          <span

            key={particle.id}

            className={
              particle.type === "spark"
                ? "mouse-orange-spark"
                : "mouse-orange-bubble"
            }

            style={{

              left:
                `${particle.x}px`,

              top:
                `${particle.y}px`,

              width:
                `${particle.size}px`,

              height:
                `${particle.size}px`,

              transform:
                `rotate(${particle.rotation}deg)`

            }}

          />

        ))}

      </div>



      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="level-complete-background" />

      <div className="level-complete-grid" />

      <div className="level-complete-glow-one" />

      <div className="level-complete-glow-two" />



      {/* =====================================================
          TOP HEADER
      ====================================================== */}

      <header className="level-complete-header">


        {/* BRAND */}

        <Link
          to="/"
          className="level-complete-brand"
          onMouseEnter={handleHoverSound}
          onClick={handleClickSound}
        >

          <span>
            CYBERNINJAS
          </span>

          <small>
            teach
          </small>

        </Link>



        {/* TOP NAV */}

        <nav className="level-complete-top-nav">

          <Link
            to="/dashboard"
            onMouseEnter={handleHoverSound}
            onClick={handleClickSound}
          >
            Journey
          </Link>

          <Link
            to="/missions"
            onMouseEnter={handleHoverSound}
            onClick={handleClickSound}
          >
            Missions
          </Link>

          <Link
            to="/badges"
            onMouseEnter={handleHoverSound}
            onClick={handleClickSound}
          >
            Badges
          </Link>

          <Link
            to="/leaderboard"
            onMouseEnter={handleHoverSound}
            onClick={handleClickSound}
          >
            Leaderboard
          </Link>

        </nav>



        {/* PLAYER HEADER */}

        <div className="level-complete-player-header">


          <div className="level-complete-streak">

            <span>
              🔥
            </span>

            <strong>
              7
            </strong>

            <small>
              DAY STREAK
            </small>

          </div>



          <div className="level-complete-xp">

            <span>
              ★
            </span>

            <strong>
              750 XP
            </strong>

          </div>



          <div
            className="level-complete-notification"
            onMouseEnter={handleHoverSound}
          >
            🔔
          </div>



          <Link
            to="/profile"
            className="level-complete-user"
            onMouseEnter={handleHoverSound}
            onClick={handleClickSound}
          >

            <div className="level-complete-user-avatar">
              <span />
            </div>

            <div>

              <strong>
                Ninja
              </strong>

              <small>
                Level {currentLevel}
              </small>

            </div>

          </Link>


        </div>


      </header>



      {/* =====================================================
          PAGE LAYOUT
      ====================================================== */}

      <div className="level-complete-layout">


        {/* ===================================================
            LEFT SIDEBAR
        ==================================================== */}

        <aside className="level-complete-sidebar">


          <nav className="level-complete-sidebar-nav">


            {/* DASHBOARD */}

            <Link
              to="/dashboard"
              className="level-sidebar-item"
              onMouseEnter={handleHoverSound}
              onClick={handleClickSound}
            >

              <span className="level-sidebar-icon">
                🏠
              </span>

              <span>
                Dashboard
              </span>

            </Link>



            {/* JOURNEY */}

            <Link
              to="/dashboard"
              className="level-sidebar-item"
              onMouseEnter={handleHoverSound}
              onClick={handleClickSound}
            >

              <span className="level-sidebar-icon">
                ♧
              </span>

              <span>
                Journey
              </span>

            </Link>



            {/* MISSIONS */}

            <Link
              to="/missions"
              className="level-sidebar-item"
              onMouseEnter={handleHoverSound}
              onClick={handleClickSound}
            >

              <span className="level-sidebar-icon">
                🎯
              </span>

              <span>
                Missions
              </span>

            </Link>



            {/* LEADERBOARD */}

            <Link
              to="/leaderboard"
              className="level-sidebar-item"
              onMouseEnter={handleHoverSound}
              onClick={handleClickSound}
            >

              <span className="level-sidebar-icon">
                🏆
              </span>

              <span>
                Leaderboard
              </span>

            </Link>



            {/* PROFILE */}

            <Link
              to="/profile"
              className="level-sidebar-item"
              onMouseEnter={handleHoverSound}
              onClick={handleClickSound}
            >

              <span className="level-sidebar-icon">
                👤
              </span>

              <span>
                Profile
              </span>

            </Link>



            {/* STORE */}

            <Link
              to="/shop"
              className="level-sidebar-item"
              onMouseEnter={handleHoverSound}
              onClick={handleClickSound}
            >

              <span className="level-sidebar-icon">
                🛒
              </span>

              <span>
                Store
              </span>

            </Link>



            {/* SETTINGS */}

            <button
              type="button"
              className="level-sidebar-item"
              onMouseEnter={handleHoverSound}
              onClick={handleClickSound}
            >

              <span className="level-sidebar-icon">
                ⚙
              </span>

              <span>
                Settings
              </span>

            </button>


          </nav>



          {/* =================================================
              KEEP GOING CARD
          ================================================== */}

          <motion.div

            className="level-complete-keep-going"

            initial={{
              opacity: 0,
              y: 15
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            transition={{
              duration: 0.6,
              delay: 0.4
            }}

          >

            <div className="keep-going-image">

              <img
                src={keepGoingNinja}
                alt="Ninja"
              />

            </div>


            <strong>
              Keep going Ninja!
            </strong>


            <p>
              Your next level
              is waiting.
              <br />
              complete a few more
              challenges.
            </p>

          </motion.div>


        </aside>



        {/* ===================================================
            MAIN CONTENT
        ==================================================== */}

        <main className="level-complete-main">


          {/* =================================================
              HERO
          ================================================== */}

          <motion.section

            className="level-complete-hero"

            initial={{
              opacity: 0,
              y: 20
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            transition={{
              duration: 0.65
            }}

          >


            {/* HERO TEXT */}

            <div className="level-complete-hero-content">


              <span className="level-complete-level-label">
                LEVEL {currentLevelFormatted}
              </span>


              <h1>
                COMPLETE!
              </h1>


              <strong>
                Amazing work, Ninja!
              </strong>


              <p>
                you have learned important skills
                <br />
                and passed all challenges
              </p>


            </div>



            {/* KEY */}

            <motion.div

              className="level-complete-key"

              initial={{
                opacity: 0,
                scale: 0.75,
                x: 25
              }}

              animate={{
                opacity: 1,
                scale: 1,
                x: 0
              }}

              transition={{
                duration: 0.7,
                delay: 0.2,
                type: "spring"
              }}

            >

              <img
                src={keyIcon}
                alt="Level Complete"
              />

            </motion.div>



            {/* NINJA */}

            <motion.div

              className="level-complete-hero-ninja"

              initial={{
                opacity: 0,
                x: 50,
                y: 20
              }}

              animate={{
                opacity: 1,
                x: 0,
                y: 0
              }}

              transition={{
                duration: 0.8,
                delay: 0.15,
                type: "spring"
              }}

            >

              <motion.img

                src={completeNinja}

                alt="Cyber Ninja"

                animate={{
                  y: [0, -5, 0]
                }}

                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}

              />

            </motion.div>


          </motion.section>



          {/* =================================================
              STATS
          ================================================== */}

          <section className="level-complete-stats">


            {/* XP */}

            <motion.div

              className="level-complete-stat-card"

              initial={{
                opacity: 0,
                y: 18
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              transition={{
                delay: 0.25
              }}

              onMouseEnter={handleHoverSound}

            >

              <span className="stat-title purple">
                XP EARNED
              </span>


              <div className="stat-image">

                <img
                  src={xpIcon}
                  alt="XP"
                />

              </div>


              <strong>
                +300 XP
              </strong>

            </motion.div>



            {/* CHALLENGES */}

            <motion.div

              className="level-complete-stat-card"

              initial={{
                opacity: 0,
                y: 18
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              transition={{
                delay: 0.32
              }}

              onMouseEnter={handleHoverSound}

            >

              <span className="stat-title blue">
                CHALLENGES
              </span>


              <div className="stat-image">

                <img
                  src={completedIcon}
                  alt="Completed"
                />

              </div>


              <strong>
                15 / 15
              </strong>


              <small>
                Completed
              </small>

            </motion.div>



            {/* ACCURACY */}

            <motion.div

              className="level-complete-stat-card"

              initial={{
                opacity: 0,
                y: 18
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              transition={{
                delay: 0.39
              }}

              onMouseEnter={handleHoverSound}

            >

              <span className="stat-title green">
                ACCURACY
              </span>


              <div className="stat-image">

                <img
                  src={accuracyIcon}
                  alt="Accuracy"
                />

              </div>


              <strong>
                92%
              </strong>


              <small>
                Awesome!
              </small>

            </motion.div>



            {/* TIME */}

            <motion.div

              className="level-complete-stat-card"

              initial={{
                opacity: 0,
                y: 18
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              transition={{
                delay: 0.46
              }}

              onMouseEnter={handleHoverSound}

            >

              <span className="stat-title orange">
                TIME TAKEN
              </span>


              <div className="stat-image">

                <img
                  src={timeTakenIcon}
                  alt="Time Taken"
                />

              </div>


              <strong>
                2h 15m
              </strong>


              <small>
                Great job!
              </small>

            </motion.div>


          </section>



          {/* =================================================
              REWARDS TITLE
          ================================================== */}

          <div className="level-complete-section-title">

            YOUR REWARDS

          </div>



          {/* =================================================
              REWARDS
          ================================================== */}

          <section className="level-complete-rewards">


            {/* XP REWARD */}

            <motion.div

              className="level-complete-reward-card"

              whileHover={{
                y: -5
              }}

              onMouseEnter={handleHoverSound}

            >

              <img
                src={coinsIcon}
                alt="Coins"
              />

              <strong>
                +300 XP
              </strong>

            </motion.div>



            {/* COINS REWARD */}

            <motion.div

              className="level-complete-reward-card"

              whileHover={{
                y: -5
              }}

              onMouseEnter={handleHoverSound}

            >

              <img
                src={jewelIcon}
                alt="Coins"
              />

              <strong>
                +1,000 Coins
              </strong>

            </motion.div>



            {/* OUTFIT REWARD */}

            <motion.div

              className="level-complete-reward-card"

              whileHover={{
                y: -5
              }}

              onMouseEnter={handleHoverSound}

            >

              <img
                src={outfitIcon}
                alt="Cyber Ninja Outfit"
              />

              <strong>
                Cyber Ninja Outfit
              </strong>

            </motion.div>



            {/* BADGE REWARD */}

            <motion.div

              className="level-complete-reward-card"

              whileHover={{
                y: -5
              }}

              onMouseEnter={handleHoverSound}

            >

              <img
                src={guardianIcon}
                alt="Guardian Badge"
              />

              <strong>
                Level {currentLevel} Guardian Badge
              </strong>

            </motion.div>


          </section>



          {/* =================================================
              PROGRESS
          ================================================== */}

          <motion.section

            className="level-complete-progress"

            initial={{
              opacity: 0,
              y: 15
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            transition={{
              duration: 0.6,
              delay: 0.55
            }}

          >


            <span className="progress-heading">
              Your progress
            </span>



            <div className="progress-level-row">


              {/* CURRENT LEVEL */}

              <div className="progress-level">

                <img
                  src={oneIcon}
                  alt={`Level ${currentLevel}`}
                />

                <div>

                  <strong>
                    Level {currentLevel}
                  </strong>

                  <span>
                    Completed
                  </span>

                </div>

              </div>



              {/* CONNECTING LINE */}

              <div className="progress-steps">


                <span className="progress-check active">
                  ✓
                </span>

                <span className="progress-line" />

                <span className="progress-check active">
                  ✓
                </span>

                <span className="progress-line" />

                <span className="progress-check active">
                  ✓
                </span>

                <span className="progress-line" />

                <span className="progress-check active">
                  ✓
                </span>


              </div>



              {/* NEXT LEVEL */}

              <div className="progress-level next">

                <img
                  src={twoIcon}
                  alt={`Level ${nextLevel}`}
                />

                <div>

                  <strong>
                    Level {nextLevel}
                  </strong>

                  <span>
                    Unlocked
                  </span>

                </div>

              </div>


            </div>



            <p className="progress-message">

              You are one step closer to becoming a Cyber Hero ✨

            </p>


          </motion.section>



          {/* =================================================
              BOTTOM ACTIONS
          ================================================== */}

          <motion.div

            className="level-complete-actions"

            initial={{
              opacity: 0,
              y: 15
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            transition={{
              duration: 0.6,
              delay: 0.7
            }}

          >


            {/* BACK TO JOURNEY */}

            <button

              type="button"

              className="complete-action back"

              onMouseEnter={handleHoverSound}

              onClick={
                handleDashboardNavigation
              }

            >

              ← BACK TO JOURNEY

            </button>



            {/* REVIEW LEVEL */}

            <button

              type="button"

              className="complete-action review"

              onMouseEnter={handleHoverSound}

              onClick={() => {

                handleClickSound();

                setTimeout(() => {

                  navigate(
                    `/level/${currentLevel}`
                  );

                }, 120);

              }}

            >

              REVIEW LEVEL

            </button>



            {/* CONTINUE */}

            <button

              type="button"

              className="complete-action continue"

              onMouseEnter={handleHoverSound}

              onClick={
                handleContinueLevel
              }

            >

              CONTINUE TO LEVEL {nextLevel}
              {" →"}

            </button>


          </motion.div>


        </main>


      </div>


    </div>

  );

}


export default LevelComplete;