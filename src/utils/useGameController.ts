import { useGameStore } from "../store/useGameStore";
import { useRef } from "react";
import useSound from "use-sound";
import quack1 from "../assets/quack1.mp3";

const useGameController = () => {
  const [play, { stop }] = useSound(quack1);

  const { setGameIsOver, setAnimationState, resetGame, setJumpType } =
    useGameStore();

  const jumpTimeoutRef = useRef<number | null>(null);
  const lastJumpedOn = useRef<number>(0); // Moved here to keep track of the last jump time

  const handleGameOver = () => {
    play();
    setGameIsOver(true);
    setAnimationState("paused");
  };

  const handleGameStart = () => {
    stop();
    resetGame();
  };

  const handleStartedGame = () => {
    if (useGameStore.getState().gameIsOver) {
      return;
    }
    const jumpTimeDifference = Date.now() - lastJumpedOn.current;

    if (jumpTimeDifference / 100 < 4) {
      return;
    } else if (useGameStore.getState().jumpType !== "double") {
      setJumpType("single");
    }
    setJumpType("single");

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
