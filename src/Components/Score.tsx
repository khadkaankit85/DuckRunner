import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/useGameStore";
const Score = () => {
  const { gameIsOver } = useGameStore();
  const highestScore = useRef(0);
  const [score, setscore] = useState(0);
  useEffect(() => {
    if (gameIsOver) {
      if (highestScore.current < score) {
        highestScore.current = score;
      }
      setscore(0);
    }
    const incScore = setTimeout(() => {
      setscore((prev) => prev + 1);
    }, 10);
    return () => clearTimeout(incScore);
  }, [gameIsOver, score]);
  return (
    <>
      <p>Highest:{highestScore.current}</p>
      <p>Current Score:{score}</p>
    </>
  );
};

export default Score;
