import { obstacles } from "../Data/appdata";

export const getRandomImg = () => {
  const randomI = Math.floor(Math.random() * (17 - 0) + 0);
  return obstacles[randomI];
};
