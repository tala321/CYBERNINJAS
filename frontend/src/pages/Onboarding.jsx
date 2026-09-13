import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// =========================================================
// API
// =========================================================

import api from "../services/api";

// =========================================================
// NINJAS
// =========================================================

const ninjas = [
  {
    id: 1,
    name: "Shadow",
    emoji: "🥷",
    color: "Purple",
    description: "Fast, focused, and ready for any cyber mission.",
  },
  {
    id: 2,
    name: "Byte",
    emoji: "🤖",
    color: "Blue",
    description: "Smart, curious, and always searching for new knowledge.",
  },
  {
    id: 3,
    name: "Spark",
    emoji: "⚡",
    color: "Yellow",
    description: "Brave, energetic, and never afraid of a challenge.",
  },
  {
    id: 4,
    name: "Pixel",
    emoji: "👾",
    color: "Green",
    description: "Creative, clever, and a master of digital worlds.",
  },
];

function Onboarding() {
  const navigate = useNavigate();

  const [selectedNinja, setSelectedNinja] = useState(ninjas[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // =======================================================
  // CONTINUE
  // CONNECT AVATAR TO BACKEND
  // =======================================================

  const handleContinue = async () => {
    if (isLoading) return;

    setError("");
    setIsLoading(true);

    try {
      // =====================================================
      // SAVE SELECTED AVATAR TO BACKEND
      // PUT /profile/me
      // =====================================================

      const response = await api.put("/profile/me", {
        avatar_id: selectedNinja.id,
      });

      console.log("Avatar updated:", response.data);

      // =====================================================
      // SAVE SELECTED AVATAR LOCALLY TOO
      // =====================================================

      localStorage.setItem(
        "selectedAvatarId",
        String(selectedNinja.id)
      );

      // =====================================================
      // UPDATE LOCAL USER DATA
      // =====================================================

      if (response.data) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        );
      }

      // =====================================================
      // GO TO DASHBOARD
      // =====================================================

      navigate("/dashboard");
    } catch (error) {
      console.error("Avatar update error:", error);

      const backendDetail =
        error.response?.data?.detail;

      let message =
        "We couldn't save your ninja choice. Please try again.";

      if (typeof backendDetail === "string") {
        message = backendDetail;
      } else if (Array.isArray(backendDetail)) {
        message =
          backendDetail
            .map((item) => item?.msg)
            .filter(Boolean)
            .join(", ") || message;
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="onboarding-page">
      {/* Background */}
      <div className="onboarding-background">
        <div className="onboarding-grid"></div>

        <div className="onboarding-orb onboarding-orb-one"></div>
        <div className="onboarding-orb onboarding-orb-two"></div>

        <div className="onboarding-stars">
          <span>✦</span>
          <span>✧</span>
          <span>✦</span>
          <span>·</span>
          <span>✧</span>
          <span>·</span>
        </div>
      </div>

      <div className="onboarding-container">
        {/* Top */}
        <motion.div
          className="onboarding-top"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="onboarding-logo">
            <span>🥷</span>
            <strong>
              CYBER<span>NINJAS</span>
            </strong>
          </Link>

          <div className="onboarding-progress">
            <div className="onboarding-progress-label">
              <span>YOUR NINJA JOURNEY</span>
              <span>STEP 1 OF 2</span>
            </div>

            <div className="onboarding-progress-track">
              <motion.div
                className="onboarding-progress-fill"
                initial={{ width: 0 }}
                animate={{ width: "50%" }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                }}
              ></motion.div>
            </div>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          className="onboarding-header"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.1,
          }}
        >
          <div className="onboarding-badge">
            🥷 NINJA TRAINING STARTS NOW
          </div>

          <h1>
            Choose Your
            <span> Ninja</span>
          </h1>

          <p>
            Every ninja has a unique style.
            <br />
            Pick the one that feels like you.
          </p>
        </motion.div>

        {/* Main */}
        <div className="onboarding-main">
          {/* Preview */}
          <motion.div
            className="ninja-preview-card"
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
          >
            <div className="preview-label">
              YOUR NINJA
            </div>

            <div className="preview-character-area">
              <div className="preview-glow"></div>

              <motion.div
                key={selectedNinja.id}
                className="preview-character"
                initial={{
                  opacity: 0,
                  scale: 0.75,
                  rotate: -8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 14,
                }}
              >
                {selectedNinja.emoji}
              </motion.div>

              <div className="preview-ring preview-ring-one"></div>
              <div className="preview-ring preview-ring-two"></div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNinja.id}
                className="preview-info"
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.25,
                }}
              >
                <h2>{selectedNinja.name}</h2>

                <span>
                  {selectedNinja.color} Ninja
                </span>

                <p>
                  {selectedNinja.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Selection */}
          <motion.div
            className="ninja-selection"
            initial={{
              opacity: 0,
              x: 35,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.3,
            }}
          >
            <div className="selection-header">
              <h2>Pick your ninja</h2>

              <span>
                {ninjas.length} available
              </span>
            </div>

            <div className="ninja-options">
              {ninjas.map((ninja) => {
                const isSelected =
                  selectedNinja.id === ninja.id;

                return (
                  <motion.button
                    key={ninja.id}
                    type="button"
                    className={`ninja-option ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedNinja(ninja);
                      setError("");
                    }}
                    whileHover={{
                      y: -5,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    disabled={isLoading}
                  >
                    <div className="ninja-option-character">
                      {ninja.emoji}
                    </div>

                    <div className="ninja-option-info">
                      <strong>{ninja.name}</strong>

                      <span>
                        {ninja.color} Ninja
                      </span>
                    </div>

                    <div className="ninja-check">
                      {isSelected ? "✓" : ""}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="selection-tip">
              <span>💡</span>

              <p>
                Don't worry! You can customize your ninja later.
              </p>
            </div>

            {/* API ERROR */}
            {error && (
              <div className="login-error onboarding-error">
                {error}
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          className="onboarding-bottom"
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.5,
          }}
        >
          <button
            type="button"
            className="onboarding-continue"
            onClick={handleContinue}
            disabled={isLoading}
          >
            <span>
              {isLoading
                ? "Saving Your Ninja..."
                : "Continue My Journey"}
            </span>

            <span className="continue-arrow">
              →
            </span>
          </button>

          <p className="onboarding-safe">
            <span>🛡️</span>

            Your ninja choice can be changed later
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Onboarding;