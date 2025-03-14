import { TiledResource } from "@excaliburjs/plugin-tiled";
import Player from "../actors/player";
import { LockToPlayerStrategy } from "../util/lock-to-player-strategy";

import { FactoryProps } from "@excaliburjs/plugin-tiled";
import {
  Actor,
  BaseAlign,
  BodyComponent,
  CollisionType,
  Color,
  CompositeCollider,
  EdgeCollider,
  Font,
  FontUnit,
  GraphicsGroup,
  Label,
  Rectangle,
  Scene,
  TextAlign,
  Text as TextEntity,
  vec,
} from "excalibur";
import { Woman } from "../actors/woman";
import { timelineEvents } from "../data/timeline-data";
import { CollisionGroup } from "../physics/collision";
import { Resources } from "../resources";
// import { LevelOverlay } from "../ui/level-overlay";

export default class LevelScene extends Scene {
  song?: ex.Sound;
  tilemap: TiledResource;
  background: ex.ImageSource;

  entityFactory: Record<
    string,
    (props: FactoryProps) => ex.Entity | undefined
  > = {
    /* Player */
    Player: (props) =>
      new Player({
        x: props.object?.x ?? 0,
        y: props.object?.y ?? 0,
        z: props.layer.order ?? 0,
      }),

    /* Woman */
    Woman: (props) =>
      new Woman({
        x: props.object?.x ?? 0,
        y: props.object?.y ?? 0,
        z: props.layer.order ?? 0,
      }),

    /* UI */
    Text: (props) => {
      const text = props.object?.tiledObject?.text?.text ?? "";
      const size = props.object?.tiledObject?.text?.pixelsize ?? 16;
      const width = props.object?.tiledObject?.width ?? 100;
      const height = props.object?.tiledObject?.height ?? 100;
      const x = props.object?.x ?? 0;
      const y = props.object?.y ?? 0;

      const textAlign = (() => {
        switch (props.object?.tiledObject?.text?.halign) {
          case "center":
            return TextAlign.Center;
          case "right":
            return TextAlign.Right;
          default:
            return TextAlign.Left;
        }
      })();

      const baseAlign = (() => {
        switch (props.object?.tiledObject?.text?.valign) {
          case "center":
            return BaseAlign.Middle;
          case "bottom":
            return BaseAlign.Bottom;
          default:
            return BaseAlign.Top;
        }
      })();

      const label = new Label({
        x,
        y,
        text,
        width,
        height,
        font: Resources.fonts.pixel.toFont({
          size: size,
          color: Color.White,
          textAlign,
          baseAlign,
          shadow: {
            blur: 2,
            offset: vec(2, 2),
            color: Color.Black,
          },
        }),
        z: props.layer.order ?? 0,
      });

      return label;
    },
  };

  constructor(args: {
    tilemap: TiledResource;
    background: ex.ImageSource;
    song?: ex.Sound;
  }) {
    super();
    this.tilemap = args.tilemap;
    this.background = args.background;
    this.song = args.song;

    for (const [className, factory] of Object.entries(this.entityFactory)) {
      this.tilemap.registerEntityFactory(className, factory);
    }
  }

  onInitialize() {
    this.tilemap.addToScene(this);

    // this.add(new LevelOverlay());

    this.setupCollisionGroups();
    this.setupCamera();
    this.setupBackground();
    this.setupWorldBounds();
    this.setupWomen();
  }

  setupWomen() {
    // find all women instances
    const womanEntity = this.entities.find((e) => e instanceof Woman) as Woman;

    if (!womanEntity) {
      console.warn("Woman not found in scene entities.");
      return;
    }

    const womenImages = Resources.womenSprites;
    timelineEvents.forEach((event, index) => {
      const womanImage = Object.values(womenImages)[index];
      const womanSprite = womanImage.toSprite();
      const woman = new Woman({
        x: womanEntity.globalPos.x + 500 * index,
        y: womanEntity.globalPos.y,
      });

      const MAIN_COLOR = Color.White;
      const yearText = new TextEntity({
        text: event.year,
        color: MAIN_COLOR,
        font: new Font({ family: "Round9x13", size: 14, unit: FontUnit.Px }),
      });
      const nameText = new TextEntity({
        text: event.name,
        color: MAIN_COLOR,
        font: new Font({ family: "SilkScreen", size: 14, unit: FontUnit.Px }),
      });
      const titleText = new TextEntity({
        text: `(${event.title})`,
        color: MAIN_COLOR,
        font: new Font({ family: "SilkScreen", size: 12, unit: FontUnit.Px }),
      });
      const talambuhayText = new TextEntity({
        text: event.talambuhay,
        color: MAIN_COLOR,
        font: new Font({ family: "SilkScreen", size: 10, unit: FontUnit.Px }),
      });
      const buodNgPagibigText = new TextEntity({
        text: event.buodNgPagibig,
        color: MAIN_COLOR,
        font: new Font({ family: "SilkScreen", size: 10, unit: FontUnit.Px }),
      });
      womanSprite.scale = vec(0.1, 0.1);

      // Create background rectangle with padding
      const padding = 5;

      // Create the graphics group without background first
      const textOffsetX = 120 + padding;
      const contentGroup = new GraphicsGroup({
        useAnchor: true,
        members: [
          {
            graphic: womanSprite,
            offset: vec(padding, padding),
          },
          {
            graphic: yearText,
            offset: vec(textOffsetX, 0),
          },
          {
            graphic: nameText,
            offset: vec(textOffsetX, 15 + padding),
          },
          {
            graphic: titleText,
            offset: vec(textOffsetX, 32  + padding),
          },
          {
            graphic: talambuhayText,
            offset: vec(textOffsetX, 49 + padding),
          },
          {
            graphic: buodNgPagibigText,
            offset: vec(textOffsetX, 95 + padding),
          },
        ],
      });

      // Get the dimensions of the content group
      const groupWidth = contentGroup.width;
      const groupHeight = contentGroup.height;

      // Create background rectangle based on content dimensions
      const background = new Rectangle({
        width: groupWidth + padding * 2,
        height: groupHeight + padding * 2,
        color: Color.fromHex("#221F19"),
        strokeColor: Color.fromHex("#552413"),
        lineWidth: 6,
      });

      // Create the final group with background as first element
      const finalGroup = new GraphicsGroup({
        useAnchor: true,
        members: [
          {
            graphic: background,
            offset: vec(15 + padding * 2, 0),
          },
          {
            graphic: contentGroup,
            offset: vec(padding, padding),
          },
        ],
      });

      woman.graphics.use(finalGroup);
      this.add(woman);
    });
  }

  setupCollisionGroups() {
    const solidLayers = this.tilemap.getLayersByProperty("solid", true);

    for (const layer of solidLayers) {
      const tilemap = (layer as any).tilemap as ex.TileMap;

      const body = tilemap.get(BodyComponent);
      body.group = CollisionGroup.Ground;
    }
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
    this.camera.zoom = 1.5;

    // @ts-expect-error - temporary to prioritize lockToActor over tilemap strategy
    this.camera._cameraStrategies.reverse();
  }

  setupWorldBounds() {
    const tilemapWidth = this.tilemap.map.width * this.tilemap.map.tilewidth;
    const tilemapHeight = this.tilemap.map.height * this.tilemap.map.tileheight;

    const bounds = new Actor({
      collisionType: CollisionType.Fixed,
      collider: new CompositeCollider([
        new EdgeCollider({
          begin: vec(0, 0),
          end: vec(0, tilemapHeight),
        }),
        new EdgeCollider({
          begin: vec(0, tilemapHeight),
          end: vec(tilemapWidth, tilemapHeight),
        }),
        new EdgeCollider({
          begin: vec(tilemapWidth, tilemapHeight),
          end: vec(tilemapWidth, 0),
        }),
        new EdgeCollider({
          begin: vec(tilemapWidth, 0),
          end: vec(0, 0),
        }),
      ]),
    });

    // create world bounds
    this.engine.add(bounds);
  }

  setupBackground() {
    // this.add(new Backgrounds(vec(0, 0)));
  }
}
