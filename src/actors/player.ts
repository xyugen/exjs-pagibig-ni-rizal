import {
  Actor,
  Animation,
  clamp,
  CollisionType,
  Shape,
  SpriteSheet,
  vec,
  Vector,
} from "excalibur";
import { AnimationComponent } from "../components/graphics/animation";
import ControlsComponent from "../input/controls";
import { Resources } from "../resources";

const spritesheet = SpriteSheet.fromImageSource({
  image: Resources.sprites.player,
  grid: {
    columns: 6,
    rows: 7,
    spriteWidth: 32,
    spriteHeight: 32,
  },
});

export default class Player extends Actor {
  /* Constants */

  /**
   * The maximum speed the player can fall at.
   */
  MAX_FALL_SPEED = 270;

  /**
   * The amount of acceleration to apply to the player when they are moving.
   */
  ACCELERATION = 300;

  /**
   * The amount of deceleration to apply to the player when they are stopping (i.e not hold any movement keys)
   */
  STOP_DECELERATION = this.ACCELERATION;

  /**
   * The maximum velocity the player can run at.
   */
  RUN_MAX_VELOCITY = 90;

  /* Components */

  animation = new AnimationComponent({
    idle: Animation.fromSpriteSheet(spritesheet, [0, 1, 2, 3, 4, 5], 12),
    run: Animation.fromSpriteSheet(spritesheet, [6, 7, 8, 9, 10, 11], 12),
  });
  controls = new PlayerControlsComponent();

  /* State */

  /**
   * The direction the player is facing.
   */
  facing: "left" | "right" = "right";

  /**
   * Whether the player is currently on ground.
   */
  isOnGround: boolean = false;

  get maxXVelocity() {
    return this.RUN_MAX_VELOCITY;
  }

  get maxFallingVelocity() {
    return this.MAX_FALL_SPEED;
  }

  get isXMovementAllowed() {
    return this.isOnGround;
  }

  constructor(args: { x: number; y: number; z?: number }) {
    super({
      ...args,
      name: "player",
      anchor: new Vector(0.5, 0.5),
      width: 32,
      height: 32,
      collisionType: CollisionType.Active,
      // collisionGroup: CollisionGroup.Player,
      // @ts-expect-error
      collider: Shape.Box(32, 32, vec(0.5, 0.5)),
    });

    this.body.useGravity = true;

    this.addComponent(this.animation);
    this.addComponent(this.controls);

    this.addTag("player");
    // for debugging
    // @ts-ignore
    // window.player = this;
  }

  onInitialize(engine: ex.Engine) {
    super.onInitialize(engine);

    // offset sprite to account for anchor
    this.graphics.offset = new Vector(0, 32);
    this.animation.set("idle");
  }

  onPreUpdate(engine: ex.Engine, delta: number): void {
    // reset some flags when we're on the ground

    this.handleInput(engine, delta);
  }

  // @ts-ignore
  update(engine: ex.Engine<any>, delta: number): void {
    if (this.vel.y >= this.maxFallingVelocity) {
      this.vel.y = this.maxFallingVelocity;
      this.acc.y = 0;
    }

    super.update(engine, delta);
  }

  onPostUpdate(engine: ex.Engine, delta: number): void {
    this.animation.speed = Math.min(
      // increase anim speed exponentially up to 3x
      1 + Math.pow(Math.abs(this.vel.x) / 200, 2) * 3,
      3
    );

    this.handleAnimation();

    this.applyDeceleration();
  }

  /**
   * Process user input to control the character
   */
  handleInput(engine: ex.Engine, delta: number) {
    const heldXDirection = this.controls.getHeldXDirection();

    // move left or right
    if (heldXDirection && this.isXMovementAllowed) {
      const direction = heldXDirection === "Left" ? -1 : 1;
      const accel = this.ACCELERATION * direction;

      this.facing = direction === -1 ? "left" : "right";

      this.acc.x += accel;
    }
  }

  /**
   * Sets the player's animation based on their current state.
   */
  handleAnimation() {
    const heldDirection = this.controls.getHeldXDirection();

    this.graphics.flipHorizontal = this.facing === "left";
    if (this.isOnGround) {
      const isMovingInHeldDirection =
        !heldDirection ||
        (heldDirection === "Left" && this.vel.x < 0) ||
        (heldDirection === "Right" && this.vel.x > 0);

      if (isMovingInHeldDirection) {
        this.animation.set("run");
      } else {
        this.animation.set("idle");
      }
    }

    // if we're not moving, play the idle animation
    if (Math.round(this.vel.x) === 0) {
      this.animation.set("idle");
    }
  }

  /**
   * Applies ground friction to the player's velocity.
   */
  applyDeceleration() {
    const isOnGround = this.isOnGround;
    const isOverMaxXVelocity = Math.abs(this.vel.x) > this.maxXVelocity;

    // ground deceleration
    if (isOnGround) {
      // decelerate if we're over the max velocity or stopped walking
      if (!this.controls.isMoving || isOverMaxXVelocity) {
        if (this.vel.x !== 0) {
          this.acc.x = -this.STOP_DECELERATION * Math.sign(this.vel.x);
        }
      }
    }
    // air deceleration
    else {
      if (isOverMaxXVelocity) {
        // in air, clamp to max velocity
        this.vel.x = clamp(this.vel.x, -this.maxXVelocity, this.maxXVelocity);
        this.acc.x = 0;
      }
    }

    const isDecelerating =
      Math.sign(this.vel.x) !== 0 &&
      Math.sign(this.vel.x) !== Math.sign(this.acc.x);
    // clamp to 0 if we're close enough
    if (isDecelerating && Math.abs(this.vel.x) < 1) {
      this.vel.x = 0;
      this.acc.x = 0;
    }
  }
}

/**
 * Handles user input for the player, adding some extra helper methods
 * to get the intent of movement via input.
 *
 * For example, `isMoving` returns true if the player is holding left or right, but
 * does not necessarily mean the player is actually moving.
 */
class PlayerControlsComponent extends ControlsComponent {
  declare owner: Player;

  sprintTimer = 0;

  onAdd(owner: Player): void {
    super.onAdd?.(owner);
  }

  get isMoving() {
    return this.getHeldXDirection() !== undefined;
  }

  get isTurning() {
    const heldDirection = this.getHeldXDirection();

    return (
      (heldDirection === "Left" && this.owner.vel.x > 0) ||
      (heldDirection === "Right" && this.owner.vel.x < 0)
    );
  }
}
