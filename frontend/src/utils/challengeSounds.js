import hoverSound from "../assets/sounds/hover.mp3";
import clickSound from "../assets/sounds/click.mp3";
import correctSound from "../assets/sounds/challenge-correct.mp3";
import wrongSound from "../assets/sounds/challenge-wrong.mp3";
import successSound from "../assets/sounds/success.mp3";
import levelUpSound from "../assets/sounds/level-up.mp3.mp3";

const sounds = {
  hover: new Audio(hoverSound),
  click: new Audio(clickSound),
  correct: new Audio(correctSound),
  wrong: new Audio(wrongSound),
  success: new Audio(successSound),
  levelUp: new Audio(levelUpSound),
};

export const playChallengeSound = (name) => {
  const sound = sounds[name];

  if (!sound) return;

  sound.currentTime = 0;
  sound.volume = 0.45;
  sound.play().catch(() => {});
};