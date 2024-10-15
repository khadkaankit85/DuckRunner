import { useEffect, useRef } from "react";
import Duck from "../Components/Duck";
import { clouds } from "../Data/appdata";
import { checkCollision } from "../utils/checkCollison";
import { useGameStore } from "../store/useGameStore";
import useGameController from "../utils/useGameController";
import { getRandomImg } from "../utils/getRandomImage";

const DuckDuckGo = () => {
  const { gameIsOver, animationState, obstacles, addObstacle, moveObstacles } =
    useGameStore();

  const { handleGameOver, handleGameStart, handleStartedGame } =
    useGameController();

  const duckPositionRef = useRef<HTMLDivElement>(null);
  const obstaclesRef = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const randomTimeRef = useRef(1000);

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

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameIsOver, handleGameStart, handleGameOver, handleStartedGame]);

  useEffect(() => {
    if (useGameStore.getState().gameIsOver) {
      return;
    }

    const obstacleInterval = setInterval(() => {
      const newObstacle = {
        id: Date.now(),
        position: 100,
        height: Math.floor(Math.random() * 50) + 50,
        image: getRandomImg(),
      };
      addObstacle(newObstacle);
    }, randomTimeRef.current);

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
  });

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
      <div className=" relative bg-red-70">
        <Duck ref={duckPositionRef} />

        <div className=" w-full h-[20rem] relative bottom-0 z-[9998]">
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
              className="obstacle  min-w-fit min-h-fit "
              style={{
                left: `${obstacle.position}%`,
                height: `${obstacle.height}px`,
                bottom: 0,
              }}
            >
              <img
                src={obstacle.image}
                alt=""
                className="max-w-[40px] max-h-[40px]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DuckDuckGo;
