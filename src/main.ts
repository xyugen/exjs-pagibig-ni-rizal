import {
  Color,
  ContactSolveBias,
  DisplayMode,
  Engine,
  FadeInOut,
} from "excalibur";
import { GRAVITY } from "./physics/gravity";
import { loader } from "./resources";
import MainScene from "./scenes/main-scene";

// Goal is to keep main.ts small and just enough to configure the engine

const game = new Engine({
  width: 800, // Logical width and height in game pixels
  height: 600,
  displayMode: DisplayMode.FitScreenAndFill, // Display mode tells excalibur how to fill the window
  pixelRatio: 2,
  pixelArt: true, // pixelArt will turn on the correct settings to render pixel art without jaggies or shimmering artifacts
  scenes: {
    main: MainScene,
  },
  physics: {
    gravity: GRAVITY,
    arcade: {
      contactSolveBias: ContactSolveBias.VerticalFirst,
    },
    colliders: {
      compositeStrategy: "separate",
    },
  },
  // fixedUpdateTimestep: 16 // Turn on fixed update timestep when consistent physic simulation is important
});

game
  .start("main", {
    // name of the start scene 'main'
    loader, // Optional loader (but needed for loading images/sounds)
    inTransition: new FadeInOut({
      // Optional in transition
      duration: 1000,
      direction: "in",
      color: Color.ExcaliburBlue,
    }),
  })
  .then(() => {
    game.screen.pixelRatioOverride = 2;
    game.screen.applyResolutionAndViewport();
  });
