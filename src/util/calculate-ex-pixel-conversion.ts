import { vec, Vector } from "excalibur";

export const calculateExPixelConversion = (screen: ex.Screen) => {
  const origin = screen.worldToPageCoordinates(Vector.Zero);
  const singlePixel = screen.worldToPageCoordinates(vec(1, 0)).sub(origin);
  const pixelConversion = singlePixel.x;
  document.documentElement.style.setProperty(
    "--pixel-conversion",
    pixelConversion.toString()
  );
};
