import { Component, Entity, Keys } from "excalibur";

export default class ControlsComponent extends Component {
  declare owner: Entity;

  type: string = "input";

  controls = {
    Left: [Keys.Left, Keys.A],
    Right: [Keys.Right, Keys.D],
    Sprint: [Keys.ShiftLeft, Keys.ShiftRight],
  } as const;

  isHeld(control: keyof typeof this.controls) {
    const engine = this.owner.scene!.engine;
    const [key, button] = this.controls[control];

    return Boolean(engine.input.keyboard.isHeld(key));
  }

  wasPressed(control: keyof typeof this.controls) {
    const engine = this.owner.scene!.engine;
    const [key, button] = this.controls[control];

    return Boolean(engine.input.keyboard.wasPressed(key));
  }

  wasReleased(control: keyof typeof this.controls) {
    const engine = this.owner.scene!.engine;
    const [key, button] = this.controls[control];

    return Boolean(engine.input.keyboard.wasReleased(key));
  }

  /**
   * Returns the latest of the Left or Right keys that was pressed. Helpful for
   * keyboard controls where both keys may be pressed at the same time if you
   * want to prioritize one over the other.
   */
  getHeldXDirection(): "Left" | "Right" | undefined {
    const engine = this.owner.scene!.engine;

    for (const key of engine.input.keyboard.getKeys().slice().reverse()) {
      if (this.controls.Left.includes(key as any)) return "Left";
      if (this.controls.Right.includes(key as any)) return "Right";
    }
  }
}
