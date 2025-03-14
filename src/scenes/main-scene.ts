import LevelScene from "../classes/level-scene";
import { Resources } from "../resources";

export default class MainScene extends LevelScene {
  constructor() {
    super({
      tilemap: Resources.tiled.main,
      background: Resources.sprites.background,
    });
  }
}
