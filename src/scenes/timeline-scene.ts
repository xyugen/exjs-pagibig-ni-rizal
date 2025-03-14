import {
  Actor,
  Color,
  Engine,
  Scene,
  vec,
  Vector,
  Text,
  Font,
  FontUnit,
  TextAlign,
  ImageSource,
  Sprite,
} from "excalibur";
import { timelineEvents, TimelineEvent } from "../data/timeline-data";
import { LockToPlayerStrategy } from "../util/lock-to-player-strategy";
import Player from "../actors/player";

export class TimelineScene extends Scene {
  private player: Player;
  private timelineEntities: Map<number, Actor> = new Map();
  private currentInfoPanel: Actor | null = null;
  private baseY = 400; // Base Y position for your timeline

  constructor() {
    super();
    this.player = new Player({ x: 100, y: 300 });
  }

  onInitialize() {
    // Create player character (Rizal)
    this.add(this.player);

    // Initialize timeline events
    this.initializeTimelineEvents();

    // Setup player controls
    this.setupPlayerControls();
  }

  setupCamera() {
    // set camera to follow player
    const player = this.entities.find((e) => e instanceof Player) as
      | Player
      | undefined;

    if (!player) {
      console.warn(
        "Player not found in scene entities. Camera will not follow player."
      );
      return;
    }

    this.camera.addStrategy(new LockToPlayerStrategy(player));

    // @ts-expect-error - temporary to prioritize lockToActor over tilemap strategy
    this.camera._cameraStrategies.reverse();
  }

  // setupWorldBounds() {
  //   const tilemapWidth = this.tilemap.map.width * this.tilemap.map.tilewidth;
  //   const tilemapHeight = this.tilemap.map.height * this.tilemap.map.tileheight;

  //   const bounds = new Actor({
  //     collisionType: CollisionType.Fixed,
  //     collider: new CompositeCollider([
  //       new EdgeCollider({
  //         begin: vec(0, 0),
  //         end: vec(0, tilemapHeight),
  //       }),
  //       new EdgeCollider({
  //         begin: vec(0, tilemapHeight),
  //         end: vec(tilemapWidth, tilemapHeight),
  //       }),
  //       new EdgeCollider({
  //         begin: vec(tilemapWidth, tilemapHeight),
  //         end: vec(tilemapWidth, 0),
  //       }),
  //       new EdgeCollider({
  //         begin: vec(tilemapWidth, 0),
  //         end: vec(0, 0),
  //       }),
  //     ]),
  //   });

  //   // create world bounds
  //   this.engine.add(bounds);
  // }

  private async initializeTimelineEvents() {
    // Sort events by position.x to ensure chronological display
    const sortedEvents = [...timelineEvents].sort(
      (a, b) => a.position.x - b.position.x
    );

    // Add timeline path/line
    const timelinePath = new Actor({
      pos: vec(0, this.baseY + 30),
      width: 2000, // Adjust based on your timeline length
      height: 5,
      color: Color.Gray,
    });
    this.add(timelinePath);

    // Create actors for each timeline event
    for (const event of sortedEvents) {
      // Try to load image if available
      let eventActor: Actor;

      try {
        const imageSource = new ImageSource(
          `./assets/images/${event.imageKey}.png`
        );
        await imageSource.load();
        const sprite = new Sprite({
          image: imageSource,
          width: 64,
          height: 64,
        });

        eventActor = new Actor({
          pos: vec(event.position.x, this.baseY),
          width: 64,
          height: 64,
        });
        eventActor.graphics.use(sprite);
      } catch (e) {
        // Fallback if image loading fails
        eventActor = new Actor({
          pos: vec(event.position.x, this.baseY),
          width: 32,
          height: 32,
          color: Color.Red,
        });
      }

      // Add year label
      const yearLabel = new Text({
        text: event.year,
        font: new Font({
          family: "pixel",
          size: 12,
          unit: FontUnit.Px,
        }),
        color: Color.White,
      });

      const yearActor = new Actor({
        pos: vec(event.position.x, this.baseY + 50),
      });
      yearActor.graphics.use(yearLabel);

      // Add interaction
      eventActor.on("pointerup", () => this.showEventDetails(event));

      // Add proximity detection
      eventActor.on("postupdate", () => {
        const distance = Math.abs(this.player.pos.x - eventActor.pos.x);
        if (distance < 50) {
          this.showEventDetails(event);
        }
      });

      this.add(eventActor);
      this.add(yearActor);
      this.timelineEntities.set(event.id, eventActor);
    }
  }

  private setupPlayerControls() {
    // Basic left-right movement controls
    this.engine.input.keyboard.on("hold", (evt) => {
      const speed = 200; // Adjust based on your preferred movement speed

      if (evt.key === "ArrowRight") {
        this.player.vel.x = speed;
      } else if (evt.key === "ArrowLeft" ) {
        this.player.vel.x = -speed;
      }
    });

    this.engine.input.keyboard.on("release", (evt) => {
      if (["ArrowRight", "ArrowLeft", "a", "d"].includes(evt.key)) {
        this.player.vel.x = 0;
      }
    });
  }

  private showEventDetails(event: TimelineEvent) {
    // Remove existing info panel if any
    if (this.currentInfoPanel) {
      this.remove(this.currentInfoPanel);
      this.currentInfoPanel = null;
    }

    // Create info panel
    const infoPanel = new Actor({
      pos: vec(this.camera.viewport.left + this.camera.viewport.width / 2, 200),
      width: 500,
      height: 300,
      color: new Color(0, 0, 0, 0.8),
    });

    // Create text content for the panel
    const content = new Text({
      text: `${event.name} (${event.year})\n\n${event.buodNgPagibig}`,
      font: new Font({
        family: "pixel",
        size: 16,
        unit: FontUnit.Px,
      }),
      color: Color.White,
      maxWidth: 480,
    });

    // Add more button
    const moreButton = new Actor({
      pos: vec(infoPanel.pos.x, infoPanel.pos.y + 120),
      width: 150,
      height: 30,
      color: Color.Green,
    });

    const moreText = new Text({
      text: "More Details",
      font: new Font({
        family: "pixel",
        size: 14,
        unit: FontUnit.Px,
      }),
      color: Color.Black,
    });

    moreButton.graphics.use(moreText);
    moreButton.on("pointerup", () => this.showFullDetails(event));

    infoPanel.graphics.use(content);

    this.add(infoPanel);
    this.add(moreButton);
    this.currentInfoPanel = infoPanel;

    // Auto-hide after a few seconds
    setTimeout(() => {
      if (this.currentInfoPanel === infoPanel) {
        this.remove(infoPanel);
        this.remove(moreButton);
        this.currentInfoPanel = null;
      }
    }, 8000);
  }

  private showFullDetails(event: TimelineEvent) {
    // Remove existing info panel
    if (this.currentInfoPanel) {
      this.remove(this.currentInfoPanel);
      this.currentInfoPanel = null;
    }

    // Create full details panel
    const fullPanel = new Actor({
      pos: vec(this.camera.viewport.left + this.camera.viewport.width / 2, 300),
      width: 600,
      height: 500,
      color: new Color(0, 0, 0, 0.9),
    });

    // Create detailed content
    const detailedContent = new Text({
      text:
        `${event.name} (${event.year})\n\n` +
        `Talambuhay:\n${event.talambuhay}\n\n` +
        `Buod ng Pag-ibig:\n${event.buodNgPagibig}\n\n` +
        `Mga Sinulat ni Rizal:\n${event.mgaSinulatNiRizal}\n\n` +
        `Epekto kay Rizal:\n${event.epektoKayRizal}\n\n` +
        `Kontekstong Pangkasaysayan:\n${event.kontekstongPagkasaysayan}`,
      font: new Font({
        family: "pixel",
        size: 14,
        unit: FontUnit.Px,
      }),
      color: Color.White,
      maxWidth: 580,
    });

    // Close button
    const closeButton = new Actor({
      pos: vec(fullPanel.pos.x + 250, fullPanel.pos.y - 220),
      width: 80,
      height: 30,
      color: Color.Red,
    });

    const closeText = new Text({
      text: "Close",
      font: new Font({
        family: "pixel",
        size: 14,
        unit: FontUnit.Px,
      }),
      color: Color.White,
    });

    closeButton.graphics.use(closeText);
    closeButton.on("pointerup", () => {
      this.remove(fullPanel);
      this.remove(closeButton);
      this.currentInfoPanel = null;
    });

    fullPanel.graphics.use(detailedContent);

    this.add(fullPanel);
    this.add(closeButton);
    this.currentInfoPanel = fullPanel;
  }
}
