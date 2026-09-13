import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../services/api";
import bossNinja from "../assets/images/ninja-boss.png";

function BossChallenge() {
  const { levelId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);

  const [boss, setBoss] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300);

  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* =========================================================
     FETCH BOSS
  ========================================================= */

  useEffect(() => {
    const fetchBoss = async () => {
      try {
        setLoading(true);
        setError("");

        const userResponse = await api.get("/auth/me");
        const currentUser = userResponse.data;

        if (!currentUser?.id) {
          navigate("/login");
          return;
        }

        console.log("Fetching boss:", `/boss/level/${levelId}`);

        const response = await api.get(`/boss/level/${levelId}`);

        console.log("BOSS:", response.data);

        setBoss(response.data);
      } catch (err) {
        console.error("BOSS ERROR:", err);

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
          setError("Cannot connect to the CYBERNINJAS server.");
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!levelId) {
      setError("Level not found.");
      setLoading(false);
      return;
    }

    fetchBoss();
  }, [levelId, navigate]);

  /* =========================================================
     START BOSS
  ========================================================= */

  const handleStart = async () => {
    if (!boss?.id || starting) return;

    try {
      setStarting(true);
      setError("");

      console.log("Starting boss:", `/boss/${boss.id}/start`);

      const response = await api.post(`/boss/${boss.id}/start`);

      console.log("BOSS START:", response.data);

      const startedQuestions = response.data?.questions || [];

      if (!startedQuestions.length) {
        setError("No boss questions are available for this level.");
        return;
      }

      setQuestions(startedQuestions);
      setCurrentQuestion(0);
      setAnswers({});

      setTimeLeft(
        response.data?.time_limit_seconds ||
          boss.time_limit_seconds ||
          300
      );

      setStarted(true);
    } catch (err) {
      console.error("BOSS START ERROR:", err);

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
        setError("Cannot connect to the CYBERNINJAS server.");
      } else {
        setError(err.message);
      }
    } finally {
      setStarting(false);
    }
  };

  /* =========================================================
     TIMER
  ========================================================= */

  useEffect(() => {
    if (!started || submitting) return;

    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft, submitting]);

  /* =========================================================
     FORMAT TIME
  ========================================================= */

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  /* =========================================================
     SELECT ANSWER
  ========================================================= */

  const handleSelectAnswer = (optionId) => {
    if (submitting) return;

    const question = questions[currentQuestion];

    if (!question) return;

    setAnswers((previous) => ({
      ...previous,
      [question.id]: optionId,
    }));
  };

  /* =========================================================
     SUBMIT BOSS
  ========================================================= */

  const handleSubmit = async (timeExpired = false) => {
    if (!boss?.id || submitting) return;

    try {
      setSubmitting(true);
      setError("");

      const formattedAnswers = questions.map((question) => ({
        challenge_id: question.id,
        selected_option_id: answers[question.id] || null,
      }));

      console.log("Submitting boss:", formattedAnswers);

      const response = await api.post(`/boss/${boss.id}/submit`, {
        answers: formattedAnswers,
      });

      console.log("BOSS RESULT:", response.data);

      navigate(`/boss-result/${boss.id}`, {
        state: {
          result: response.data,
          time_expired: timeExpired,
        },
      });
    } catch (err) {
      console.error("BOSS SUBMIT ERROR:", err);

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
        setError("Cannot connect to the CYBERNINJAS server.");
      } else {
        setError(err.message);
      }

      setSubmitting(false);
    }
  };

  /* =========================================================
     NEXT QUESTION
  ========================================================= */

  const handleNextQuestion = () => {
    if (submitting) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
      return;
    }

    handleSubmit(false);
  };

  /* =========================================================
     LOADING SCREEN
  ========================================================= */

  if (loading) {
    return (
      <div className="boss-page boss-loading-page">
        <div className="boss-background-grid" />

        <div className="boss-glow boss-glow-one" />
        <div className="boss-glow boss-glow-two" />

        <motion.div
          className="boss-loading-card"
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
        >
          <motion.img
            src={bossNinja}
            alt="Boss Ninja"
            className="boss-loading-image"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="boss-loading-label">
            PREPARING BOSS
          </div>

          <h2>Preparing the Boss...</h2>

          <p>
            Level {levelId} final challenge
          </p>
        </motion.div>
      </div>
    );
  }

  /* =========================================================
     ERROR SCREEN
  ========================================================= */

  if (error && !started) {
    return (
      <div className="boss-page boss-error-page">
        <div className="boss-background-grid" />

        <div className="boss-glow boss-glow-one" />
        <div className="boss-glow boss-glow-two" />

        <motion.section
          className="boss-card boss-error-card"
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
          <div className="boss-card-top">
            <span className="boss-number">
              {levelId}.
            </span>

            <span>BOSS CHALLENGE</span>
          </div>

          <div className="boss-error-content">
            <img
              src={bossNinja}
              alt="Boss Ninja"
              className="boss-error-image"
            />

            <div className="boss-error-text">
              <div className="boss-label">
                BOSS UNAVAILABLE
              </div>

              <h1>Boss challenge not found</h1>

              <p>
                {error || "Unable to load this level boss."}
              </p>

              <button
                type="button"
                className="boss-back-level-button"
                onClick={() =>
                  navigate(`/level/${levelId}`)
                }
              >
                ← Back to Level
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    );
  }

  /* =========================================================
     CURRENT QUESTION DATA
  ========================================================= */

  const question = questions[currentQuestion];

  const selectedAnswer = question
    ? answers[question.id]
    : null;

  const questionNumber = currentQuestion + 1;

  const totalQuestions = questions.length || 5;

  const progressPercent =
    totalQuestions > 0
      ? (questionNumber / totalQuestions) * 100
      : 0;

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <div className="boss-page">
      <div className="boss-background-grid" />

      <div className="boss-glow boss-glow-one" />
      <div className="boss-glow boss-glow-two" />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="boss-header">
        <div className="boss-header-inner">
          <button
            type="button"
            className="boss-back-button"
            onClick={() =>
              navigate(`/level/${levelId}`)
            }
            disabled={submitting}
          >
            <span>←</span>
            <span>Back to Level</span>
          </button>

          <div className="boss-brand">
            <span>🥷</span>
            CYBER<strong>NINJAS</strong>
          </div>

          <div className="boss-level-badge">
            LEVEL {levelId}
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="boss-main">
        {/* ===================================================
            START SCREEN
        =================================================== */}

        {!started ? (
          <motion.section
            className="boss-card boss-start-card"
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.55,
              ease: "easeOut",
            }}
          >
            {/* TOP LINE */}

            <div className="boss-card-top">
              <span className="boss-number">
                {levelId}.
              </span>

              <span>BOSS CHALLENGE</span>
            </div>

            {/* MAIN INTRO */}

            <div className="boss-intro">
              {/* LEFT SIDE */}

              <div className="boss-intro-content">
                <div className="boss-label">
                  BOSS CHALLENGE
                </div>

                <h1 className="boss-name">
                  {boss?.title_en ||
                    "Personal Information Guardian"}
                </h1>

                <div className="boss-description">
                  {boss?.description_en ||
                    "Prove your knowledge and protect your personal information!"}
                </div>
              </div>

              {/* RIGHT SIDE - ACTUAL IMAGE */}

              <div className="boss-image-container">
                <motion.img
                  src={bossNinja}
                  alt="Boss Ninja"
                  className="boss-image"
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>

            {/* MESSAGE */}

            <div className="boss-message">
              <span className="boss-message-icon">
                ⚔
              </span>

              <span>
                Complete all questions to defeat the Guardian!
              </span>
            </div>

            {/* ERROR */}

            {error && (
              <div className="boss-inline-error">
                <span>⚠️</span>

                <p>{error}</p>
              </div>
            )}

            {/* START BUTTON */}

            <motion.button
              type="button"
              className="boss-start-button"
              onClick={handleStart}
              disabled={starting}
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              <span className="boss-button-icon">
                ⚔
              </span>

              <span>
                {starting
                  ? "STARTING..."
                  : "START BOSS CHALLENGE"}
              </span>

              <span className="boss-button-arrow">
                →
              </span>
            </motion.button>
          </motion.section>
        ) : (
          /* =================================================
             QUESTION SCREEN
          ================================================= */

          <motion.section
            className="boss-question-card"
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.45,
            }}
          >
            {/* QUESTION HEADER */}

            <div className="boss-question-top">
              <span>BOSS CHALLENGE</span>

              <strong>
                QUESTION {questionNumber} / {totalQuestions}
              </strong>
            </div>

            {/* PROGRESS */}

            <div className="boss-question-progress">
              <div
                style={{
                  width: `${progressPercent}%`,
                }}
              />
            </div>

            {/* TIMER */}

            <div
              className="boss-question-top boss-time-row"
            >
              <span>⏱ TIME LEFT</span>

              <strong>
                {formatTime(timeLeft)}
              </strong>
            </div>

            {/* QUESTION */}

            {question ? (
              <>
                <div className="boss-question-content">
                  <div className="boss-question-icon">
                    <img
                      src={bossNinja}
                      alt="Boss Ninja"
                    />
                  </div>

                  <h1>
                    {question.title_en ||
                      `Question ${questionNumber}`}
                  </h1>

                  <p>
                    {question.question_en ||
                      "Choose the best answer."}
                  </p>
                </div>

                {/* OPTIONS */}

                {question.options?.length > 0 ? (
                  <div className="boss-options">
                    {[...question.options]
                      .sort(
                        (a, b) =>
                          a.sort_order -
                          b.sort_order
                      )
                      .map((option) => {
                        const isSelected =
                          selectedAnswer === option.id;

                        return (
                          <motion.button
                            key={option.id}
                            type="button"
                            className={`boss-option ${
                              isSelected
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              handleSelectAnswer(
                                option.id
                              )
                            }
                            disabled={submitting}
                            whileHover={{
                              scale: 1.01,
                            }}
                            whileTap={{
                              scale: 0.99,
                            }}
                          >
                            <span className="boss-option-radio">
                              {isSelected ? "✓" : ""}
                            </span>

                            <span>
                              {option.option_text_en}
                            </span>
                          </motion.button>
                        );
                      })}
                  </div>
                ) : (
                  <div className="boss-inline-error">
                    <span>⚠️</span>

                    <p>
                      This boss question does not have
                      selectable options yet.
                    </p>
                  </div>
                )}

                {/* QUESTION ERROR */}

                {error && (
                  <div className="boss-inline-error">
                    <span>⚠️</span>

                    <p>{error}</p>
                  </div>
                )}

                {/* NEXT / FINISH */}

                <motion.button
                  type="button"
                  className="boss-start-button boss-next-button"
                  onClick={handleNextQuestion}
                  disabled={
                    submitting ||
                    selectedAnswer == null
                  }
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                >
                  <span className="boss-button-icon">
                    {currentQuestion ===
                    totalQuestions - 1
                      ? "🏆"
                      : "→"}
                  </span>

                  <span>
                    {submitting
                      ? "SUBMITTING..."
                      : currentQuestion ===
                        totalQuestions - 1
                      ? "FINISH BOSS"
                      : "NEXT QUESTION"}
                  </span>

                  <span className="boss-button-arrow">
                    →
                  </span>
                </motion.button>
              </>
            ) : (
              /* NO QUESTION */

              <div className="boss-no-question">
                <div className="boss-question-icon">
                  ⚠️
                </div>

                <h1>No Question Available</h1>

                <p>
                  The boss questions could not be loaded.
                </p>

                <button
                  type="button"
                  className="boss-back-level-button"
                  onClick={() =>
                    navigate(`/level/${levelId}`)
                  }
                >
                  ← Back to Level
                </button>
              </div>
            )}
          </motion.section>
        )}
      </main>
    </div>
  );
}

export default BossChallenge;