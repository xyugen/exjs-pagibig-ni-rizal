import * as ex from "excalibur";
import Player from "../actors/player";
import { Resources } from "../resources";

/**
 * The UI overlay that displays during the level
 */
export class LevelOverlay extends ex.ScreenElement {
  private playerQuery!: ex.TagQuery<"player">;
  private controlsPanel!: ControlsPanel;

  constructor() {
    super({
      z: 1000,
      anchor: ex.vec(0, 0),
      color: ex.Color.Transparent,
      coordPlane: ex.CoordPlane.Screen
    });
  }

  get player() {
    return this.playerQuery.entities[0] as Player;
  }

  onInitialize(engine: ex.Engine<any>): void {
    this.controlsPanel = new ControlsPanel({ 
      z: this.z,
      coordPlane: ex.CoordPlane.Screen 
    });
    this.playerQuery = engine.currentScene.world.queryTags(["player"]);

    // Position the controls at the bottom of the screen
    this.controlsPanel.pos = ex.vec(
      engine.halfDrawWidth,
      engine.drawHeight - 80
    );

    this.addChild(this.controlsPanel);
    // Remove this line as it's causing issues with screen coordinates
    this.pos = ex.vec(this.viewport.left, this.viewport.top);
  }

  get viewport() {
    if (this.scene) {
      const camera = this.scene.camera;
      const engine = this.scene.engine;

      const cameraLeft = camera.drawPos.x - engine.halfDrawWidth;
      const cameraTop = camera.drawPos.y - engine.halfDrawHeight;

      return new ex.BoundingBox({
        left: cameraLeft,
        top: cameraTop,
        right: engine.drawWidth,
        bottom: engine.drawHeight,
      });
    }

    return new ex.BoundingBox();
  }
}

class ControlsPanel extends ex.ScreenElement {
  private leftButton!: ControlButton;
  private rightButton!: ControlButton;
  private runButton!: ControlButton;

  constructor(args: ex.ActorArgs = { width: undefined, height: undefined }) {
    super({
      ...args,
      coordPlane: ex.CoordPlane.Screen,
    });
  }

  onInitialize(engine: ex.Engine<any>): void {
    // Create left movement button
    this.leftButton = new ControlButton({
      text: "←",
      action: "left",
      z: this.z,
      width: 80,
      height: 80,
      color: new ex.Color(50, 50, 50, 0.7),
      coordPlane: ex.CoordPlane.Screen,
    });
    this.leftButton.pos = ex.vec(-100, 0);

    // Create right movement button
    this.rightButton = new ControlButton({
      text: "→",
      action: "right",
      z: this.z,
      width: 80,
      height: 80,
      color: new ex.Color(50, 50, 50, 0.7),
      coordPlane: ex.CoordPlane.Screen,
    });
    this.rightButton.pos = ex.vec(0, 0);

    // Create run button
    this.runButton = new ControlButton({
      text: "RUN",
      action: "run",
      z: this.z,
      width: 80,
      height: 80,
      color: new ex.Color(100, 50, 50, 0.7),
      coordPlane: ex.CoordPlane.Screen,
    });
    this.runButton.pos = ex.vec(100, 0);

    this.addChild(this.leftButton);
    this.addChild(this.rightButton);
    this.addChild(this.runButton);
  }
}

class ControlButton extends ex.ScreenElement {
  private label!: ex.Label;
  private action: string;
  private isPressed: boolean = false;
  private background!: ex.Rectangle;

  constructor(args: ex.ActorArgs & { text: string; action: string }) {
    const { text, action, ...rest } = args;
    super({
      ...rest,
      
    });
    this.action = action;
  }

  onInitialize(engine: ex.Engine<any>): void {
    // Create button background
    this.background = new ex.Rectangle({
      width: this.width,
      height: this.height,
      color: this.color,
    });

    // Create button text
    this.label = new ex.Label({
      text: this.action === "run" ? "RUN" : this.action === "left" ? "←" : "→",
      font: Resources.fonts.pixel.toFont({
        size: 24,
        color: ex.Color.White,
      }),
      z: this.z + 1,
      coordPlane: ex.CoordPlane.Screen
    });

    this.graphics.use(this.background);
    this.addChild(this.label);

    // Make sure pointer detection works with screen coordinates
    this.pointer.useGraphicsBounds = true;
    
    // Force update the bounds to match the graphics
    const bounds = this.graphics.localBounds;
    // this.collider.set(new ex.Collider({ bounds }));
    
    // Add pointer event listeners
    this.on('pointerdown', this.handlePointerDown.bind(this));
    this.on('pointerup', this.handlePointerUp.bind(this));
    this.on('pointerleave', this.handlePointerUp.bind(this));
  }

  handlePointerDown(evt: ex.PointerEvent) {
    console.log(`Button ${this.action} pressed!`);
    this.isPressed = true;
    this.scale = ex.vec(0.9, 0.9);
    this.background.color = this.background.color.darken(0.2);

    // Find player and trigger appropriate action
    if (this.scene) {
      if (this.action === "left") {
        this.scene.input.keyboard.triggerEvent("down", ex.Keys.Left);
      } else if (this.action === "right") {
        this.scene.input.keyboard.triggerEvent("down", ex.Keys.Right);
      } else if (this.action === "run") {
        this.scene.input.keyboard.triggerEvent("down", ex.Keys.ShiftLeft);
      }
    }
  }

  handlePointerUp(evt: ex.PointerEvent) {
    if (this.isPressed) {
      console.log(`Button ${this.action} released!`);
      this.isPressed = false;
      this.scale = ex.vec(1, 1);
      this.background.color = this.background.color.lighten(0.2);

      // Find player and release appropriate action
      if (this.scene) {
        if (this.action === "left") {
          this.scene.input.keyboard.triggerEvent("up", ex.Keys.Left);
        } else if (this.action === "right") {
          this.scene.input.keyboard.triggerEvent("up", ex.Keys.Right);
        } else if (this.action === "run") {
          this.scene.input.keyboard.triggerEvent("up", ex.Keys.ShiftLeft);
        }
      }
    }
  }
}
