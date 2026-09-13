import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// =========================================================
// IMAGES
// =========================================================

import signupNinja from "../assets/images/signup-ninja.png";
import loginBackground from "../assets/images/cyber-login-background.png";

// =========================================================
// SOUNDS
// =========================================================

import clickSound from "../assets/sounds/click.mp3";
import hoverSound from "../assets/sounds/hover.mp3";
import levelUpSound from "../assets/sounds/level-up.mp3.mp3";
import successSound from "../assets/sounds/success.mp3";

// =========================================================
// API
// =========================================================

import api from "../services/api";

// =========================================================
// SIGNUP
// =========================================================

function Signup() {
  const navigate = useNavigate();

  // =======================================================
  // FORM STATE
  // =======================================================

  const [formData, setFormData] = useState({
    display_name: "",
    email: "",
    username: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // =======================================================
  // ERROR STATE
  // =======================================================

  const [error, setError] = useState("");

  // =======================================================
  // MOUSE BUBBLES
  // =======================================================

  const bubbleLayerRef = useRef(null);

  // =======================================================
  // AUDIO
  // =======================================================

  const playSound = (src, volume = 0.45) => {
    try {
      const audio = new Audio(src);

      audio.volume = volume;
      audio.currentTime = 0;

      const promise = audio.play();

      if (promise !== undefined) {
        promise.catch(() => {});
      }
    } catch {
      // Ignore browser audio errors
    }
  };

  // =======================================================
  // MOUSE ORANGE BUBBLES
  // =======================================================

  useEffect(() => {
    const layer = bubbleLayerRef.current;

    if (!layer) return;

    const bubbles = Array.from(
      layer.querySelectorAll(".login-cursor-bubble")
    );

    let animationFrame = null;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const positions = bubbles.map((_, index) => ({
      x: mouseX,
      y: mouseY,
      delayX: (index - 3.5) * 7,
      delayY: Math.sin(index * 1.7) * 9,
      scale: 0.75 + Math.random() * 0.45,
    }));

    const updateBubbles = () => {
      bubbles.forEach((bubble, index) => {
        const position = positions[index];

        const targetX =
          mouseX +
          position.delayX +
          Math.sin(Date.now() / 350 + index) * 4;

        const targetY =
          mouseY +
          position.delayY +
          Math.cos(Date.now() / 420 + index) * 4;

        position.x += (targetX - position.x) * 0.22;
        position.y += (targetY - position.y) * 0.22;

        bubble.style.transform = `
          translate3d(
            ${position.x}px,
            ${position.y}px,
            0
          )
          scale(${position.scale})
        `;
      });

      animationFrame = requestAnimationFrame(updateBubbles);
    };

    // =====================================================
    // FIXED MOUSE MOVE HANDLER
    // =====================================================

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      bubbles.forEach((bubble, index) => {
        bubble.style.opacity = String(
          0.48 + (index % 3) * 0.12
        );
      });
    };

    const handleMouseLeave = () => {
      bubbles.forEach((bubble) => {
        bubble.style.opacity = "0";
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    animationFrame = requestAnimationFrame(updateBubbles);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  // =======================================================
  // INPUT CHANGE
  // =======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // =======================================================
  // SUBMIT
  // REAL SIGNUP - CONNECTED TO FASTAPI
  // =======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    playSound(clickSound, 0.35);

    setError("");

    // -------------------------------------------------------
    // CHECK PASSWORDS
    // -------------------------------------------------------

    if (formData.password !== formData.confirm_password) {
      playSound(clickSound, 0.25);

      setError("Passwords do not match.");

      return;
    }

    // -------------------------------------------------------
    // CHECK TERMS
    // -------------------------------------------------------

    if (!acceptedTerms) {
      playSound(clickSound, 0.25);

      setError(
        "Please accept the Terms of Service and Privacy Policy."
      );

      return;
    }

    setIsLoading(true);

    try {
      // =====================================================
      // PREPARE REGISTRATION DATA
      // Backend UserCreate expects:
      // username
      // email
      // password
      // display_name
      // avatar_id (optional)
      // language
      // =====================================================

      const signupData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        display_name: formData.display_name.trim() || null,
        language: "en",
      };

      // =====================================================
      // SEND REGISTER REQUEST
      // =====================================================

      const response = await api.post(
        "/auth/register",
        signupData
      );

      console.log("Signup response:", response.data);

      // =====================================================
      // SAVE REGISTERED USER
      // =====================================================

      if (response.data) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        );
      }

      // =====================================================
      // AUTO LOGIN AFTER SUCCESSFUL REGISTER
      // =====================================================

      try {
        const loginData = new URLSearchParams();

        loginData.append(
          "username",
          formData.username.trim()
        );

        loginData.append(
          "password",
          formData.password
        );

        const loginResponse = await api.post(
          "/auth/login",
          loginData,
          {
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded",
            },
          }
        );

        console.log(
          "Auto login response:",
          loginResponse.data
        );

        // ===================================================
        // SAVE JWT
        // ===================================================

        if (loginResponse.data?.access_token) {
          localStorage.setItem(
            "token",
            loginResponse.data.access_token
          );
        }

        // ===================================================
        // SAVE USER FROM LOGIN RESPONSE
        // ===================================================

        if (loginResponse.data?.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(loginResponse.data.user)
          );
        }
      } catch (loginError) {
        // Registration already succeeded.
        // If auto-login fails, keep the account created
        // and continue to onboarding.

        console.error(
          "Auto login after signup failed:",
          loginError
        );
      }

      // =====================================================
      // SUCCESS SOUNDS
      // =====================================================

      playSound(levelUpSound, 0.5);

      setTimeout(() => {
        playSound(successSound, 0.45);

        navigate("/onboarding");
      }, 650);
    } catch (error) {
      console.error("Signup error:", error);

      // =====================================================
      // BACKEND ERROR
      // =====================================================

      const backendDetail =
        error.response?.data?.detail;

      let message =
        "Signup failed. Please try again.";

      if (typeof backendDetail === "string") {
        message = backendDetail;
      } else if (Array.isArray(backendDetail)) {
        message =
          backendDetail
            .map((item) => item?.msg)
            .filter(Boolean)
            .join(", ") ||
          message;
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // =======================================================
  // BACK
  // =======================================================

  const handleBack = () => {
    playSound(clickSound, 0.35);

    navigate("/login");
  };

  // =======================================================
  // HOVER SOUND
  // =======================================================

  const handleHover = () => {
    playSound(hoverSound, 0.16);
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      className="login-page signup-page"
      style={{
        "--login-background-image": `url(${loginBackground})`,
      }}
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        className="login-background"
        style={{
          backgroundImage: `url(${loginBackground})`,
        }}
      />

      <div className="login-background-overlay" />

      {/* =====================================================
          BACKGROUND GLOWS
      ====================================================== */}

      <div className="login-background-glow login-glow-one" />

      <div className="login-background-glow login-glow-two" />

      <div className="login-background-glow login-glow-three" />

      {/* =====================================================
          MOUSE ORANGE BUBBLES
      ====================================================== */}

      <div
        ref={bubbleLayerRef}
        className="login-cursor-bubbles"
        aria-hidden="true"
      >
        <span className="login-cursor-bubble bubble-1" />
        <span className="login-cursor-bubble bubble-2" />
        <span className="login-cursor-bubble bubble-3" />
        <span className="login-cursor-bubble bubble-4" />
        <span className="login-cursor-bubble bubble-5" />
        <span className="login-cursor-bubble bubble-6" />
        <span className="login-cursor-bubble bubble-7" />
        <span className="login-cursor-bubble bubble-8" />
      </div>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="login-main signup-main">
        {/* ===================================================
            PAGE TITLE
        ===================================================== */}

        <motion.div
          className="login-page-title signup-page-title"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.45,
            ease: "easeOut",
          }}
        >
          SIGN IN
        </motion.div>

        {/* ===================================================
            MAIN SHELL
        ===================================================== */}

        <motion.div
          className="login-shell signup-shell"
          initial={{
            opacity: 0,
            y: 25,
            scale: 0.985,
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
          {/* =================================================
              LEFT VISUAL
          ================================================== */}

          <section className="login-visual signup-visual">
            {/* -----------------------------------------------
                Visual background
            ------------------------------------------------ */}

            <div className="login-visual-background" />

            {/* -----------------------------------------------
                Blue ninja glow
            ------------------------------------------------ */}

            <div className="signup-ninja-blue-glow" />

            <div className="signup-ninja-blue-glow signup-ninja-blue-glow-two" />

            {/* -----------------------------------------------
                Ninja
            ------------------------------------------------ */}

            <motion.img
              src={signupNinja}
              alt="CyberNinjas ninja"
              className="login-ninja signup-ninja"
              initial={{
                opacity: 0,
                x: -25,
                scale: 0.94,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.75,
                delay: 0.15,
                ease: "easeOut",
              }}
            />

            {/* -----------------------------------------------
                Back button
            ------------------------------------------------ */}

            <motion.button
              type="button"
              className="login-back-button"
              onClick={handleBack}
              onMouseEnter={handleHover}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.94,
              }}
              aria-label="Back to login"
            >
              <svg
                className="back-arrow-svg"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 5L8 12L15 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </section>

          {/* =================================================
              RIGHT FORM PANEL
          ================================================== */}

          <section className="login-form-panel signup-form-panel">
            {/* -----------------------------------------------
                Panel glow
            ------------------------------------------------ */}

            <div className="login-panel-glow" />

            {/* ===============================================
                HEADER
            ================================================= */}

            <motion.header
              className="login-header signup-header"
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.2,
              }}
            >
              <h1>
                CREATE YOUR <span>ACCOUNT</span>
              </h1>

              <p>Start your adventure today!</p>
            </motion.header>

            {/* ===============================================
                FORM
            ================================================= */}

            <form
              className="login-form signup-form"
              onSubmit={handleSubmit}
            >
              {/* =============================================
                  ERROR MESSAGE
              ============================================== */}

              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              {/* =============================================
                  FULL NAME
              ============================================== */}

              <motion.div
                className="login-field signup-field"
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: 0.25,
                }}
              >
                <div className="login-input-wrapper">
                  <span className="login-input-icon">
                    <svg
                      className="login-input-svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                        fill="currentColor"
                      />

                      <path
                        d="M4 21C4 17.6863 7.58172 15 12 15C16.4183 15 20 17.6863 20 21"
                        fill="currentColor"
                      />
                    </svg>
                  </span>

                  <input
                    id="display_name"
                    name="display_name"
                    type="text"
                    placeholder="Full Name"
                    value={formData.display_name}
                    onChange={handleChange}
                    onMouseEnter={handleHover}
                    required
                    autoComplete="name"
                  />
                </div>
              </motion.div>

              {/* =============================================
                  EMAIL
              ============================================== */}

              <motion.div
                className="login-field signup-field"
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: 0.3,
                }}
              >
                <div className="login-input-wrapper">
                  <span className="login-input-icon">
                    <svg
                      className="login-input-svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />

                      <path
                        d="M4 7L12 13L20 7"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    onMouseEnter={handleHover}
                    required
                    autoComplete="email"
                  />
                </div>
              </motion.div>

              {/* =============================================
                  USERNAME
              ============================================== */}

              <motion.div
                className="login-field signup-field"
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: 0.35,
                }}
              >
                <div className="login-input-wrapper">
                  <span className="login-input-icon">
                    <svg
                      className="login-input-svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                        fill="currentColor"
                      />

                      <path
                        d="M4 21C4 17.6863 7.58172 15 12 15C16.4183 15 20 17.6863 20 21"
                        fill="currentColor"
                      />
                    </svg>
                  </span>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    onMouseEnter={handleHover}
                    required
                    autoComplete="username"
                  />
                </div>
              </motion.div>

              {/* =============================================
                  PASSWORD
              ============================================== */}

              <motion.div
                className="login-field signup-field"
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: 0.4,
                }}
              >
                <div className="login-input-wrapper">
                  <span className="login-input-icon">
                    <svg
                      className="login-input-svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="10"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />

                      <path
                        d="M8 10V7.5C8 5.29086 9.79086 3.5 12 3.5C14.2091 3.5 16 5.29086 16 7.5V10"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />

                      <circle
                        cx="12"
                        cy="15"
                        r="1.3"
                        fill="currentColor"
                      />
                    </svg>
                  </span>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    onMouseEnter={handleHover}
                    minLength={6}
                    required
                    autoComplete="new-password"
                  />

                  <motion.button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => {
                      playSound(clickSound, 0.25);
                      setShowPassword(
                        (previous) => !previous
                      );
                    }}
                    onMouseEnter={handleHover}
                    whileTap={{
                      scale: 0.9,
                    }}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        className="password-eye-svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 3L21 21"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />

                        <path
                          d="M10.58 10.58C10.2 10.96 10 11.47 10 12C10 13.1 10.9 14 12 14C12.53 14 13.04 13.8 13.42 13.42"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M9.88 5.1C10.56 4.9 11.26 4.8 12 4.8C17.3 4.8 20.5 9.1 21.3 12C20.9 13.45 19.75 15.35 17.95 16.75"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M6.1 7.05C4.3 8.45 3.35 10.35 2.7 12C3.5 14.9 6.7 19.2 12 19.2C13.1 19.2 14.1 19.05 15 18.75"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="password-eye-svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.7 12C3.5 9.1 6.7 4.8 12 4.8C17.3 4.8 20.5 9.1 21.3 12C20.5 14.9 17.3 19.2 12 19.2C6.7 19.2 3.5 14.9 2.7 12Z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinejoin="round"
                        />

                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                      </svg>
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* =============================================
                  CONFIRM PASSWORD
              ============================================== */}

              <motion.div
                className="login-field signup-field"
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: 0.45,
                }}
              >
                <div className="login-input-wrapper">
                  <span className="login-input-icon">
                    <svg
                      className="login-input-svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="10"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />

                      <path
                        d="M8 10V7.5C8 5.29086 9.79086 3.5 12 3.5C14.2091 3.5 16 5.29086 16 7.5V10"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />

                      <path
                        d="M9.5 15L11.3 16.8L15 13.2"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm Password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    onMouseEnter={handleHover}
                    minLength={6}
                    required
                    autoComplete="new-password"
                  />

                  <motion.button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => {
                      playSound(clickSound, 0.25);

                      setShowConfirmPassword(
                        (previous) => !previous
                      );
                    }}
                    onMouseEnter={handleHover}
                    whileTap={{
                      scale: 0.9,
                    }}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="password-eye-svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 3L21 21"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />

                        <path
                          d="M10.58 10.58C10.2 10.96 10 11.47 10 12C10 13.1 10.9 14 12 14C12.53 14 13.04 13.8 13.42 13.42"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M9.88 5.1C10.56 4.9 11.26 4.8 12 4.8C17.3 4.8 20.5 9.1 21.3 12C20.9 13.45 19.75 15.35 17.95 16.75"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M6.1 7.05C4.3 8.45 3.35 10.35 2.7 12C3.5 14.9 6.7 19.2 12 19.2C13.1 19.2 14.1 19.05 15 18.75"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="password-eye-svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.7 12C3.5 9.1 6.7 4.8 12 4.8C17.3 4.8 20.5 9.1 21.3 12C20.5 14.9 17.3 19.2 12 19.2C6.7 19.2 3.5 14.9 2.7 12Z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinejoin="round"
                        />

                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                      </svg>
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* =============================================
                  TERMS
              ============================================== */}

              <motion.label
                className="login-remember signup-terms"
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: 0.5,
                }}
              >
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    playSound(clickSound, 0.25);

                    setAcceptedTerms(e.target.checked);
                  }}
                />

                <span className="login-custom-checkbox">
                  <span />
                </span>

                <span className="login-remember-text">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="signup-terms-link"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      playSound(clickSound, 0.25);
                    }}
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="signup-terms-link"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      playSound(clickSound, 0.25);
                    }}
                  >
                    Privacy Policy
                  </button>
                </span>
              </motion.label>

              {/* =============================================
                  SUBMIT
              ============================================== */}

              <motion.button
                type="submit"
                className={`login-submit signup-submit ${
                  isLoading ? "is-loading" : ""
                }`}
                disabled={isLoading}
                onMouseEnter={handleHover}
                whileHover={{
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.98,
                }}
              >
                <span>
                  {isLoading ? "CREATING..." : "SIGN IN"}
                </span>

                <svg
                  className="login-arrow-svg"
                  viewBox="0 0 28 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 10H24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  <path
                    d="M17 3L24 10L17 17"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            </form>

            {/* ===============================================
                LOGIN FOOTER
            ================================================= */}

            <motion.div
              className="login-signup signup-login-footer"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.4,
                delay: 0.65,
              }}
            >
              <p>
                Already have an account?
                <Link
                  to="/login"
                  onClick={() => playSound(clickSound, 0.3)}
                  onMouseEnter={handleHover}
                >
                  {" "}
                  Log in
                </Link>
              </p>
            </motion.div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}

export default Signup;