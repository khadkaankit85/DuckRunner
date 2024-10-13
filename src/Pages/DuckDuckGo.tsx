import { useEffect, useState, useRef, useCallback } from "react";
import Duck from "../Components/Duck";
import { clouds } from "../Data/appdata";

const DuckDuckGo = () => {
  const [gameIsOver, setGameIsOver] = useState(false);
  const jumpTimeoutRef = useRef<number | null>(null);
  const [jumpType, setJumpType] = useState<"normal" | "single" | "double">(
    "normal"
  );
  const lastJump = useRef<number>(0);
  const [animationState, setAnimationState] = useState<"running" | "paused">(
    "running"
  );

  const handleStartedGame = () => {
    const jumpTimeDifference = Date.now() - lastJump.current;

    if (jumpTimeDifference / 100 < 4) {
      setJumpType("double");
    } else if (jumpType !== "double") {
      setJumpType("single");
    }

    lastJump.current = Date.now();

    if (jumpTimeoutRef.current) {
      clearTimeout(jumpTimeoutRef.current);
    }

    jumpTimeoutRef.current = window.setTimeout(() => {
      setJumpType("normal");
    }, 300);
  };

  const handleGameOver = useCallback(() => {
    setGameIsOver(true);
    setAnimationState("paused");
  }, []);

  const handleGameStart = useCallback(() => {
    setGameIsOver(false);
    setAnimationState("running");
  }, []);

  const handleMain = useCallback(
    (e: KeyboardEvent) => {
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
    },
    [gameIsOver, handleGameStart, handleGameOver]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleMain);
    return () => {
      document.removeEventListener("keydown", handleMain);
      if (jumpTimeoutRef.current) {
        clearTimeout(jumpTimeoutRef.current);
      }
    };
  }, [handleMain]);

  return (
    <div className="w-full h-screen flex flex-col">
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
        jumpType={jumpType}
        gameIsOver={gameIsOver}
        animationState={animationState}
      />
      <div className="bg-red-400 w-full h-[20rem]"></div>
    </div>
  );
};

export default DuckDuckGo;
