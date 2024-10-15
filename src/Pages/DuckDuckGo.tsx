import { useEffect, useRef } from "react";
import Duck from "../Components/Duck";
import { clouds } from "../Data/appdata";
import { checkCollision } from "../utils/checkCollison";
import { useGameStore } from "../store/useGameStore";
import useGameController from "../utils/useGameController";

const DuckDuckGo = () => {
  const { gameIsOver, animationState, obstacles, addObstacle, moveObstacles } =
    useGameStore();

  const { handleGameOver, handleGameStart, handleStartedGame } =
    useGameController();

  const duckPositionRef = useRef<HTMLDivElement>(null);
  const obstaclesRef = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    };
    const handleDocClick = () => {
      if (gameIsOver) {
        handleGameStart();
      } else {
        handleStartedGame();
      }
    };
    document.addEventListener("click", handleDocClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleDocClick);
    };
  }, [gameIsOver, handleGameStart, handleGameOver, handleStartedGame]);

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
  }, []);

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
  });

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
        <Duck ref={duckPositionRef} />

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
