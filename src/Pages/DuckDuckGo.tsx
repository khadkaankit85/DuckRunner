import { useEffect, useRef } from "react";
import Duck from "../Components/Duck";
import { clouds } from "../Data/appdata";
import { checkCollision } from "../utils/checkCollison";
import { useGameStore } from "../store/useGameStore";
import useGameController from "../utils/useGameController";
import Listen from "../Components/Listen";

const DuckDuckGo = () => {
  const { gameIsOver, animationState, obstacles, addObstacle, moveObstacles } =
    useGameStore();

  const { handleGameOver, handleGameStart, handleStartedGame } =
    useGameController();

  const duckPositionRef = useRef<HTMLDivElement>(null);
  const obstaclesRef = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only allow jumping if the game is not over
      if (e.key === " " && !gameIsOver) {
        handleStartedGame();
      }
      if (e.key === "d") {
        handleGameOver();
      }
    };

    const handleDocClick = () => {
      // Only allow starting the game if it's over
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
      const deviceHeight = window.innerHeight;
      const scaledHeight =
        Math.floor(Math.random() * (deviceHeight * 0.1)) + deviceHeight * 0.05;

      const newObstacle = {
        id: Date.now(),
        position: 100,
        height: scaledHeight,
        bottom: Math.floor(Math.random() * 30) + 20, // Random bottom position for the gap
      };

      addObstacle(newObstacle);
    }, 1000); // Adjust the interval as needed

    return () => clearInterval(obstacleInterval);
  }, [gameIsOver, addObstacle]);

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
    <div className="w-full h-[100dvh] flex flex-col">
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
      <div className="relative bg-red-70">
        <Duck ref={duckPositionRef} />

        <div className="h-[20rem] w-full relative bottom-0 z-[9998]">
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
              className="obstacle bg-blue-500"
              style={{
                left: `${obstacle.position}%`,
                height: `${obstacle.height}px`,
                bottom: `${obstacle.bottom}px`,
              }}
            />
          ))}
        </div>
      </div>
      <div>
        <Listen />
      </div>
    </div>
  );
};

export default DuckDuckGo;
