import { useGameStore } from "../store/useGameStore";
import { useRef } from "react";
import useSound from "use-sound";
import quack1 from "../assets/quack1.mp3";

const useGameController = () => {
  const [play, { stop }] = useSound(quack1);
  const {
    gameIsOver,
    setGameIsOver,
    setAnimationState,
    resetGame,
    setJumpType,
    jumpType,
  } = useGameStore();

  const jumpTimeoutRef = useRef<number | null>(null);
  const lastJumpedOn = useRef<number>(0); // Moved here to keep track of the last jump time

  const handleGameOver = () => {
    play();
    setGameIsOver(true);
    setAnimationState("paused");
  };

  const handleGameStart = () => {
    setGameIsOver(false);
    stop();
    resetGame();
  };

  const handleStartedGame = () => {
    if (useGameStore.getState().gameIsOver) {
      handleGameStart();
      return; // Prevent actions if the game is over
    }

    const jumpTimeDifference = Date.now() - lastJumpedOn.current;
    console.log("jumping and gameis over is ", gameIsOver);
    // Check for a rapid jump trigger (within 150ms for double jump)
    if (jumpTimeDifference < 1000) {
      console.log("double jumped");
      setJumpType("double");
    } else if (jumpType !== "double") {
      console.log("single jumped");
      setJumpType("single");
    }

    lastJumpedOn.current = Date.now();

    if (jumpTimeoutRef.current) {
      clearTimeout(jumpTimeoutRef.current);
    }

    jumpTimeoutRef.current = window.setTimeout(() => {
      setJumpType("normal");
    }, 300);
  };

  return {
    handleGameOver,
    handleGameStart,
    handleStartedGame,
  };
};

export default useGameController;
