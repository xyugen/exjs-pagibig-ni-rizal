import { Keys, Scene, vec, Vector } from "excalibur";
import Player from "../actors/player";

export class Buttons {
  moveButtons: HTMLDivElement;
  currentWorldPos: Vector = vec(0, 0);
  private scene: Scene | null = null;
  private player: Player | null = null;
  private leftButton: HTMLElement | null = null;
  private rightButton: HTMLElement | null = null;
  private runButton: HTMLElement | null = null;

  constructor() {
    // has child section id left and id right
    this.moveButtons = document.getElementById(
      "move-buttons"
    ) as HTMLDivElement;

    // Get button elements
    this.leftButton = this.moveButtons.querySelector("#left");
    this.rightButton = this.moveButtons.querySelector("#right");
    this.runButton = this.moveButtons.querySelector("#run");

    // Prevent default touch behavior
    this.moveButtons.addEventListener("touchstart", this.touchHandler.bind(this));
    this.moveButtons.addEventListener("touchmove", this.touchHandler.bind(this));
    
    // Set up button event listeners
    this.setupButtonListeners();
  }

  initialize(scene: Scene) {
    this.scene = scene;
    // Find player in the scene
    this.player = scene.entities.find(e => e instanceof Player) as Player || null;
    
    if (!this.player) {
      console.warn("Player not found in scene entities. Buttons will not control player.");
    }
  }

  private setupButtonListeners() {
    // Left button
    if (this.leftButton) {
      this.leftButton.addEventListener("mousedown", () => this.handleButtonDown("left"));
      this.leftButton.addEventListener("mouseup", () => this.handleButtonUp("left"));
      this.leftButton.addEventListener("mouseleave", () => this.handleButtonUp("left"));
      this.leftButton.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.handleButtonDown("left");
      });
      this.leftButton.addEventListener("touchend", () => this.handleButtonUp("left"));
    }

    // Right button
    if (this.rightButton) {
      this.rightButton.addEventListener("mousedown", () => this.handleButtonDown("right"));
      this.rightButton.addEventListener("mouseup", () => this.handleButtonUp("right"));
      this.rightButton.addEventListener("mouseleave", () => this.handleButtonUp("right"));
      this.rightButton.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.handleButtonDown("right");
      });
      this.rightButton.addEventListener("touchend", () => this.handleButtonUp("right"));
    }

    // Run button
    if (this.runButton) {
      this.runButton.addEventListener("mousedown", () => this.handleButtonDown("run"));
      this.runButton.addEventListener("mouseup", () => this.handleButtonUp("run"));
      this.runButton.addEventListener("mouseleave", () => this.handleButtonUp("run"));
      this.runButton.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.handleButtonDown("run");
      });
      this.runButton.addEventListener("touchend", () => this.handleButtonUp("run"));
    }
    
    this.player?.handleInput();
  }

  private handleButtonDown(action: string) {
    if (!this.scene) return;

    switch (action) {
      case "left":
        this.scene.engine.input.keyboard.triggerEvent("down", Keys.Left);
        break;
      case "right":
        this.scene.engine.input.keyboard.triggerEvent("down", Keys.Right);
        break;
      case "run":
        this.scene.engine.input.keyboard.triggerEvent("down", Keys.ShiftLeft);
        break;
    }
  }

  private handleButtonUp(action: string) {
    if (!this.scene) return;
    
    switch (action) {
      case "left":
        this.scene.engine.input.keyboard.triggerEvent("up", Keys.Left);
        break;
      case "right":
        this.scene.engine.input.keyboard.triggerEvent("up", Keys.Right);
        break;
      case "run":
        this.scene.engine.input.keyboard.triggerEvent("up", Keys.ShiftLeft);
        break;
    }
  }

  touchHandler(event: TouchEvent) {
    event.preventDefault(); // don't propagate touch event to click
  }
}
