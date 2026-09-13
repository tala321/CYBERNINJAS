import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import loginNinja from "../assets/images/login_ninja.png";
import cyberLoginBackground from "../assets/images/cyber-login-background.png";

import googleIcon from "../assets/icons/google.png";
import appleIcon from "../assets/icons/apple.png";

import clickSoundFile from "../assets/sounds/click.mp3";
import hoverSoundFile from "../assets/sounds/hover.mp3";
import successSoundFile from "../assets/sounds/success.mp3";

// =====================================================
// API
// =====================================================
import api from "../services/api";

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="login-input-svg"
      aria-hidden="true"
    >
      <path
        d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="login-input-svg"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <circle cx="12" cy="15" r="1.2" fill="currentColor" />
    </svg>
  );
}

function EyeIcon({ hidden = false }) {
  if (hidden) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="password-eye-svg"
        aria-hidden="true"
      >
        <path
          d="M3 3l18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />

        <path
          d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />

        <path
          d="M9.9 5.4A10.9 10.9 0 0 1 12 5.2c5.3 0 8.8 4.8 9.8 6.8-.42.84-1.18 2-2.28 3.08M6.4 6.5C4.2 7.8 2.8 10 2.2 12c1 2 4.5 6.8 9.8 6.8 1.25 0 2.4-.24 3.42-.64"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="password-eye-svg"
      aria-hidden="true"
    >
      <path
        d="M2.2 12c1-2 4.5-6.8 9.8-6.8s8.8 4.8 9.8 6.8c-1 2-4.5 6.8-9.8 6.8S3.2 14 2.2 12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="12"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 28 20"
      className="login-arrow-svg"
      aria-hidden="true"
    >
      <path
        d="M2 10h21"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="m17 4 6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackArrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="back-arrow-svg"
      aria-hidden="true"
    >
      <path
        d="M15 5 8 12l7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // =====================================================
  // LOGIN ERROR
  // =====================================================
  const [error, setError] = useState("");

  const clickAudio = useRef(null);
  const hoverAudio = useRef(null);
  const successAudio = useRef(null);

  const bubbleLayerRef = useRef(null);

  useEffect(() => {
    clickAudio.current = new Audio(clickSoundFile);
    hoverAudio.current = new Audio(hoverSoundFile);
    successAudio.current = new Audio(successSoundFile);

    clickAudio.current.volume = 0.45;
    hoverAudio.current.volume = 0.2;
    successAudio.current.volume = 0.7;

    return () => {
      clickAudio.current = null;
      hoverAudio.current = null;
      successAudio.current = null;
    };
  }, []);

  const playSound = (audioRef) => {
    if (!audioRef.current) return;

    try {
      audioRef.current.currentTime = 0;

      const playPromise = audioRef.current.play();

      if (playPromise?.catch) {
        playPromise.catch(() => {});
      }
    } catch {
      // Ignore browser audio errors.
    }
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      const layer = bubbleLayerRef.current;

      if (!layer) return;

      const bubbles = layer.querySelectorAll(".login-cursor-bubble");

      const mouseX = event.clientX;
      const mouseY = event.clientY;

      bubbles.forEach((bubble, index) => {
        const angle =
          (index / bubbles.length) * Math.PI * 2 +
          performance.now() * 0.00015;

        const distance = 18 + (index % 4) * 13;

        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;

        bubble.style.transform = `translate3d(
          ${mouseX + offsetX}px,
          ${mouseY + offsetY}px,
          0
        )`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove error when user starts typing again
    if (error) {
      setError("");
    }
  };

  // =====================================================
  // REAL LOGIN - CONNECTED TO FASTAPI
  // =====================================================
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoggingIn) return;

    setError("");

    if (!formData.username.trim() || !formData.password) {
      setError("Please enter your username and password.");
      return;
    }

    setIsLoggingIn(true);

    playSound(clickAudio);

    try {
      // =================================================
      // FastAPI OAuth2PasswordRequestForm
      // Backend expects form-urlencoded data
      // =================================================

      const loginData = new URLSearchParams();

      loginData.append(
        "username",
        formData.username.trim()
      );

      loginData.append(
        "password",
        formData.password
      );

      // Send login request to FastAPI
      const response = await api.post(
        "/auth/login",
        loginData,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("Login response:", response.data);

      // =================================================
      // SAVE JWT TOKEN
      // =================================================
      if (response.data.access_token) {
        localStorage.setItem(
          "token",
          response.data.access_token
        );
      }

      // =================================================
      // SAVE USER DATA IF AVAILABLE
      // =================================================
      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      // Success sound
      playSound(successAudio);

      // Go to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error.response?.data?.detail ||
        "Login failed. Please check your username and password.";

      setError(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleHover = () => {
    playSound(hoverAudio);
  };

  const handleClick = () => {
    playSound(clickAudio);
  };

  return (
    <div className="login-page">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        className="login-background"
        style={{
          backgroundImage: `url(${cyberLoginBackground})`,
        }}
      />

      <div className="login-background-overlay" />

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

      <motion.main
        className="login-main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55 }}
      >
        {/* ===================================================
            TOP TITLE
        ==================================================== */}

        <motion.div
          className="login-page-title"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
        >
          LOGIN
        </motion.div>

        {/* ===================================================
            MAIN LOGIN BOX
        ==================================================== */}

        <motion.section
          className="login-shell"
          initial={{ opacity: 0, y: 25, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* =================================================
              LEFT IMAGE SIDE
          ================================================== */}

          <div className="login-visual">
            <div className="login-visual-background" />

            <motion.img
              src={loginNinja}
              alt="CyberNinjas login ninja"
              className="login-ninja"
              initial={{
                opacity: 0,
                x: -35,
                scale: 0.94,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            />

            <div className="login-ninja-glow" />

            {/* Back button */}

            <motion.button
              type="button"
              className="login-back-button"
              onClick={() => {
                handleClick();
                navigate("/");
              }}
              onMouseEnter={handleHover}
              whileHover={{
                scale: 1.06,
                x: -2,
              }}
              whileTap={{
                scale: 0.94,
              }}
              aria-label="Go back"
            >
              <BackArrow />
            </motion.button>
          </div>

          {/* =================================================
              RIGHT FORM SIDE
          ================================================== */}

          <motion.div
            className="login-form-panel"
            initial={{
              opacity: 0,
              x: 25,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* subtle glow */}

            <div className="login-panel-glow" />

            {/* =================================================
                HEADER
            ================================================== */}

            <div className="login-header">
              <h1>
                WELCOME BACK,
                <span> NINJA!</span>
              </h1>

              <p>Log in to continue your journey</p>
            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              className="login-form"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* =================================================
                  ERROR MESSAGE
              ================================================== */}

              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              {/* ===============================================
                  EMAIL / USERNAME
              ================================================ */}

              <div className="login-field">
                <div className="login-input-wrapper">
                  <span className="login-input-icon">
                    <UserIcon />
                  </span>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Email or Username"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* ===============================================
                  PASSWORD
              ================================================ */}

              <div className="login-field">
                <div className="login-input-wrapper">
                  <span className="login-input-icon">
                    <LockIcon />
                  </span>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => {
                      handleClick();
                      setShowPassword((previous) => !previous);
                    }}
                    onMouseEnter={handleHover}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    <EyeIcon hidden={showPassword} />
                  </button>
                </div>
              </div>

              {/* ===============================================
                  REMEMBER + FORGOT
              ================================================ */}

              <div className="login-options">
                <label className="login-remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => {
                      handleClick();
                      setRememberMe(event.target.checked);
                    }}
                  />

                  <span className="login-custom-checkbox">
                    <span />
                  </span>

                  <span className="login-remember-text">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  className="login-forgot"
                  onClick={() => {
                    handleClick();
                    alert(
                      "Password recovery will be added later."
                    );
                  }}
                  onMouseEnter={handleHover}
                >
                  Forgot Password?
                </button>
              </div>

              {/* ===============================================
                  LOGIN BUTTON
              ================================================ */}

              <motion.button
                type="submit"
                className={`login-submit ${
                  isLoggingIn ? "is-loading" : ""
                }`}
                disabled={isLoggingIn}
                onMouseEnter={handleHover}
                whileHover={
                  !isLoggingIn
                    ? {
                        scale: 1.015,
                        y: -1,
                      }
                    : {}
                }
                whileTap={
                  !isLoggingIn
                    ? {
                        scale: 0.985,
                      }
                    : {}
                }
              >
                <span>
                  {isLoggingIn ? "ENTERING..." : "LOGIN"}
                </span>

                {!isLoggingIn && <ArrowIcon />}
              </motion.button>
            </form>

            {/* =================================================
                SOCIAL DIVIDER
            ================================================== */}

            <div className="login-social-section">
              <div className="login-divider">
                <span />
                <p>or continue with</p>
                <span />
              </div>

              <div className="login-social-buttons">
                {/* Apple */}

                <motion.button
                  type="button"
                  className="login-social-button"
                  onClick={handleClick}
                  onMouseEnter={handleHover}
                  whileHover={{
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                >
                  <img
                    src={appleIcon}
                    alt="Apple"
                  />

                  <span>Apple</span>
                </motion.button>

                {/* Google */}

                <motion.button
                  type="button"
                  className="login-social-button"
                  onClick={handleClick}
                  onMouseEnter={handleHover}
                  whileHover={{
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                >
                  <img
                    src={googleIcon}
                    alt="Google"
                  />

                  <span>Google</span>
                </motion.button>
              </div>
            </div>

            {/* =================================================
                SIGN UP
            ================================================== */}

            <div className="login-signup">
              <p>
                Don't have an account?
                <Link
                  to="/signup"
                  onClick={handleClick}
                  onMouseEnter={handleHover}
                >
                  {" "}
                  Sign UP
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.section>
      </motion.main>
    </div>
  );
}

export default Login;

