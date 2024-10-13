import { useEffect, useState, useRef } from "react";
import Duck from "../Components/Duck";
import { clouds } from "../Data/appdata";

const DuckDuckGo = () => {
  const [gameIsOver, setGameIsOver] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const jumpTimeoutRef = useRef<number | null>(null);

  const [animationState, setanimationState] = useState<"running" | "paused">(
    "running"
  );

  // Logic to handle jump
  useEffect(() => {
    function handleStartedGame() {
      setIsJumping(true);
      if (jumpTimeoutRef.current) {
        clearTimeout(jumpTimeoutRef.current);
      }
      jumpTimeoutRef.current = window.setTimeout(() => {
        setIsJumping(false);
      }, 200);
    }

    function handleMain(e: KeyboardEvent) {
      if (e.key === " ") {
        if (gameIsOver) {
          handleGameStart();
        } else {
          handleStartedGame();
        }
      }
      if (e.key === "d") {
        handleGameOver();
      }
    }

    document.addEventListener("keydown", handleMain);
    return () => {
      document.removeEventListener("keydown", handleMain);
      if (jumpTimeoutRef.current) {
        clearTimeout(jumpTimeoutRef.current);
      }
    };
  }, [gameIsOver]);

  // Logic when dead
  function handleGameOver() {
    setGameIsOver(true);
    stopGameAnimations();
  }

  function handleGameStart() {
    setGameIsOver(false);
    startGameAnimations();
  }

  function stopGameAnimations() {
    setanimationState("paused");
  }

  function startGameAnimations() {
    setanimationState("running");
  }

  return (
    <div className="w-full h-screen flex">
      <div className="h-[10rem] w-[100vw] mt-20 overflow-hidden flex items-end justify-between gap-96">
        {clouds.map((cl, i) => (
          <img
            src={cl}
            alt={`cloud${i}`}
            key={i}
            className="cloudImage"
            style={{ animationPlayState: animationState }}
          />
        ))}
      </div>
      <Duck
        state={isJumping}
        gameIsOver={gameIsOver}
        animationState={animationState}
      />
    </div>
  );
};

export default DuckDuckGo;
