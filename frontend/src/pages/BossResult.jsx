import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../services/api";

import bossResultImage from "../assets/images/boss-result.png";
import xpIcon from "../assets/icons/xp.png";
import coinsIcon from "../assets/icons/coins.png";


function BossResult() {
  const { bossId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* =========================================================
     FETCH RESULT
  ========================================================= */

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/boss/${bossId}/result`
        );

        console.log(
          "BOSS RESULT:",
          response.data
        );

        setResult(response.data);

      } catch (err) {
        console.error(
          "BOSS RESULT ERROR:",
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

        if (err.response) {
          setError(
            err.response.data?.detail ||
              `Server error: ${err.response.status}`
          );
        } else if (err.request) {
          setError(
            "Cannot connect to the CYBERNINJAS server."
          );
        } else {
          setError(err.message);
        }

      } finally {
        setLoading(false);
      }
    };


    if (bossId) {
      fetchResult();
    } else {
      setError("Boss result not found.");
      setLoading(false);
    }

  }, [bossId, navigate]);


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="boss-result-page boss-result-loading-page">

        <div className="boss-result-grid" />

        <div className="boss-result-glow boss-result-glow-one" />
        <div className="boss-result-glow boss-result-glow-two" />


        <motion.div
          className="boss-result-loading-card"

          initial={{
            opacity: 0,
            scale: 0.94,
          }}

          animate={{
            opacity: 1,
            scale: 1,
          }}

          transition={{
            duration: 0.45,
          }}
        >

          <motion.img
            src={bossResultImage}
            alt="Boss Result Ninja"
            className="boss-result-loading-image"

            animate={{
              y: [0, -8, 0],
            }}

            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />


          <div className="boss-result-loading-title">
            CHECKING RESULT
          </div>


          <h2>
            Checking your battle result...
          </h2>


          <p>
            Please wait...
          </p>

        </motion.div>

      </div>
    );
  }


  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !result) {
    return (
      <div className="boss-result-page boss-result-error-page">

        <div className="boss-result-grid" />

        <div className="boss-result-glow boss-result-glow-one" />
        <div className="boss-result-glow boss-result-glow-two" />


        <motion.section
          className="boss-result-card boss-result-error-card"

          initial={{
            opacity: 0,
            y: 25,
            scale: 0.97,
          }}

          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}

          transition={{
            duration: 0.5,
          }}
        >

          <div className="boss-result-top-line">
            <span>
              {bossId || "?"}.
            </span>

            <span>
              BOSS RESULT
            </span>
          </div>


          <div className="boss-result-error-content">

            <img
              src={bossResultImage}
              alt="Boss Result Ninja"
              className="boss-result-error-image"
            />


            <div>

              <div className="boss-result-kicker">
                RESULT UNAVAILABLE
              </div>


              <h1>
                Result unavailable
              </h1>


              <p className="boss-result-message">
                {error ||
                  "No boss result found."}
              </p>

            </div>

          </div>


          <button
            type="button"
            className="boss-result-primary"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Back to Dashboard
          </button>

        </motion.section>

      </div>
    );
  }


  /* =========================================================
     RESULT VALUES
  ========================================================= */

  const passed =
    result.passed ??
    result.is_passed ??
    false;


  const score =
    Number(result.score ?? 0);


  const xpEarned =
    Number(result.xp_earned ?? 0);


  const coinsEarned =
    Number(
      result.coins_earned ??
      result.ninja_coins ??
      result.coins ??
      100
    );


  const levelId =
    result.level_id ??
    result.levelId ??
    null;


  const badgeName =
    result.badge_name ??
    result.badge_title ??
    "Information Guardian";


  const resultMessage =
    result.message ||
    (
      passed
        ? "You defeated the Guardian!"
        : "Don't give up. Train and try again!"
    );


  /* =========================================================
     MAIN RESULT
  ========================================================= */

  return (
    <div
      className={`boss-result-page ${
        passed
          ? "boss-result-success"
          : "boss-result-failed"
      }`}
    >

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="boss-result-grid" />

      <div className="boss-result-glow boss-result-glow-one" />

      <div className="boss-result-glow boss-result-glow-two" />


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="boss-result-header">

        <div className="boss-result-brand">

          <span>
            🥷
          </span>

          CYBER
          <strong>
            NINJAS
          </strong>

        </div>


        <div className="boss-result-label">
          BOSS RESULT
        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="boss-result-main">

        <motion.section
          className="boss-result-card"

          initial={{
            opacity: 0,
            scale: 0.92,
            y: 25,
          }}

          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}

          transition={{
            duration: 0.55,
            ease: "easeOut",
          }}
        >

          {/* =================================================
              TOP CARD LINE
          ================================================= */}

          <div className="boss-result-top-line">

            <span>
              {levelId ?? bossId}.
            </span>

            <span>
              BOSS RESULT
            </span>

          </div>


          {/* =================================================
              VICTORY HEADER
          ================================================= */}

          <div className="boss-result-heading">

            <div className="boss-result-heading-text">

              <motion.h1
                className="boss-result-victory"

                animate={
                  passed
                    ? {
                        opacity: [1, 0.82, 1],
                      }
                    : undefined
                }

                transition={
                  passed
                    ? {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    : undefined
                }
              >
                {passed
                  ? "VICTORY!"
                  : "DEFEATED!"}
              </motion.h1>


              <p>
                {resultMessage}
              </p>

            </div>


            {/* =================================================
                BOSS RESULT IMAGE
            ================================================= */}

            <motion.div
              className="boss-result-character"

              animate={
                passed
                  ? {
                      y: [0, -5, 0],
                    }
                  : {
                      y: [0, -3, 0],
                    }
              }

              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >

              <img
                src={bossResultImage}
                alt="Boss Result Ninja"
                className="boss-result-image"
              />

            </motion.div>

          </div>


          {/* =================================================
              REWARD PANEL
          ================================================= */}

          <div className="boss-result-reward-panel">

            <div className="boss-result-reward-title">
              YOU EARNED
            </div>


            <div className="boss-result-rewards">

              {/* XP */}

              <div className="boss-result-reward">

                <div className="boss-result-reward-icon xp-reward-icon">

                  <img
                    src={xpIcon}
                    alt="XP"
                  />

                </div>


                <strong>
                  {xpEarned}
                </strong>


                <span>
                  XP
                </span>

              </div>


              {/* DIVIDER */}

              <div className="boss-result-reward-divider" />


              {/* COINS */}

              <div className="boss-result-reward">

                <div className="boss-result-reward-icon coins-reward-icon">

                  <img
                    src={coinsIcon}
                    alt="Ninja Coins"
                  />

                </div>


                <strong>
                  {coinsEarned}
                </strong>


                <span>
                  Ninja Coins
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              BADGE
          ================================================= */}

          {passed && (
            <motion.div
              className="boss-result-badge"

              initial={{
                opacity: 0,
                y: 12,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                delay: 0.35,
                duration: 0.45,
              }}
            >

              <div className="boss-result-badge-text">

                <strong>
                  New Badge Unlocked!
                </strong>


                <span>
                  {badgeName}
                </span>

              </div>


              <div className="boss-result-badge-icon">
                🔐
              </div>

            </motion.div>
          )}


          {/* =================================================
              FAILED MESSAGE
          ================================================= */}

          {!passed && (
            <div className="boss-result-failed-message">

              <span>
                ⚔
              </span>

              <div>

                <strong>
                  Keep training, Ninja!
                </strong>

                <p>
                  Complete the boss challenge again
                  and prove your skills.
                </p>

              </div>

            </div>
          )}


          {/* =================================================
              CONTINUE BUTTON
          ================================================= */}

          <div className="boss-result-actions">

            {passed ? (
              <motion.button
                type="button"
                className="boss-result-primary"

                onClick={() => {
                  if (levelId) {
                    navigate(
                      `/level-complete/${levelId}`
                    );
                  } else {
                    navigate("/dashboard");
                  }
                }}

                whileHover={{
                  scale: 1.015,
                }}

                whileTap={{
                  scale: 0.98,
                }}
              >

                <span>
                  CONTINUE JOURNEY
                </span>

                <span>
                  →
                </span>

              </motion.button>
            ) : (
              <motion.button
                type="button"
                className="boss-result-primary"

                onClick={() => {
                  if (levelId) {
                    navigate(
                      `/boss/${levelId}`
                    );
                  } else {
                    navigate("/dashboard");
                  }
                }}

                whileHover={{
                  scale: 1.015,
                }}

                whileTap={{
                  scale: 0.98,
                }}
              >

                <span>
                  TRY AGAIN
                </span>

                <span>
                  ↻
                </span>

              </motion.button>
            )}


            <button
              type="button"
              className="boss-result-secondary"

              onClick={() =>
                navigate("/dashboard")
              }
            >
              BACK TO DASHBOARD
            </button>

          </div>

        </motion.section>

      </main>

    </div>
  );
}


export default BossResult;