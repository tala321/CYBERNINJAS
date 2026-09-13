import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";
import OrangeParticles from "../components/OrangeParticles";
import api from "../services/api";

import ninjaMcq from "../assets/images/ninja-mcq.png";
import ninjaTF from "../assets/images/ninja-t-f.png";
import ninjaScenario from "../assets/images/ninja-sce.png";

import clickSound from "../assets/sounds/click.mp3";
import hoverSound from "../assets/sounds/hover.mp3";
import correctSound from "../assets/sounds/challenge-correct.mp3";
import wrongSound from "../assets/sounds/challenge-wrong.mp3";


/* =========================================================
   CYBERNINJAS - CHALLENGE
========================================================= */

function Challenge() {

  const navigate = useNavigate();

  const { challengeId } = useParams();


  /* =======================================================
     STATE
  ======================================================= */

  const [challenge, setChallenge] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState(null);


  /* =======================================================
     NORMAL ANSWER STATE
  ======================================================= */

  const [selectedOption, setSelectedOption] =
    useState(null);

  const [selectedOptions, setSelectedOptions] =
    useState([]);


  /* =======================================================
     DRAG & DROP STATE
  ======================================================= */

  const [draggedItem, setDraggedItem] =
    useState(null);

  const [dragPlacements, setDragPlacements] =
    useState({});

  const [dragMessage, setDragMessage] =
    useState("");


  /* =======================================================
     HINT
  ======================================================= */

  const [showHint, setShowHint] =
    useState(false);


  /* =======================================================
     MOUSE PARTICLES
  ======================================================= */

  const [mouseParticles, setMouseParticles] =
    useState([]);

  const particleIdRef =
    useRef(0);

  const lastParticleTime =
    useRef(0);


  /* =======================================================
     AUDIO
  ======================================================= */

  const clickAudio =
    useRef(null);

  const hoverAudio =
    useRef(null);

  const correctAudio =
    useRef(null);

  const wrongAudio =
    useRef(null);


  /* =======================================================
     CREATE AUDIO OBJECTS
  ======================================================= */

  useEffect(() => {

    clickAudio.current =
      new Audio(clickSound);

    hoverAudio.current =
      new Audio(hoverSound);

    correctAudio.current =
      new Audio(correctSound);

    wrongAudio.current =
      new Audio(wrongSound);


    clickAudio.current.volume = 0.35;
    hoverAudio.current.volume = 0.18;
    correctAudio.current.volume = 0.45;
    wrongAudio.current.volume = 0.4;


    return () => {

      [
        clickAudio.current,
        hoverAudio.current,
        correctAudio.current,
        wrongAudio.current,
      ].forEach((audio) => {

        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }

      });

    };

  }, []);


  /* =======================================================
     PLAY SOUND
  ======================================================= */

  const playSound = (
    audioRef
  ) => {

    if (!audioRef?.current) {
      return;
    }

    try {

      audioRef.current.currentTime = 0;

      const promise =
        audioRef.current.play();

      if (promise?.catch) {
        promise.catch(() => {});
      }

    } catch {
      // Ignore browser audio restrictions.
    }

  };


  /* =======================================================
     LOAD CHALLENGE
  ======================================================= */

  useEffect(() => {

    let mounted = true;


    async function fetchChallenge() {

      try {

        setLoading(true);
        setError("");
        setChallenge(null);

        setSelectedOption(null);
        setSelectedOptions([]);

        setSubmitted(false);
        setResult(null);

        setDraggedItem(null);
        setDragPlacements({});
        setDragMessage("");

        setShowHint(false);


        /* ================================================
           AUTHENTICATED USER
        ================================================= */

        const userResponse =
          await api.get("/auth/me");

        const currentUser =
          userResponse.data;


        if (!currentUser?.id) {

          navigate("/login");

          return;

        }


        /* ================================================
           CHALLENGE
        ================================================= */

        console.log(
          "Fetching challenge:",
          `/challenges/${challengeId}`
        );


        const response =
  await api.get(
    `/challenges/id/${challengeId}`
  );


        console.log(
          "CHALLENGE:",
          response.data
        );


        console.log(
          "CONTENT JSON:",
          response.data?.content_json
        );


        if (!mounted) {
          return;
        }


        setChallenge(
          response.data
        );


      } catch (err) {

        console.error(
          "CHALLENGE ERROR:",
          err
        );


        if (
          err?.response?.status === 401 ||
          err?.response?.status === 403
        ) {

          localStorage.removeItem(
            "token"
          );

          navigate("/login");

          return;

        }


        if (err?.response) {

          setError(
            err.response.data?.detail ||
            `Server error: ${err.response.status}`
          );

        } else if (err?.request) {

          setError(
            "Cannot connect to the CYBERNINJAS server."
          );

        } else {

          setError(
            err?.message ||
            "Failed loading challenge."
          );

        }

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }

    }


    if (!challengeId) {

      setError(
        "Challenge not found."
      );

      setLoading(false);

      return;

    }


    fetchChallenge();


    return () => {
      mounted = false;
    };

  }, [
    challengeId,
    navigate,
  ]);


  /* =======================================================
     CHALLENGE TYPE
  ======================================================= */

  const challengeType =
    String(
      challenge?.challenge_type ||
      challenge?.type ||
      ""
    ).toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/-/g, "_");


  const isDragDrop =
    challengeType === "drag_drop" ||
    challengeType === "dragdrop" ||
    challengeType === "sorting";


  const isTrueFalse =
    challengeType === "true_false" ||
    challengeType === "truefalse" ||
    challengeType === "true_false_question";


  const isScenario =
    challengeType === "scenario" ||
    challengeType === "situational";


  const isMCQ =
    !isDragDrop &&
    !isTrueFalse &&
    !isScenario;


  /* =======================================================
     CONTENT JSON
  ======================================================= */

  const content = useMemo(() => {

    if (!challenge?.content_json) {
      return {};
    }


    if (
      typeof challenge.content_json ===
      "string"
    ) {

      try {

        return JSON.parse(
          challenge.content_json
        );

      } catch {

        return {};

      }

    }


    if (
      typeof challenge.content_json ===
      "object"
    ) {

      return challenge.content_json;

    }


    return {};

  }, [challenge]);


  /* =======================================================
     QUESTION TEXT
  ======================================================= */

  const questionText =
    challenge?.question_text_en ||
    challenge?.question_en ||
    challenge?.text_en ||
    content?.question_en ||
    content?.question ||
    challenge?.question_text_ar ||
    challenge?.question_ar ||
    content?.question_ar ||
    "Challenge";


  const questionArabic =
    challenge?.question_text_ar ||
    challenge?.question_ar ||
    content?.question_ar ||
    "";


  /* =======================================================
     LESSON / LEVEL INFORMATION
  ======================================================= */

  const levelNumber =
    challenge?.level_number ||
    challenge?.level ||
    content?.level_number ||
    1;


  const unitNumber =
    challenge?.unit_number ||
    challenge?.unit ||
    content?.unit_number ||
    1;


  const lessonNumber =
    challenge?.lesson_number ||
    challenge?.lesson ||
    content?.lesson_number ||
    1;


  const challengeNumber =
    challenge?.challenge_number ||
    challenge?.challenge_index ||
    challenge?.order ||
    content?.challenge_number ||
    1;


  const totalChallenges =
    challenge?.total_challenges ||
    challenge?.lesson_total_challenges ||
    content?.total_challenges ||
    5;


  /* =======================================================
     DISPLAY TYPE
  ======================================================= */

  const displayType =
    isTrueFalse
      ? "TRUE / FALSE"
      : isScenario
      ? "SCENARIO"
      : isDragDrop
      ? "DRAG & DROP"
      : "MCQ";


  /* =======================================================
     NINJA IMAGE
  ======================================================= */

  const ninjaImage =
    isTrueFalse
      ? ninjaTF
      : isScenario
      ? ninjaScenario
      : ninjaMcq;


  /* =======================================================
     OPTIONS
  ======================================================= */

  const getOptions = () => {

    if (!challenge) {
      return [];
    }


    if (isDragDrop) {
      return [];
    }


    if (
      Array.isArray(
        challenge.options
      )
    ) {

      return challenge.options;

    }


    if (
      Array.isArray(
        content.options
      )
    ) {

      return content.options;

    }


    if (
      Array.isArray(
        content.answers
      )
    ) {

      return content.answers;

    }


    return [];

  };


  const options =
    getOptions();


  /* =======================================================
     MULTI SELECT
  ======================================================= */

  const isMultiSelect =
    !isDragDrop &&
    options.filter(
      (option) =>
        option &&
        typeof option === "object" &&
        Boolean(option.is_correct)
    ).length > 1;


  /* =======================================================
     OPTION ID
  ======================================================= */

  const getOptionId = (
    option,
    index
  ) => {

    if (
      typeof option === "string"
    ) {

      return index;

    }


    return (
      option?.id ??
      option?.option_id ??
      option?.value ??
      index
    );

  };


  /* =======================================================
     OPTION TEXT
  ======================================================= */

  const getOptionText = (
    option
  ) => {

    if (
      typeof option === "string"
    ) {

      return option;

    }


    if (!option) {
      return "";
    }


    return (
      option.option_text_en ||
      option.option_text_ar ||
      option.text_en ||
      option.text_ar ||
      option.label_en ||
      option.label_ar ||
      option.option_en ||
      option.option_ar ||
      option.text ||
      option.label ||
      option.name_en ||
      option.name_ar ||
      option.title_en ||
      option.title_ar ||
      ""
    );

  };


  /* =======================================================
     SELECT OPTION
  ======================================================= */

  const handleOptionSelect = (
    optionId
  ) => {

    if (submitted) {
      return;
    }


    playSound(
      clickAudio
    );


    if (isMultiSelect) {

      setSelectedOptions(
        (previous) => {

          const id =
            String(optionId);


          if (
            previous.some(
              (selected) =>
                String(selected) === id
            )
          ) {

            return previous.filter(
              (selected) =>
                String(selected) !== id
            );

          }


          return [
            ...previous,
            optionId,
          ];

        }
      );


      return;

    }


    setSelectedOption(
      optionId
    );

  };


  /* =======================================================
     DRAG ITEMS
  ======================================================= */

  const getDragItems = () => {

    if (!content) {
      return [];
    }


    const possibleItems = [

      content.items,

      content.drag_items,

      content.draggable_items,

      content.cards,

      content.elements,

      content.questions,

      content.options,

    ];


    for (
      const collection
      of possibleItems
    ) {

      if (
        Array.isArray(collection) &&
        collection.length > 0
      ) {

        return collection;

      }

    }


    return [];

  };


  /* =======================================================
     DRAG CATEGORIES
  ======================================================= */

  const getDragCategories = () => {

    if (!content) {
      return [];
    }


    const possibleCategories = [

      content.categories,

      content.drop_zones,

      content.dropzones,

      content.zones,

      content.targets,

      content.groups,

    ];


    for (
      const collection
      of possibleCategories
    ) {

      if (
        Array.isArray(collection) &&
        collection.length > 0
      ) {

        return collection;

      }

    }


    const objectCategories =
      content.categories ||
      content.drop_zones ||
      content.zones ||
      content.targets;


    if (
      objectCategories &&
      typeof objectCategories ===
        "object" &&
      !Array.isArray(objectCategories)
    ) {

      return Object.entries(
        objectCategories
      ).map(
        (
          [key, value],
          index
        ) => ({

          id: key,

          key,

          name: value,

          title: value,

          sort_order: index,

        })
      );

    }


    return [];

  };


  const dragItems =
    getDragItems();


  const dragCategories =
    getDragCategories();


  /* =======================================================
     DRAG ITEM ID
  ======================================================= */

  const getDragItemId = (
    item,
    index
  ) => {

    if (
      typeof item === "string"
    ) {

      return item;

    }


    return (
      item?.id ??
      item?.item_id ??
      item?.key ??
      item?.value ??
      item?.text_en ??
      item?.text_ar ??
      index
    );

  };


  /* =======================================================
     DRAG ITEM TEXT
  ======================================================= */

  const getDragItemText = (
    item
  ) => {

    if (
      typeof item === "string"
    ) {

      return item;

    }


    return (
      item?.text_en ||
      item?.text_ar ||
      item?.label_en ||
      item?.label_ar ||
      item?.name_en ||
      item?.name_ar ||
      item?.title_en ||
      item?.title_ar ||
      item?.value ||
      ""
    );

  };


  /* =======================================================
     CATEGORY ID
  ======================================================= */

  const getCategoryId = (
    category,
    index
  ) => {

    if (
      typeof category === "string"
    ) {

      return category;

    }


    return (
      category?.id ??
      category?.key ??
      category?.value ??
      index
    );

  };


  /* =======================================================
     CATEGORY TEXT
  ======================================================= */

  const getCategoryText = (
    category
  ) => {

    if (
      typeof category === "string"
    ) {

      return category;

    }


    return (
      category?.text_en ||
      category?.text_ar ||
      category?.label_en ||
      category?.label_ar ||
      category?.name_en ||
      category?.name_ar ||
      category?.title_en ||
      category?.title_ar ||
      category?.name ||
      category?.title ||
      ""
    );

  };


  /* =======================================================
     PLACED ITEMS
  ======================================================= */

  const getPlacedItems = () => {

    return Object.values(
      dragPlacements
    ).flatMap(
      (items) =>
        Array.isArray(items)
          ? items.map(String)
          : []
    );

  };


  /* =======================================================
     DRAG START
  ======================================================= */

  const handleDragStart = (
    event,
    itemId
  ) => {

    if (submitted) {
      return;
    }


    const id =
      String(itemId);


    setDraggedItem(id);


    setDragMessage(
      "Choose where this item belongs."
    );


    try {

      event.dataTransfer.effectAllowed =
        "move";

      event.dataTransfer.setData(
        "text/plain",
        id
      );

    } catch {
      // Browser drag API may be unavailable.
    }

  };


  /* =======================================================
     DRAG END
  ======================================================= */

  const handleDragEnd = () => {

    if (!submitted) {

      setDraggedItem(
        null
      );

    }

  };


  /* =======================================================
     DROP
  ======================================================= */

  const handleDrop = (
    event,
    categoryId
  ) => {

    event?.preventDefault?.();


    if (
      submitted ||
      !draggedItem
    ) {

      return;

    }


    const itemId =
      String(draggedItem);


    const targetId =
      String(categoryId);


    setDragPlacements(
      (previous) => {

        const updated = {
          ...previous,
        };


        Object.keys(
          updated
        ).forEach(
          (key) => {

            updated[key] =
              Array.isArray(
                updated[key]
              )
                ? updated[key].filter(
                    (id) =>
                      String(id) !==
                      itemId
                  )
                : [];

          }
        );


        if (
          !Array.isArray(
            updated[targetId]
          )
        ) {

          updated[targetId] =
            [];

        }


        updated[targetId].push(
          itemId
        );


        return updated;

      }
    );


    setDraggedItem(
      null
    );


    setDragMessage("");

    playSound(
      clickAudio
    );

  };


  /* =======================================================
     CATEGORY CLICK
  ======================================================= */

  const handleCategoryClick = (
    categoryId
  ) => {

    if (
      submitted ||
      !draggedItem
    ) {

      return;

    }


    handleDrop(
      {
        preventDefault: () => {},
      },
      categoryId
    );

  };


  /* =======================================================
     REMOVE DRAG ITEM
  ======================================================= */

  const removeDragItem = (
    itemId
  ) => {

    if (submitted) {
      return;
    }


    const targetId =
      String(itemId);


    setDragPlacements(
      (previous) => {

        const updated = {
          ...previous,
        };


        Object.keys(
          updated
        ).forEach(
          (categoryId) => {

            updated[categoryId] =
              Array.isArray(
                updated[categoryId]
              )
                ? updated[
                    categoryId
                  ].filter(
                    (id) =>
                      String(id) !==
                      targetId
                  )
                : [];

          }
        );


        return updated;

      }
    );


    playSound(
      clickAudio
    );

  };


  /* =======================================================
     CLICK TO PLACE
  ======================================================= */

  const handleDragItemClick = (
    itemId
  ) => {

    if (submitted) {
      return;
    }


    const id =
      String(itemId);


    if (
      getPlacedItems().includes(id)
    ) {

      removeDragItem(id);

      return;

    }


    if (
      dragCategories.length === 1
    ) {

      const categoryId =
        getCategoryId(
          dragCategories[0],
          0
        );


      handleDrop(
        {
          preventDefault: () => {},
        },
        categoryId
      );


      return;

    }


    setDraggedItem(id);


    setDragMessage(
      "Now choose a category."
    );


    playSound(
      clickAudio
    );

  };


  /* =======================================================
     DRAG COMPLETE
  ======================================================= */

  const isDragComplete = () => {

    if (
      dragItems.length === 0
    ) {

      return false;

    }


    const placedIds =
      getPlacedItems();


    return dragItems.every(
      (item, index) =>
        placedIds.includes(
          String(
            getDragItemId(
              item,
              index
            )
          )
        )
    );

  };


  /* =======================================================
     BUILD DRAG ANSWER
  ======================================================= */

  const buildDragAnswer = () => {

    const answer = {};


    dragCategories.forEach(
      (
        category,
        categoryIndex
      ) => {

        const categoryId =
          getCategoryId(
            category,
            categoryIndex
          );


        const placed =
          Array.isArray(
            dragPlacements[
              categoryId
            ]
          )
            ? dragPlacements[
                categoryId
              ]
            : [];


        answer[categoryId] =
          placed.map(
            (itemId) => {

              const itemIndex =
                dragItems.findIndex(
                  (
                    item,
                    index
                  ) =>
                    String(
                      getDragItemId(
                        item,
                        index
                      )
                    ) ===
                    String(itemId)
                );


              if (
                itemIndex === -1
              ) {

                return String(
                  itemId
                );

              }


              const item =
                dragItems[
                  itemIndex
                ];


              if (
                typeof item ===
                "string"
              ) {

                return item;

              }


              return (
                item?.text_en ??
                item?.text_ar ??
                item?.label_en ??
                item?.label_ar ??
                item?.name_en ??
                item?.name_ar ??
                item?.title_en ??
                item?.title_ar ??
                item?.value ??
                item?.key ??
                String(itemId)
              );

            }
          );

      }
    );


    console.log(
      "DRAG ANSWER PAYLOAD:",
      answer
    );


    return answer;

  };


  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async () => {

    /* ================================================
       DRAG VALIDATION
    ================================================= */

    if (isDragDrop) {

      if (
        !isDragComplete()
      ) {

        setDragMessage(
          "Place all items into a category before checking."
        );

        return;

      }

    } else if (
      isMultiSelect
        ? selectedOptions.length === 0
        : selectedOption === null
    ) {

      return;

    }


    if (submitting) {
      return;
    }


    try {

      setSubmitting(true);

      setError("");

      setDragMessage("");


      /* ================================================
         CURRENT USER
      ================================================= */

      const userResponse =
        await api.get(
          "/auth/me"
        );


      const currentUser =
        userResponse.data;


      if (!currentUser?.id) {

        navigate("/login");

        return;

      }


      /* ================================================
         BASE PAYLOAD
      ================================================= */

      let submitData = {

        user_id:
          Number(
            currentUser.id
          ),

      };


      /* ================================================
         DRAG & DROP
      ================================================= */

      if (isDragDrop) {

        submitData.answer_data =
          buildDragAnswer();

      }


      /* ================================================
         NORMAL QUESTIONS
      ================================================= */

      else {

        const selectedIds =
          isMultiSelect
            ? selectedOptions
            : [selectedOption];


        const selectedOptionsData =
          selectedIds
            .map(
              (selectedId) =>
                options.find(
                  (
                    option,
                    index
                  ) =>
                    String(
                      getOptionId(
                        option,
                        index
                      )
                    ) ===
                    String(
                      selectedId
                    )
                )
            )
            .filter(Boolean);


        /* ==========================================
           MULTI SELECT
        ========================================== */

        if (isMultiSelect) {

          submitData.answer_data =
            selectedOptionsData.map(
              (
                option,
                index
              ) => {

                if (
                  option &&
                  typeof option ===
                    "object" &&
                  option.id !==
                    undefined
                ) {

                  return Number(
                    option.id
                  );

                }


                return selectedIds[
                  index
                ];

              }
            );

        }


        /* ==========================================
           SINGLE SELECT
        ========================================== */

        else {

          const selected =
            selectedOptionsData[0];


          if (
            selected &&
            typeof selected ===
              "object" &&
            selected.id !==
              undefined
          ) {

            submitData.selected_option_id =
              Number(
                selected.id
              );

          } else {

            submitData.answer_data =
              selectedOption;

          }

        }

      }


      console.log(
        "Submitting challenge:",
        {
          challenge_id:
            challengeId,

          challenge_type:
            challengeType,

          ...submitData,
        }
      );


      /* ================================================
         SEND TO BACKEND
      ================================================= */

      const response =
        await api.post(
          `/challenges/${challengeId}/submit`,
          submitData
        );


      console.log(
        "SUBMIT RESULT:",
        response.data
      );


      const submissionResult =
        response.data;


      setResult(
        submissionResult
      );


      setSubmitted(
        true
      );


      /* ================================================
         RESULT SOUND
      ================================================= */

      if (
        submissionResult?.correct
      ) {

        playSound(
          correctAudio
        );

      } else {

        playSound(
          wrongAudio
        );

      }


    } catch (err) {

      console.error(
        "SUBMIT ERROR:",
        err
      );


      if (
        err?.response?.status ===
          401 ||
        err?.response?.status ===
          403
      ) {

        localStorage.removeItem(
          "token"
        );

        navigate("/login");

        return;

      }


      if (err?.response) {

        setError(
          err.response.data?.detail ||
          `Server error: ${err.response.status}`
        );

      } else if (
        err?.request
      ) {

        setError(
          "Cannot connect to the CYBERNINJAS server."
        );

      } else {

        setError(
          err?.message ||
          "Failed submitting challenge."
        );

      }

    } finally {

      setSubmitting(
        false
      );

    }

  };


  /* =======================================================
     NEXT CHALLENGE
  ======================================================= */

  const handleNext = async () => {

    if (!submitted) {
      return;
    }


    playSound(
      clickAudio
    );


    /* ================================================
       BACKEND NEXT CHALLENGE
    ================================================= */

    if (
      result?.next_challenge_id
    ) {

      navigate(
        `/challenge/${result.next_challenge_id}`
      );

      return;

    }


    /* ================================================
       LESSON FINISHED
    ================================================= */

    if (
      challenge?.lesson_id
    ) {

      try {

        const userResponse =
          await api.get(
            "/auth/me"
          );


        const currentUser =
          userResponse.data;


        if (!currentUser?.id) {

          navigate("/login");

          return;

        }


        const lessonResponse =
          await api.get(
            `/lessons/${challenge.lesson_id}/${currentUser.id}`
          );


        const lessonData =
          lessonResponse.data;


        const unitId =
          lessonData?.unit_id;


        if (unitId) {

          navigate(
            `/unit/${unitId}`
          );

          return;

        }

      } catch (err) {

        console.error(
          "RETURN TO UNIT ERROR:",
          err
        );


        if (
          err?.response?.status ===
            401 ||
          err?.response?.status ===
            403
        ) {

          localStorage.removeItem(
            "token"
          );

          navigate("/login");

          return;

        }

      }


      /* ================================================
         FALLBACK
      ================================================= */

      navigate(
        `/lesson/${challenge.lesson_id}`
      );

      return;

    }


    /* ================================================
       LAST FALLBACK
    ================================================= */

    navigate(-1);

  };


  /* =======================================================
     BACK
  ======================================================= */

  const handleBack = () => {

    playSound(
      clickAudio
    );


    navigate(-1);

  };


  /* =======================================================
     HINT
  ======================================================= */

  const hintText =
    challenge?.hint_en ||
    challenge?.hint ||
    content?.hint_en ||
    content?.hint ||
    "Think carefully and choose the safest answer.";


  const handleHint = () => {

    setShowHint(
      (previous) =>
        !previous
    );


    playSound(
      clickAudio
    );

  };


  /* =======================================================
     MOUSE PARTICLES
  ======================================================= */

  useEffect(() => {

    const handleMouseMove =
      (event) => {

        const now =
          Date.now();


        if (
          now -
            lastParticleTime.current <
          55
        ) {

          return;

        }


        lastParticleTime.current =
          now;


        const id =
          particleIdRef.current++;


        const particle = {

          id,

          x: event.clientX,

          y: event.clientY,

          size:
            3 +
            Math.random() *
              5,

          dx:
            (
              Math.random() -
              0.5
            ) *
            28,

          dy:
            -8 -
            Math.random() *
              30,

        };


        setMouseParticles(
          (previous) => [
            ...previous.slice(
              -15
            ),
            particle,
          ]
        );

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


  /* =======================================================
     HOVER SOUND
  ======================================================= */

  const handleHoverSound = () => {

    if (
      Math.random() >
      0.45
    ) {

      return;

    }


    playSound(
      hoverAudio
    );

  };


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (

      <div className="challenge-page challenge-loading">

        <div className="challenge-background-grid" />

        <div className="challenge-glow challenge-glow-one" />

        <div className="challenge-glow challenge-glow-two" />


        <motion.div
          className="challenge-loading-ninja"
          animate={{
            y: [
              0,
              -12,
              0,
            ],

            rotate: [
              -3,
              3,
              -3,
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >

          <img
            src={ninjaMcq}
            alt="CyberNinja"
          />

        </motion.div>


        <h2>
          Preparing Challenge...
        </h2>


        <p>
          Challenge {challengeId}
        </p>

      </div>

    );

  }


  /* =======================================================
     ERROR
  ======================================================= */

  if (
    error ||
    !challenge
  ) {

    return (

      <div className="challenge-page challenge-error">

        <div className="challenge-background-grid" />

        <div className="challenge-glow challenge-glow-one" />

        <div className="challenge-glow challenge-glow-two" />


        <motion.div
          className="challenge-error-card"
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >

          <div className="challenge-error-icon">
            ⚠️
          </div>


          <h2>
            Challenge Error
          </h2>


          <p>
            {error ||
              "Challenge could not be loaded."}
          </p>


          <button
            className="challenge-next-button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </motion.div>

      </div>

    );

  }


  /* =======================================================
     RESULT
  ======================================================= */

  const isCorrect =
    Boolean(
      result?.correct
    );


  /* =======================================================
     RETURN
  ======================================================= */

  return (
    

    <div className="challenge-page">


      {/* =================================================
          BACKGROUND
      ================================================== */}

      <div className="challenge-background-grid" />

      <div className="challenge-glow challenge-glow-one" />

      <div className="challenge-glow challenge-glow-two" />

      <OrangeParticles />


      {/* =================================================
          MOUSE PARTICLES
      ================================================== */}

      <div className="challenge-mouse-particles">

        <AnimatePresence>

          {mouseParticles.map(
            (particle) => (

              <motion.span
                key={particle.id}
                className="challenge-mouse-particle"

                initial={{
                  opacity: 0.9,

                  x:
                    particle.x,

                  y:
                    particle.y,

                  scale: 1,
                }}

                animate={{
                  opacity: 0,

                  x:
                    particle.x +
                    particle.dx,

                  y:
                    particle.y +
                    particle.dy,

                  scale: 0,
                }}

                transition={{
                  duration:
                    0.55,

                  ease:
                    "easeOut",
                }}

                style={{
                  width:
                    particle.size,

                  height:
                    particle.size,
                }}

              />

            )
          )}

        </AnimatePresence>

      </div>


      {/* =================================================
          HEADER
      ================================================== */}

      <header className="challenge-header">


        <button
          className="challenge-back-button"
          onClick={handleBack}
          onMouseEnter={
            handleHoverSound
          }
        >

          <span>
            ←
          </span>

          <span>
            Back
          </span>

        </button>


        <div className="challenge-brand">

          CYBER
          <strong>
            NINJAS
          </strong>

        </div>


        <div className="challenge-xp">

          ⚡

          <span>
            XP
          </span>

          {result?.xp_earned
            ? ` +${result.xp_earned}`
            : ""}

        </div>


      </header>


      {/* =================================================
          MAIN
      ================================================== */}

      <main className="challenge-main">


        {/* =================================================
            TOP INFORMATION
        ================================================== */}

        <div className="challenge-top">


          <div>

            <div className="challenge-kicker">

              LEVEL {String(levelNumber).padStart(2, "0")}
              {" • "}
              UNIT {String(unitNumber).padStart(2, "0")}
              {" • "}
              LESSON {String(lessonNumber).padStart(2, "0")}

            </div>


            <h1>
              Challenge {challengeNumber}/{totalChallenges}
            </h1>

          </div>


          <div className="challenge-type">

            {displayType}

          </div>


        </div>


        {/* =================================================
            PROGRESS
        ================================================== */}

        <div className="challenge-progress">

          <div className="challenge-progress-track">

            <motion.div
              className="challenge-progress-fill"

              initial={{
                width: 0,
              }}

              animate={{
                width:
                  `${Math.min(
                    100,
                    Math.max(
                      0,
                      (
                        Number(
                          challengeNumber
                        ) /
                        Number(
                          totalChallenges
                        )
                      ) *
                        100
                    )
                  )}%`,
              }}

              transition={{
                duration: 0.8,
              }}
            />

          </div>

        </div>


        {/* =================================================
            CHALLENGE CARD
        ================================================== */}

        <motion.section
          className={`challenge-card ${
            submitted
              ? isCorrect
                ? "challenge-card-correct"
                : "challenge-card-wrong"
              : ""
          }`}

          initial={{
            opacity: 0,
            y: 30,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.55,
          }}
        >


          {/* =================================================
              QUESTION AREA
          ================================================== */}

          <div className="challenge-question-area">


            <div className="challenge-question-number">

              CHALLENGE {challengeNumber}

            </div>


            <h2>
              {questionText}
            </h2>


            {questionArabic && (
              <p className="challenge-question-ar">

                {questionArabic}

              </p>
            )}


          </div>


          {/* =================================================
              VISUAL AREA
          ================================================== */}

          <div className="challenge-visual">


            <motion.div
              className="challenge-ninja-wrapper"

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

              <img
                src={ninjaImage}
                alt="CyberNinja Challenge"
                className="challenge-ninja-image"
              />

            </motion.div>


          </div>


          {/* =================================================
              ANSWER AREA
          ================================================== */}

          <div className="challenge-answer-area">


            {/* =================================================
                TRUE / FALSE
            ================================================== */}

            {isTrueFalse && (

              <div className="challenge-true-false">


                <motion.button
                  className={`challenge-tf-button true ${
                    (
                      isMultiSelect
                        ? selectedOptions.includes(
                            true
                          )
                        : String(
                            selectedOption
                          ).toLowerCase() ===
                          "true"
                    )
                      ? "selected"
                      : ""
                  }`}

                  onClick={() =>
                    handleOptionSelect(
                      "true"
                    )
                  }

                  disabled={
                    submitted
                  }

                  whileHover={
                    !submitted
                      ? {
                          scale: 1.025,
                        }
                      : {}
                  }

                  whileTap={
                    !submitted
                      ? {
                          scale: 0.97,
                        }
                      : {}
                  }

                  onMouseEnter={
                    handleHoverSound
                  }
                >

                  <span className="tf-icon">
                    ✓
                  </span>

                  <span>
                    True
                  </span>

                </motion.button>


                <motion.button
                  className={`challenge-tf-button false ${
                    (
                      isMultiSelect
                        ? selectedOptions.includes(
                            false
                          )
                        : String(
                            selectedOption
                          ).toLowerCase() ===
                          "false"
                    )
                      ? "selected"
                      : ""
                  }`}

                  onClick={() =>
                    handleOptionSelect(
                      "false"
                    )
                  }

                  disabled={
                    submitted
                  }

                  whileHover={
                    !submitted
                      ? {
                          scale: 1.025,
                        }
                      : {}
                  }

                  whileTap={
                    !submitted
                      ? {
                          scale: 0.97,
                        }
                      : {}
                  }

                  onMouseEnter={
                    handleHoverSound
                  }
                >

                  <span className="tf-icon">
                    ✕
                  </span>

                  <span>
                    False
                  </span>

                </motion.button>


              </div>

            )}


            {/* =================================================
                SCENARIO / MCQ
            ================================================== */}

            {!isTrueFalse &&
              !isDragDrop && (

                <div className="challenge-options">


                  {options.length > 0 ? (

                    options.map(
                      (
                        option,
                        index
                      ) => {

                        const optionId =
                          getOptionId(
                            option,
                            index
                          );


                        const optionText =
                          getOptionText(
                            option
                          );


                        const isSelected =
                          isMultiSelect
                            ? selectedOptions.some(
                                (
                                  selected
                                ) =>
                                  String(
                                    selected
                                  ) ===
                                  String(
                                    optionId
                                  )
                              )
                            : String(
                                selectedOption
                              ) ===
                              String(
                                optionId
                              );


                        const isCorrectOption =
                          Boolean(
                            option?.is_correct
                          );


                        let optionClass =
                          "challenge-option";


                        if (
                          isSelected
                        ) {

                          optionClass +=
                            " selected";

                        }


                        if (
                          submitted &&
                          isCorrectOption
                        ) {

                          optionClass +=
                            " correct";

                        }


                        if (
                          submitted &&
                          isSelected &&
                          !isCorrectOption
                        ) {

                          optionClass +=
                            " wrong";

                        }


                        return (

                          <motion.button
                            key={
                              String(
                                optionId
                              )
                            }

                            className={
                              optionClass
                            }

                            onClick={() =>
                              handleOptionSelect(
                                optionId
                              )
                            }

                            disabled={
                              submitted
                            }

                            whileHover={
                              !submitted
                                ? {
                                    scale: 1.012,
                                  }
                                : {}
                            }

                            whileTap={
                              !submitted
                                ? {
                                    scale: 0.985,
                                  }
                                : {}
                            }

                            onMouseEnter={
                              handleHoverSound
                            }
                          >


                            <span className="option-letter">

                              {String.fromCharCode(
                                65 + index
                              )}

                            </span>


                            <span className="option-text">

                              {optionText}

                            </span>


                            {submitted &&
                              isCorrectOption && (

                                <span className="option-check">

                                  ✓

                                </span>

                              )}


                            {submitted &&
                              isSelected &&
                              !isCorrectOption && (

                                <span className="option-wrong">

                                  ✕

                                </span>

                              )}

                          </motion.button>

                        );

                      }
                    )

                  ) : (

                    <div className="challenge-no-options">

                      No answer options
                      available.

                    </div>

                  )}

                </div>

              )}


            {/* =================================================
                DRAG & DROP
            ================================================== */}

            {isDragDrop && (

              <div className="challenge-drag-drop">


                <div className="challenge-drag-items">


                  {dragItems.map(
                    (
                      item,
                      index
                    ) => {

                      const itemId =
                        String(
                          getDragItemId(
                            item,
                            index
                          )
                        );


                      const placed =
                        getPlacedItems().includes(
                          itemId
                        );


                      return (

                        <motion.button
                          key={
                            itemId
                          }

                          className={`challenge-drag-item ${
                            placed
                              ? "placed"
                              : ""
                          } ${
                            String(
                              draggedItem
                            ) ===
                            itemId
                              ? "dragging"
                              : ""
                          }`}

                          draggable={
                            !submitted
                          }

                          onDragStart={(event) =>
                            handleDragStart(
                              event,
                              itemId
                            )
                          }

                          onDragEnd={
                            handleDragEnd
                          }

                          onClick={() =>
                            handleDragItemClick(
                              itemId
                            )
                          }

                          disabled={
                            submitted
                          }

                          whileHover={
                            !submitted
                              ? {
                                  y: -3,
                                }
                              : {}
                          }

                          whileTap={
                            !submitted
                              ? {
                                  scale: 0.97,
                                }
                              : {}
                          }

                          onMouseEnter={
                            handleHoverSound
                          }
                        >

                          {getDragItemText(
                            item
                          )}

                        </motion.button>

                      );

                    }
                  )}

                </div>


                <div className="challenge-drop-zones">


                  {dragCategories.map(
                    (
                      category,
                      categoryIndex
                    ) => {

                      const categoryId =
                        getCategoryId(
                          category,
                          categoryIndex
                        );


                      const placed =
                        Array.isArray(
                          dragPlacements[
                            categoryId
                          ]
                        )
                          ? dragPlacements[
                              categoryId
                            ]
                          : [];


                      return (

                        <motion.div
                          key={
                            String(
                              categoryId
                            )
                          }

                          className={`challenge-drop-zone ${
                            draggedItem
                              ? "drop-ready"
                              : ""
                          }`}

                          onDragOver={(event) =>
                            event.preventDefault()
                          }

                          onDrop={(event) =>
                            handleDrop(
                              event,
                              categoryId
                            )
                          }

                          onClick={() =>
                            handleCategoryClick(
                              categoryId
                            )
                          }

                          whileHover={{
                            scale: 1.01,
                          }}
                        >


                          <div className="challenge-drop-zone-header">

                            <span className="drop-zone-icon">
                              ◈
                            </span>


                            <strong>
                              {getCategoryText(
                                category
                              )}
                            </strong>

                          </div>


                          <div className="challenge-drop-zone-items">


                            {placed.length > 0 ? (

                              placed.map(
                                (
                                  itemId
                                ) => {

                                  const itemIndex =
                                    dragItems.findIndex(
                                      (
                                        item,
                                        index
                                      ) =>
                                        String(
                                          getDragItemId(
                                            item,
                                            index
                                          )
                                        ) ===
                                        String(
                                          itemId
                                        )
                                    );


                                  const item =
                                    dragItems[
                                      itemIndex
                                    ];


                                  return (

                                    <motion.button
                                      key={
                                        String(
                                          itemId
                                        )
                                      }

                                      className="challenge-placed-item"

                                      onClick={(
                                        event
                                      ) => {

                                        event.stopPropagation();

                                        removeDragItem(
                                          itemId
                                        );

                                      }}

                                      disabled={
                                        submitted
                                      }

                                    >

                                      {getDragItemText(
                                        item
                                      )}

                                      {!submitted && (
                                        <span>
                                          ×
                                        </span>
                                      )}

                                    </motion.button>

                                  );

                                }
                              )

                            ) : (

                              <span className="drop-zone-placeholder">

                                Drop items here

                              </span>

                            )}

                          </div>


                        </motion.div>

                      );

                    }
                  )}

                </div>


                {dragMessage && (

                  <motion.div
                    className="challenge-drag-message"

                    initial={{
                      opacity: 0,
                      y: 5,
                    }}

                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                  >

                    {dragMessage}

                  </motion.div>

                )}

              </div>

            )}


            {/* =================================================
                HINT
            ================================================== */}

            {!submitted && (

              <div className="challenge-hint-area">


                <button
                  className="challenge-hint-button"

                  onClick={
                    handleHint
                  }

                  onMouseEnter={
                    handleHoverSound
                  }
                >

                  <span>
                    💡
                  </span>

                  HINT

                </button>


                <AnimatePresence>

                  {showHint && (

                    <motion.div
                      className="challenge-hint"

                      initial={{
                        opacity: 0,
                        height: 0,
                        y: -5,
                      }}

                      animate={{
                        opacity: 1,
                        height: "auto",
                        y: 0,
                      }}

                      exit={{
                        opacity: 0,
                        height: 0,
                        y: -5,
                      }}
                    >

                      {hintText}

                    </motion.div>

                  )}

                </AnimatePresence>

              </div>

            )}


            {/* =================================================
                SUBMIT
            ================================================== */}

            {!submitted && (

              <motion.button
                className="challenge-submit-button"

                onClick={
                  handleSubmit
                }

                disabled={
                  submitting ||
                  (
                    isDragDrop
                      ? !isDragComplete()
                      : (
                          isMultiSelect
                            ? selectedOptions.length === 0
                            : selectedOption === null
                        ) ||
                        options.length === 0
                  )
                }

                whileHover={
                  !submitting
                    ? {
                        y: -2,
                      }
                    : {}
                }

                whileTap={
                  !submitting
                    ? {
                        scale: 0.98,
                      }
                    : {}
                }

                onMouseEnter={
                  handleHoverSound
                }
              >

                {submitting
                  ? "CHECKING..."
                  : "CHECK ANSWER →"}

              </motion.button>

            )}


            {/* =================================================
                RESULT
            ================================================== */}

            {submitted && (

              <motion.div
                className={`challenge-result ${
                  isCorrect
                    ? "result-correct"
                    : "result-wrong"
                }`}

                initial={{
                  opacity: 0,
                  y: 15,
                  scale: 0.98,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}

                transition={{
                  duration: 0.4,
                }}
              >


                <div className="result-icon">

                  {isCorrect
                    ? "✓"
                    : "✕"}

                </div>


                <div className="result-content">


                  <h3>

                    {isCorrect
                      ? "Correct!"
                      : "Not Quite!"}

                  </h3>


                  <p>

                    {result?.message ||
                      result?.feedback ||
                      (
                        isCorrect
                          ? "Excellent work, CyberNinja!"
                          : "Review the answer and keep training."
                      )}

                  </p>


                  {result?.xp_earned !==
                    undefined && (

                    <div className="result-xp">

                      +{result.xp_earned} XP

                    </div>

                  )}


                </div>


              </motion.div>

            )}


            {/* =================================================
                NEXT
            ================================================== */}

            {submitted && (

              <motion.button
                className="challenge-next-button"

                onClick={
                  handleNext
                }

                whileHover={{
                  y: -2,
                }}

                whileTap={{
                  scale: 0.98,
                }}

                onMouseEnter={
                  handleHoverSound
                }
              >

                {result?.next_challenge_id
                  ? "NEXT CHALLENGE →"
                  : "CONTINUE →"}

              </motion.button>

            )}


          </div>


        </motion.section>


        {/* =================================================
            ERROR MESSAGE
        ================================================== */}

        {error && (

          <motion.div
            className="challenge-inline-error"

            initial={{
              opacity: 0,
              y: 10,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}
          >

            ⚠️ {error}

          </motion.div>

        )}


      </main>

    </div>

  );

}


export default Challenge;