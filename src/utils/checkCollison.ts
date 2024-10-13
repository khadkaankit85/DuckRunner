export function checkCollision(
  duckC: DOMRect | undefined,
  obstacleC: DOMRect | undefined
): boolean {
  if (!duckC || !obstacleC) {
    return false; // If either of the rectangles is undefined, no collision
  }

  // Check if the rectangles overlap or touch
  const isColliding =
    duckC.left <= obstacleC.right && // Duck's left side is to the left of or touching the obstacle's right side
    duckC.right >= obstacleC.left && // Duck's right side is to the right of or touching the obstacle's left side
    duckC.top <= obstacleC.bottom && // Duck's top side is above or touching the obstacle's bottom side
    duckC.bottom >= obstacleC.top; // Duck's bottom side is below or touching the obstacle's top side

  return isColliding;
}
