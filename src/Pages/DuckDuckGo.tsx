import { useEffect, useState, useRef } from "react";
import Duck from "../Components/Duck";
import { clouds } from "../Data/appdata";

const DuckDuckGo = () => {
  const [gameIsOver, setGameIsOver] = useState(false);
  const jumpTimeoutRef = useRef<number | null>(null);

  const [jumpType, setJumpType] = useState<"normal" | "single" | "double">(
    "normal"
  );

  const lastJump = useRef<number>(0);

  const [animationState, setanimationState] = useState<"running" | "paused">(
    "running"
  );
  console.log("rendered");

  // Logic to handle jump
  useEffect(() => {
    function handleStartedGame() {
      const jumpTimeDifference = Date.now() - lastJump.current;
      console.log(jumpType);
      if (jumpType == "double") {
        console.log("alreaady at enought level");
      } else if (jumpTimeDifference / 100 < 4) {
        setJumpType("double");
      } else {
        setJumpType("single");
      }
      lastJump.current = Date.now();

      if (jumpTimeoutRef.current) {
        clearTimeout(jumpTimeoutRef.current);
      }
      jumpTimeoutRef.current = window.setTimeout(() => {
        setJumpType("normal");
      }, 300);
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
        jumpType={jumpType}
        gameIsOver={gameIsOver}
        animationState={animationState}
      />
    </div>
  );
};

export default DuckDuckGo;
