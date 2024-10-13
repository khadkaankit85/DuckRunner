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

  const [obstacles, setObstacles] = useState<
    { id: number; position: number; height: number }[]
  >([]);

  const duckPositionRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const obstacleInterval = setInterval(() => {
      // Generate a new obstacle with random height
      const newObstacle = {
        id: Date.now(),
        position: 100, // Start from the right side
        height: Math.floor(Math.random() * 50) + 50, // Random height
      };
      setObstacles((prevObstacles) => [...prevObstacles, newObstacle]);
    }, 2000); // Spawn every 2 seconds

    return () => clearInterval(obstacleInterval);
  }, []);

  useEffect(() => {
    if (gameIsOver) {
      return;
    }
    const moveObstaclesInterval = setInterval(() => {
      setObstacles(
        (prevObstacles) =>
          prevObstacles
            .map((obstacle) => ({
              ...obstacle,
              position: obstacle.position - 2, // Move left
            }))
            .filter((obstacle) => obstacle.position > -10) // Remove off-screen obstacles
      );
    }, 30); // Update every 30ms for smooth animation

    return () => clearInterval(moveObstaclesInterval);
  }, [gameIsOver]);

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
      <div className="h-[300px] relative bg-red-700">
        <Duck
          ref={duckPositionRef}
          jumpType={jumpType}
          gameIsOver={gameIsOver}
          animationState={animationState}
        />

        <div className="bg-red-400 w-full z-[9999] ">
          {obstacles.map((obstacle) => (
            <div
              key={obstacle.id}
              className="obstacle"
              style={{
                left: `${obstacle.position}%`,
                height: `${obstacle.height}px`,
                bottom: 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DuckDuckGo;
