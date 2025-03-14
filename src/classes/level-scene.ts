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
  Label,
  Scene,
  TextAlign,
  vec,
} from "excalibur";
import { CollisionGroup } from "../physics/collision";
import { Resources } from "../resources";
import { Woman } from "../actors/woman";
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
    // const women = this.entities.filter((e) => e instanceof Woman);
    const womanEntity = this.entities.find((e) => e instanceof Woman) as Woman;

    if (!womanEntity) {
      console.warn("Woman not found in scene entities.");
      return;
    }

    // if (women.length == 0) {
    //   console.warn("Women not found in scene entities.");
    //   return;
    // }

    // women.forEach((woman) => {
    //   console.log(woman.globalPos.x);
    // });

    console.log(womanEntity);

    const womenImages = Resources.womenSprites;
    Object.values(womenImages).forEach((womanImage, index) => {
      const womanSprite = womanImage.toSprite();
      const woman = new Woman({
        x: womanEntity.globalPos.x + (500 * index),
        y: womanEntity.globalPos.y,
      });
      womanSprite.scale = vec(0.1, 0.1);
      woman.graphics.use(womanSprite);
      this.add(woman);
    });
    // const womenImages = Resources.womenSprites;
    // Object.values(women).forEach((woman, index) => {
    //   const womanSprite = Object.values(womenImages)[index].toSprite();
    //   womanSprite.scale = vec(0.1, 0.1);
    //   woman.graphics.use(womanSprite);
    // });
    // Object.values(womenImages).forEach((sprite, index) => {
    //   const womanSprite = sprite.toSprite();
    //   women[index].graphics.use(womanSprite);
    // });
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
