import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../services/api";

export default function UnitLessons() {
  const { unitId } = useParams();
  const navigate = useNavigate();

  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * Get the currently authenticated user first.
         * The api service automatically sends the JWT token.
         */
        const userResponse = await api.get("/auth/me");

        const currentUser = userResponse.data;

        if (!currentUser?.id) {
          navigate("/login");
          return;
        }

        console.log(
          "Fetching unit:",
          `/units/${unitId}`
        );

        /*
         * Get unit + lessons + user progress.
         */
        const response = await api.get(
          `/units/${unitId}/${currentUser.id}`
        );

        console.log("UNIT DATA:", response.data);

        const unitData = response.data;

        /*
         * IMPORTANT:
         *
         * A lesson is considered completed when:
         *
         * 1. Backend says is_completed === true
         *
         * OR
         *
         * 2. Backend progress_percent is 100 or more.
         *
         * This handles the case where the progress percentage
         * has reached 100% but is_completed has not been synced
         * yet in the response.
         */
        const isLessonCompleted = (lesson) => {
          const isCompleted =
            lesson?.progress?.is_completed === true;

          const progressPercent =
            Number(
              lesson?.progress?.progress_percent || 0
            );

          return (
            isCompleted ||
            progressPercent >= 100
          );
        };

        /*
         * Calculate sequential lesson locking.
         *
         * Lesson 1 -> Always available
         * Lesson 2 -> Available only after Lesson 1
         * Lesson 3 -> Available only after Lesson 2
         * etc.
         *
         * No lesson IDs are hardcoded.
         */
        if (unitData?.lessons?.length) {
          let previousCompleted = true;

          const updatedLessons =
            unitData.lessons.map(
              (lesson, index) => {
                const lessonCompleted =
                  isLessonCompleted(lesson);

                const isLocked =
                  index > 0 &&
                  !previousCompleted;

                const updatedLesson = {
                  ...lesson,

                  /*
                   * Keep the completion information
                   * consistent for the UI.
                   */
                  progress: lesson.progress
                    ? {
                        ...lesson.progress,
                        is_completed:
                          lessonCompleted,
                      }
                    : lesson.progress,

                  /*
                   * Override the backend lock state
                   * with our sequential flow.
                   */
                  is_locked: isLocked,
                };

                previousCompleted =
                  lessonCompleted;

                return updatedLesson;
              }
            );

          console.log(
            "UPDATED LESSONS:",
            updatedLessons
          );

          setUnit({
            ...unitData,
            lessons: updatedLessons,
          });
        } else {
          setUnit(unitData);
        }
      } catch (err) {
        console.error(
          "UNIT LESSONS ERROR:",
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

    if (!unitId) {
      setError("Unit not found.");
      setLoading(false);
      return;
    }

    fetchUnit();
  }, [unitId, navigate]);

  /*
   * The backend unit response contains the lessons.
   */
  const lessons = unit?.lessons || [];

  /*
   * IMPORTANT:
   *
   * Use both is_completed and progress_percent.
   *
   * This keeps the Unit Progress correct even if the backend
   * returns progress_percent = 100 while is_completed is not
   * synchronized yet.
   */
  const completedLessons = lessons.filter(
    (lesson) => {
      const completed =
        lesson.progress?.is_completed === true;

      const progressPercent =
        Number(
          lesson.progress?.progress_percent || 0
        );

      return (
        completed ||
        progressPercent >= 100
      );
    }
  ).length;

  const progress =
    lessons.length > 0
      ? Math.round(
          (completedLessons / lessons.length) * 100
        )
      : 0;

  if (loading) {
    return (
      <main className="unit-lessons-page">
        <div className="unit-lessons-bg-grid" />

        <div className="unit-lessons-glow unit-lessons-glow-one" />
        <div className="unit-lessons-glow unit-lessons-glow-two" />

        <motion.div
          className="unit-lessons-loading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="unit-ninja-loader">
            🥷
          </div>

          <h2>Loading Mission...</h2>

          <p>
            Preparing Unit {unitId}
          </p>
        </motion.div>
      </main>
    );
  }

  if (error || !unit) {
    return (
      <main className="unit-lessons-page">
        <div className="unit-lessons-bg-grid" />

        <motion.div
          className="unit-lessons-error"
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
        >
          <div className="unit-error-icon">
            ⚠️
          </div>

          <h2>Mission Unavailable</h2>

          <p>
            {error ||
              "Unable to load this unit."}
          </p>

          <button
            className="unit-back-button"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="unit-lessons-page">

      <div className="unit-lessons-bg-grid" />

      <div className="unit-lessons-glow unit-lessons-glow-one" />
      <div className="unit-lessons-glow unit-lessons-glow-two" />

      {/* =========================
          HEADER
      ========================= */}

      <section className="unit-lessons-header">

        <button
          className="unit-back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="unit-header-content">

          <div className="unit-badge">
            UNIT{" "}
            {unit.unit_number ||
              unit.id}
          </div>

          <h1>
            {unit.title_en ||
              `Unit ${
                unit.unit_number ||
                unit.id
              }`}
          </h1>

          {unit.title_ar && (
            <div className="unit-title-ar">
              {unit.title_ar}
            </div>
          )}

          {unit.description_en && (
            <p className="unit-description">
              {unit.description_en}
            </p>
          )}

          {unit.description_ar && (
            <p className="unit-description-ar">
              {unit.description_ar}
            </p>
          )}

        </div>

      </section>

      {/* =========================
          PROGRESS
      ========================= */}

      <section className="unit-progress-card">

        <div className="unit-progress-top">

          <div>
            <span className="unit-progress-label">
              UNIT PROGRESS
            </span>

            <strong>
              {completedLessons} /{" "}
              {lessons.length} Lessons
            </strong>
          </div>

          <span className="unit-progress-percent">
            {progress}%
          </span>

        </div>

        <div className="unit-progress-bar">
          <motion.div
            className="unit-progress-fill"
            initial={{ width: 0 }}
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          />
        </div>

      </section>

      {/* =========================
          LESSONS
      ========================= */}

      <section className="lessons-section">

        <div className="lessons-section-title">

          <div>
            <span>
              YOUR TRAINING
            </span>

            <h2>
              Lessons
            </h2>
          </div>

          <div className="lesson-count">
            {lessons.length} LESSONS
          </div>

        </div>

        {lessons.length === 0 ? (
          <div className="no-lessons">

            <div>📚</div>

            <h3>
              No lessons available
            </h3>

            <p>
              This unit does not have any
              lessons yet.
            </p>

          </div>
        ) : (
          <div className="lessons-list">

            {lessons.map(
              (lesson, index) => {

                const lessonNumber =
                  lesson.lesson_number ||
                  lesson.lesson_num ||
                  index + 1;

                /*
                 * A lesson is completed when
                 * either backend flag is true
                 * or progress reaches 100%.
                 */
                const completed =
                  lesson.progress
                    ?.is_completed === true ||
                  Number(
                    lesson.progress
                      ?.progress_percent || 0
                  ) >= 100;

                /*
                 * Locking is sequential.
                 *
                 * The first lesson is always
                 * available.
                 *
                 * Every following lesson
                 * depends on the previous one.
                 */
                const previousLesson =
                  lessons[index - 1];

                const previousCompleted =
                  index === 0 ||
                  previousLesson
                    ?.progress
                    ?.is_completed === true ||
                  Number(
                    previousLesson
                      ?.progress
                      ?.progress_percent || 0
                  ) >= 100;

                const locked =
                  !previousCompleted;

                return (
                  <motion.div
                    key={lesson.id}
                    className={`lesson-card ${
                      completed
                        ? "lesson-completed"
                        : ""
                    } ${
                      locked
                        ? "lesson-locked"
                        : ""
                    }`}
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.08,
                    }}
                    whileHover={
                      locked
                        ? {}
                        : {
                            y: -5,
                            scale: 1.01,
                          }
                    }
                    onClick={async () => {

                      /*
                       * Locked lessons cannot
                       * be opened.
                       */
                      if (locked) {
                        return;
                      }

                      try {
                        const userResponse =
                          await api.get(
                            "/auth/me"
                          );

                        const currentUser =
                          userResponse.data;

                        /*
                         * Start progress for
                         * this lesson.
                         *
                         * If progress already
                         * exists, backend
                         * returns existing
                         * progress.
                         */
                        await api.post(
                          "/progress/",
                          {
                            user_id:
                              currentUser.id,
                            level_id:
                              unit.level_id,
                            unit_id:
                              unit.id,
                            lesson_id:
                              lesson.id,
                          }
                        );
                      } catch (err) {
                        console.log(
                          "Progress start error:",
                          err
                        );
                      }

                      navigate(
                        `/lesson/${lesson.id}`
                      );
                    }}
                  >

                    <div className="lesson-number">
                      {completed
                        ? "✓"
                        : lessonNumber}
                    </div>

                    <div className="lesson-main">

                      {lesson.progress && (
                        <p>
                          Progress:
                          {" "}
                          {
                            lesson.progress
                              .progress_percent
                          }%
                        </p>
                      )}

                      <div className="lesson-kicker">
                        LESSON{" "}
                        {lessonNumber}
                      </div>

                      <h3>
                        {lesson.title_en ||
                          `Lesson ${
                            lessonNumber
                          }`}
                      </h3>

                      {lesson.title_ar && (
                        <div className="lesson-title-ar">
                          {lesson.title_ar}
                        </div>
                      )}

                      {lesson.description_en && (
                        <p>
                          {
                            lesson.description_en
                          }
                        </p>
                      )}

                    </div>

                    <div className="lesson-action">

                      {completed ? (
                        <span className="lesson-status completed">
                          COMPLETED
                        </span>
                      ) : locked ? (
                        <span className="lesson-status locked">
                          🔒 LOCKED
                        </span>
                      ) : (
                        <span className="lesson-play">
                          ▶
                        </span>
                      )}

                    </div>

                  </motion.div>
                );
              }
            )}

          </div>
        )}

      </section>

    </main>
  );
}