import { useGameStore } from "../store/useGameStore";
import { useRef } from "react";
import useSound from "use-sound";
import quack1 from "../assets/quack1.mp3";

const useGameController = () => {
  const [play, { stop }] = useSound(quack1);
  const { setGameIsOver, setAnimationState, resetGame, setJumpType, jumpType } =
    useGameStore();

  const jumpTimeoutRef = useRef<number | null>(null);

  const handleGameOver = () => {
    play();
    setGameIsOver(true);
    setAnimationState("paused");
  };

  const handleGameStart = () => {
    stop();
    resetGame();
  };

  const handleStartedGame = (lastJumpedOn: React.MutableRefObject<number>) => {
    const jumpTimeDifference = Date.now() - lastJumpedOn.current;

    if (jumpTimeDifference / 100 < 4) {
      setJumpType("double");
    } else if (jumpType !== "double") {
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
