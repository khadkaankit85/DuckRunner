// DuckDuckGo.tsx
import { useEffect, useRef, useCallback } from "react";
import Duck from "../Components/Duck";
import { clouds } from "../Data/appdata";
import { checkCollision } from "../utils/checkCollison";
import { useGameStore } from "../store/useGameStore";

const DuckDuckGo = () => {
  const {
    gameIsOver,
    jumpType,
    animationState,
    obstacles,
    setGameIsOver,
    setJumpType,
    setAnimationState,
    addObstacle,
    moveObstacles,
    resetGame,
  } = useGameStore();

  const jumpTimeoutRef = useRef<number | null>(null);
  const lastJump = useRef<number>(0);

  const duckPositionRef = useRef<HTMLDivElement>(null);
  const obstaclesRef = useRef<{ [key: number]: HTMLDivElement | null }>({});

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
  }, [setGameIsOver, setAnimationState]);

  const handleGameStart = useCallback(() => {
    resetGame();
  }, [resetGame]);

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
    if (gameIsOver) {
      return;
    }
    const obstacleInterval = setInterval(() => {
      const newObstacle = {
        id: Date.now(),
        position: 100,
        height: Math.floor(Math.random() * 50) + 50,
      };
      addObstacle(newObstacle);
    }, 2000);

    return () => clearInterval(obstacleInterval);
  }, [addObstacle, gameIsOver]);

  useEffect(() => {
    if (gameIsOver) {
      return;
    }
    const moveObstaclesInterval = setInterval(() => {
      moveObstacles();

      const duckC = duckPositionRef.current?.getBoundingClientRect();
      Object.values(obstaclesRef.current).forEach((ob) => {
        if (ob) {
          const objC = ob.getBoundingClientRect();
          if (checkCollision(duckC, objC)) {
            handleGameOver();
            return;
          }
        }
      });
    }, 30);

    return () => clearInterval(moveObstaclesInterval);
  }, [gameIsOver, moveObstacles, handleGameOver]);

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
      <div className="h-[300px] relative bg-red-70">
        <Duck
          ref={duckPositionRef}
          jumpType={jumpType}
          gameIsOver={gameIsOver}
          animationState={animationState}
        />

        <div className="bg-red-400 w-full z-[9999]">
          {obstacles.map((obstacle) => (
            <div
              ref={(rf) => {
                if (rf) {
                  obstaclesRef.current[obstacle.id] = rf;
                } else {
                  delete obstaclesRef.current[obstacle.id];
                }
              }}
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
