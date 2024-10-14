import { create } from "zustand";

type jumpType = "normal" | "single" | "double";
type animationState = "running" | "paused";

interface ObstacleType {
  id: number;
  position: number;
  height: number;
  bottom: number;
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

  setGameIsOver: (isOver: boolean) => {
    set({ gameIsOver: isOver });
  },
  setJumpType: (jumpType) => set({ jumpType }),
  setAnimationState: (animationState) => set({ animationState }),

  addObstacle: (obstacle: ObstacleType) =>
    set((state) => ({
      obstacles: [...state.obstacles, obstacle],
    })),

  moveObstacles: () =>
    set((state) => ({
      obstacles: state.obstacles
        .map((obstacle) => ({
          ...obstacle,
          position: obstacle.position - 2,
        }))
        .filter((obstacle) => obstacle.position > -10),
    })),

  resetGame: () =>
    set({
      gameIsOver: false,
      jumpType: "normal",
      animationState: "running",
      obstacles: [],
    }),
}));
