import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// =========================================================
// IMAGES
// C:\Users\Admin\CYBERNINJAS\frontend\src\assets\images
// =========================================================

import shadowImage from "../assets/images/shadow.png";
import kiraImage from "../assets/images/kira.png";
import blazeImage from "../assets/images/blaze.png";
import cyberImage from "../assets/images/cyber.png";
import novaImage from "../assets/images/nova.png";

// =========================================================
// SOUNDS
// C:\Users\Admin\CYBERNINJAS\frontend\src\assets\sounds
// =========================================================

import clickSound from "../assets/sounds/click.mp3";
import hoverSound from "../assets/sounds/hover.mp3";
import successSound from "../assets/sounds/success.mp3";

// =========================================================
// AVATAR DATA
// =========================================================

const avatarOptions = [
  {
    id: 1,
    name: "Shadow",
    image: shadowImage,
    description: "The silent cyber ninja",
  },
  {
    id: 2,
    name: "Kira",
    image: kiraImage,
    description: "The mysterious hacker",
  },
  {
    id: 3,
    name: "Blaze",
    image: blazeImage,
    description: "The fearless fighter",
  },
  {
    id: 4,
    name: "Cyber",
    image: cyberImage,
    description: "The digital master",
  },
  {
    id: 5,
    name: "Nova",
    image: novaImage,
    description: "The ultimate ninja",
  },
];

// =========================================================
// ONBOARDING STEPS
// =========================================================

const onboardingSteps = [
  {
    number: 1,
    label: "Choose Avatar",
  },
  {
    number: 2,
    label: "About You",
  },
  {
    number: 3,
    label: "Your Goals",
  },
  {
    number: 4,
    label: "All Set!",
  },
];

// =========================================================
// COMPONENT
// =========================================================

export default function AvatarCustomization() {
  const navigate = useNavigate();

  // ---------------------------------------------------------
  // STATE
  // ---------------------------------------------------------

  const [selectedAvatar, setSelectedAvatar] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [particles, setParticles] = useState([]);

  // ---------------------------------------------------------
  // REFS
  // ---------------------------------------------------------

  const hoverAudioRef = useRef(null);
  const clickAudioRef = useRef(null);
  const successAudioRef = useRef(null);

  const particleIdRef = useRef(0);
  const lastPointerTimeRef = useRef(0);

  // ---------------------------------------------------------
  // INITIALIZE AUDIO
  // ---------------------------------------------------------

  useEffect(() => {
    hoverAudioRef.current = new Audio(hoverSound);
    clickAudioRef.current = new Audio(clickSound);
    successAudioRef.current = new Audio(successSound);

    hoverAudioRef.current.volume = 0.18;
    clickAudioRef.current.volume = 0.28;
    successAudioRef.current.volume = 0.32;

    return () => {
      if (hoverAudioRef.current) {
        hoverAudioRef.current.pause();
        hoverAudioRef.current = null;
      }

      if (clickAudioRef.current) {
        clickAudioRef.current.pause();
        clickAudioRef.current = null;
      }

      if (successAudioRef.current) {
        successAudioRef.current.pause();
        successAudioRef.current = null;
      }
    };
  }, []);

  // ---------------------------------------------------------
  // LOAD SAVED AVATAR
  // ---------------------------------------------------------

  useEffect(() => {
    try {
      const savedAvatar = localStorage.getItem(
        "cyberninja_selected_avatar"
      );

      if (savedAvatar) {
        const parsedAvatar = Number(savedAvatar);

        const exists = avatarOptions.some(
          (avatar) => avatar.id === parsedAvatar
        );

        if (exists) {
          setSelectedAvatar(parsedAvatar);
        }
      }
    } catch (error) {
      console.warn("Unable to load saved avatar:", error);
    }
  }, []);

  // ---------------------------------------------------------
  // SOUND HELPERS
  // ---------------------------------------------------------

  const playSound = (audioRef) => {
    if (!audioRef.current) return;

    try {
      audioRef.current.currentTime = 0;

      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Browser may block audio until user interaction.
        });
      }
    } catch (error) {
      console.warn("Audio playback failed:", error);
    }
  };

  // ---------------------------------------------------------
  // HOVER SOUND
  // ---------------------------------------------------------

  const handleAvatarHover = () => {
    playSound(hoverAudioRef);
  };

  const handleNextHover = () => {
    playSound(hoverAudioRef);
  };

  // ---------------------------------------------------------
  // SELECT AVATAR
  // ---------------------------------------------------------

  const handleSelectAvatar = (avatarId) => {
    if (isTransitioning) return;

    setSelectedAvatar(avatarId);

    playSound(clickAudioRef);

    try {
      localStorage.setItem(
        "cyberninja_selected_avatar",
        String(avatarId)
      );

      const selectedAvatarData = avatarOptions.find(
        (avatar) => avatar.id === avatarId
      );

      if (selectedAvatarData) {
        localStorage.setItem(
          "cyberninja_selected_avatar_data",
          JSON.stringify({
            id: selectedAvatarData.id,
            name: selectedAvatarData.name,
            image: selectedAvatarData.image,
          })
        );
      }
    } catch (error) {
      console.warn("Unable to save avatar:", error);
    }
  };

  // ---------------------------------------------------------
  // NEXT BUTTON
  // ---------------------------------------------------------

  const handleNext = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    playSound(successAudioRef);

    try {
      localStorage.setItem(
        "cyberninja_onboarding_step",
        "2"
      );

      localStorage.setItem(
        "cyberninja_selected_avatar",
        String(selectedAvatar)
      );
    } catch (error) {
      console.warn("Unable to save onboarding data:", error);
    }

    /*
      IMPORTANT:
      This is the next onboarding page.

      If your existing React Router uses a different route
      for the "About You" page, change ONLY this path.
    */

    setTimeout(() => {
      navigate("/onboarding/about-you");
    }, 280);
  };

  // ---------------------------------------------------------
  // MOUSE / POINTER PARTICLES
  // ---------------------------------------------------------

  useEffect(() => {
    const handlePointerMove = (event) => {
      const now = Date.now();

      // Prevent creating too many particles.
      if (now - lastPointerTimeRef.current < 35) {
        return;
      }

      lastPointerTimeRef.current = now;

      // Only create particles occasionally.
      if (Math.random() > 0.72) {
        return;
      }

      const particleId = particleIdRef.current++;

      const particle = {
        id: particleId,
        x: event.clientX,
        y: event.clientY,
        size: Math.floor(Math.random() * 5) + 3,
        driftX: Math.floor(Math.random() * 30) - 15,
        driftY: Math.floor(Math.random() * 30) - 28,
        rotation: Math.floor(Math.random() * 360),
      };

      setParticles((previous) => {
        const next = [...previous, particle];

        // Keep the DOM light.
        return next.slice(-24);
      });

      window.setTimeout(() => {
        setParticles((previous) =>
          previous.filter((item) => item.id !== particleId)
        );
      }, 650);
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  // ---------------------------------------------------------
  // CURRENT AVATAR
  // ---------------------------------------------------------

  const currentAvatar =
    avatarOptions.find(
      (avatar) => avatar.id === selectedAvatar
    ) || avatarOptions[0];

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <div className="avatar-page onboarding-avatar-page">
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div className="avatar-bg-grid" />

      <div className="avatar-bg-glow avatar-bg-glow-left" />
      <div className="avatar-bg-glow avatar-bg-glow-right" />

      {/* =====================================================
          MOUSE PARTICLES
          ===================================================== */}

      <div className="avatar-mouse-particles">
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.span
              key={particle.id}
              className="avatar-mouse-particle"
              initial={{
                opacity: 0,
                scale: 0,
                x: particle.x,
                y: particle.y,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.4, 1, 0],
                x: particle.x + particle.driftX,
                y: particle.y + particle.driftY,
                rotate: particle.rotation,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.65,
                ease: "easeOut",
              }}
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* =====================================================
          PAGE TOP TITLE
          ===================================================== */}

      <header className="onboarding-page-header">
        <h1>Choose Avatar</h1>
      </header>

      {/* =====================================================
          MAIN ONBOARDING CARD
          ===================================================== */}

      <main className="onboarding-avatar-main">
        <motion.section
          className="onboarding-avatar-card"
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
            ease: "easeOut",
          }}
        >
          {/* =================================================
              STEPPER
              ================================================= */}

          <div className="onboarding-stepper">
            {onboardingSteps.map((step, index) => {
              const isActive = step.number === 1;

              return (
                <div
                  key={step.number}
                  className="onboarding-step-wrapper"
                >
                  <div className="onboarding-step">
                    <motion.div
                      className={`onboarding-step-circle ${
                        isActive ? "active" : ""
                      }`}
                      animate={
                        isActive
                          ? {
                              scale: [1, 1.04, 1],
                            }
                          : {}
                      }
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {step.number}
                    </motion.div>

                    <span
                      className={`onboarding-step-label ${
                        isActive ? "active" : ""
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {index < onboardingSteps.length - 1 && (
                    <div className="onboarding-step-line">
                      <span />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* =================================================
              CONTENT HEADER
              ================================================= */}

          <div className="choose-avatar-heading">
            <motion.h2
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.15,
                duration: 0.45,
              }}
            >
              CHOOSE YOUR{" "}
              <span>NINJA</span>
            </motion.h2>

            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.25,
                duration: 0.45,
              }}
            >
              Pick your ninja and begin your journey!
            </motion.p>
          </div>

          {/* =================================================
              AVATAR OPTIONS
              ================================================= */}

          <div className="choose-avatar-grid">
            {avatarOptions.map((avatar, index) => {
              const isSelected =
                selectedAvatar === avatar.id;

              return (
                <motion.button
                  key={avatar.id}
                  type="button"
                  className={`choose-avatar-option ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() =>
                    handleSelectAvatar(avatar.id)
                  }
                  onMouseEnter={handleAvatarHover}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.12 + index * 0.07,
                    duration: 0.45,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    y: -5,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  aria-label={`Choose ${avatar.name} ninja`}
                  aria-pressed={isSelected}
                >
                  {/* =========================================
                      NINJA IMAGE
                      ========================================= */}

                  <div className="choose-avatar-image-wrapper">
                    <motion.img
                      src={avatar.image}
                      alt={`${avatar.name} Ninja`}
                      className="choose-avatar-image"
                      draggable="false"
                      animate={
                        isSelected
                          ? {
                              y: [0, -4, 0],
                            }
                          : {
                              y: [0, -2, 0],
                            }
                      }
                      transition={{
                        duration: isSelected ? 2.8 : 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Selected glow */}
                    {isSelected && (
                      <motion.div
                        className="choose-avatar-selected-glow"
                        initial={{
                          opacity: 0,
                          scale: 0.7,
                        }}
                        animate={{
                          opacity: [0.45, 0.75, 0.45],
                          scale: [0.92, 1.05, 0.92],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}

                    {/* Selected check */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          className="choose-avatar-check"
                          initial={{
                            scale: 0,
                            opacity: 0,
                          }}
                          animate={{
                            scale: 1,
                            opacity: 1,
                          }}
                          exit={{
                            scale: 0,
                            opacity: 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 18,
                          }}
                        >
                          ✓
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* =========================================
                      NAME
                      ========================================= */}

                  <span
                    className={`choose-avatar-name ${
                      isSelected ? "selected" : ""
                    }`}
                  >
                    {avatar.name}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* =================================================
              NEXT BUTTON
              ================================================= */}

          <motion.button
            type="button"
            className="choose-avatar-next-button"
            onClick={handleNext}
            onMouseEnter={handleNextHover}
            disabled={isTransitioning}
            whileHover={{
              scale: 1.015,
              y: -2,
            }}
            whileTap={{
              scale: 0.985,
            }}
          >
            <span>
              {isTransitioning ? "LOADING..." : "NEXT"}
            </span>

            {!isTransitioning && (
              <motion.span
                className="choose-avatar-next-arrow"
                animate={{
                  x: [0, 4, 0],
                }}
                transition={{
                  duration: 1.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                →
              </motion.span>
            )}
          </motion.button>

          {/* =================================================
              BOTTOM MESSAGE
              ================================================= */}

          <p className="choose-avatar-customize-text">
            You can customize your ninja later!
          </p>

          {/* =================================================
              PAGINATION DOTS
              ================================================= */}

          <div
            className="onboarding-pagination"
            aria-label="Onboarding progress"
          >
            {onboardingSteps.map((step) => (
              <span
                key={step.number}
                className={`onboarding-pagination-dot ${
                  step.number === 1 ? "active" : ""
                }`}
              />
            ))}
          </div>
        </motion.section>
      </main>

      {/* =====================================================
          SCREEN READER STATUS
          ===================================================== */}

      <div
        className="sr-only"
        aria-live="polite"
      >
        Selected ninja: {currentAvatar.name}
      </div>
    </div>
  );
}