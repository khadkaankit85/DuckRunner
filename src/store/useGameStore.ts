import { create } from "zustand";

type jumpType = "normal" | "single" | "double";
type animationState = "running" | "paused";

interface ObstacleType {
  id: number;
  position: number;
  height: number;
  image: string;
}

interface GameState {
  gameIsOver: boolean;
  jumpType: jumpType;
  animationState: animationState;
  obstacles: ObstacleType[];
  setGameIsOver: (isOver: boolean) => void;
  setJumpType: (jumpType: jumpType) => void;
  setAnimationState: (animationState: animationState) => void;
  addObstacle: (obstacle: ObstacleType) => void;
  moveObstacles: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameIsOver: false,
  jumpType: "normal",
  animationState: "running",
  obstacles: [],

  setGameIsOver: (isOver: boolean) => set({ gameIsOver: isOver }),
  setJumpType: (jumpType) => set({ jumpType }),
  setAnimationState: (animationState) => set({ animationState }),

  addObstacle: (obstacle: ObstacleType) =>
    set((state) => ({
      obstacles: [...state.obstacles, obstacle],
    })),

  moveObstacles: () => {
    // Get the current time in milliseconds
    const currentTime = Date.now();
    // Calculate seconds from the current time
    const seconds = Math.floor((currentTime / 1000) % 60); // Get the last 60 seconds
    // Use seconds to influence the random speed
    const speedRandomness = seconds * 0.05; // This will increase position change every second

    set((state) => ({
      obstacles: state.obstacles
        .map((obstacle) => ({
          ...obstacle,
          // Move position based on random speed + seconds influence
          position:
            obstacle.position -
            (Math.floor(Math.random() * 1.5 + 3) + speedRandomness),
        }))
        .filter((obstacle) => obstacle.position > -10),
    }));
  },

  resetGame: () =>
    set({
      gameIsOver: false,
      jumpType: "normal",
      animationState: "running",
      obstacles: [],
    }),
}));
