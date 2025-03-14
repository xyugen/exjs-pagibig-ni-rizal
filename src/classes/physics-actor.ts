import * as ex from "excalibur";

export class PhysicsActor extends ex.Actor {
  isOnGround = false;

  private _oldPosGlobal = ex.vec(0, 0);

  constructor(args: ex.ActorArgs) {
    super(args);
  }

  onInitialize(engine: ex.Engine): void {
    this.on("postupdate", () => {
      this._oldPosGlobal = this.getGlobalPos().clone();
    });
  }

  getGlobalOldPos() {
    return this._oldPosGlobal;
  }
}
