import { Actor, Vector } from "excalibur";

export class Woman extends Actor {
  constructor({ x, y, z = -50 }: { x: number; y: number; z?: number}) {
    super({
      name: "woman",
      x,
      y,
      z,
      anchor: new Vector(0.5, 0.78),
    });
  }
}
