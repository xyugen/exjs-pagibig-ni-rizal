import {
  Animation,
  AnimationStrategy,
  BodyComponent,
  clamp,
  CollisionType,
  Shape,
  Side,
  SpriteSheet,
  vec,
  Vector,
} from "excalibur";
import { PhysicsActor } from "../classes/physics-actor";
import { AnimationComponent } from "../components/graphics/animation";
import ControlsComponent from "../input/controls";
import { CollisionGroup } from "../physics/collision";
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

export default class Player extends PhysicsActor {
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

  /**
   * The maximum velocity the player can sprint at.
   */
  SPRINT_MAX_VELOCITY = 210;

  /* Components */

  animation = new AnimationComponent({
    idle: Animation.fromSpriteSheet(
      spritesheet,
      [0, 1, 2, 3, 4, 5],
      140,
      AnimationStrategy.Loop
    ),
    run: Animation.fromSpriteSheet(
      spritesheet,
      [6, 7, 8, 9, 10, 11],
      140,
      AnimationStrategy.Loop
    ),
    sprint: Animation.fromSpriteSheet(
      spritesheet,
      [6, 7, 8, 9, 10, 11],
      100,
      AnimationStrategy.Loop
    ),
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
    switch (true) {
      case this.controls.isSprinting:
        return this.SPRINT_MAX_VELOCITY;
      default:
        return this.RUN_MAX_VELOCITY;
    }
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
      anchor: new Vector(0.5, 1),
      width: 32,
      height: 32,
      collisionType: CollisionType.Active,
      collisionGroup: CollisionGroup.Player,
    });

    // Set up collision box after construction
    this.collider.set(Shape.Box(32, 32, vec(0.5, 1), vec(0, 32)));
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

    this.handleInput();
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

  onCollisionStart(
    self: ex.Collider,
    other: ex.Collider,
    side: ex.Side,
    contact: ex.CollisionContact
  ): void {
    if (contact.isCanceled()) {
      return;
    }

    const otherBody = other.owner.get(BodyComponent);

    if (
      otherBody?.collisionType === CollisionType.Fixed ||
      otherBody?.collisionType === CollisionType.Active
    ) {
      const wasInAir = this.oldVel.y > 0;

      // player landed on the ground
      if (side === Side.Bottom && wasInAir) {
        this.isOnGround = true;
      }
    }
  }

  /**
   * Process user input to control the character
   */
  handleInput() {
    const heldXDirection = this.controls.getHeldXDirection();
    console.log("HELD DIRECTION", heldXDirection);
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

    // Set the sprite direction based on facing
    this.graphics.flipHorizontal = this.facing === "left";

    // If player is not moving (velocity near zero), always play idle animation
    if (Math.abs(this.vel.x) < 1) {
      this.animation.set("idle");
      return;
    }

    if (this.isOnGround) {
      // Check if player is moving in the direction they're holding
      const isMovingWithInput =
        (heldDirection === "Left" && this.vel.x < 0) ||
        (heldDirection === "Right" && this.vel.x > 0);

      // If player is moving and input matches movement direction, run
      // If no direction is held but still moving, also run (momentum)
      if (isMovingWithInput || !heldDirection) {
        this.animation.set("run");
      } else {
        // Player is trying to change direction or stop
        this.animation.set("idle");
      }
    } else {
      // When in air, use run animation if moving horizontally
      this.animation.set(Math.abs(this.vel.x) > 10 ? "run" : "idle");
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

  get isSprinting() {
    return this.isMoving && this.isHeld("Sprint");
  }

  get isTurning() {
    const heldDirection = this.getHeldXDirection();

    return (
      (heldDirection === "Left" && this.owner.vel.x > 0) ||
      (heldDirection === "Right" && this.owner.vel.x < 0)
    );
  }
}
