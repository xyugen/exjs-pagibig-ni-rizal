import { TiledResource } from "@excaliburjs/plugin-tiled";
import { FontSource, ImageFiltering, ImageSource, Loader } from "excalibur";

// It is convenient to put your resources in one place
export const Resources = {
  sprites: {
    player: new ImageSource("./sprites/rizal-spritesheet.png"),
    background: new ImageSource("./sprites/backgrounds/main-bg.png"),
    // tilemap: new ImageSource("./sprites/tileset-1.png"),
  },
  fonts: {
    pixel: new FontSource("./fonts/silkscreen-regular.woff2", "SilkScreen", {
      filtering: ImageFiltering.Pixel,
      quality: 4,
    }),
    round: new FontSource("./fonts/round9x13.woff2", "Round9x13", {
      filtering: ImageFiltering.Pixel,
      quality: 4,
    }),
  },
  tiled: {
    main: new TiledResource("./tilemaps/tileset.tmx", {
      useTilemapCameraStrategy: true,
    }),
  },
} as const; // the 'as const' is a neat typescript trick to get strong typing on your resources.
// So when you type Resources.Sword -> ImageSource

// instantly starts game once loading has completed
class DevLoader extends Loader {
  showPlayButton() {
    return Promise.resolve();
  }

  draw() {}
  dispose() {}
}

export const loader = new DevLoader();
process.env.NODE_ENV === "development" ? new DevLoader() : new Loader();

for (const group of Object.values(Resources)) {
  for (const resource of Object.values(group)) {
    loader.addResource(resource);
  }
}
