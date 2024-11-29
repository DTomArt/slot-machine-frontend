import { Application } from "pixi.js";
import { preload } from "./preload.js";
import { onAssetsLoaded } from "./onAssetsLoaded.js";
import { Configuration } from "./types.js";
import { setInteractivity } from "./setInteractivity.js";
import * as PIXI from "pixi.js";

export const REEL_WIDTH = 160;
export const SYMBOL_SIZE = 150;

// Create the application
export const app = new Application<HTMLCanvasElement>({
  // background: "#000000",
  background: "#FFFFFF",
  resizeTo: window,
  antialias: false,
  // resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  width: window.innerWidth,
  height: window.innerHeight,
  // backgroundAlpha: 0.2,
});

(<any>window).__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
  (<any>window).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({
    PIXI: PIXI,
  });

//@ts-ignore
globalThis.__PIXI_STAGE__ = app.stage;
//@ts-ignore
globalThis.__PIXI_RENDERER__ = app.renderer;

(async () => {
  const configuration: Configuration = {
    app,
    reelWidth: 160,
    symbolSize: 150,
  };
  await setup();
  await preload();
  const { button, buttonText, reels } = onAssetsLoaded(configuration);
  setInteractivity(configuration, { button, buttonText, reels });
})();

async function setup() {
  app.view.style.position = "absolute";
  document.body.appendChild(app.view);
}

// const rectangle = new Graphics();
// rectangle.beginFill(0x0000ff);
// rectangle.drawRect(100, 100, 600, 100);
// // rectangle.fill.color = 0x0000ff;

// app.stage.addChild(rectangle);

// // Create a Graphics object, set a fill color, draw a rectangle
// let obj = new Graphics();
// obj.beginFill(0xff0000);
// obj.drawRect(0, 0, 200, 100);

// // Add it to the stage to render
// app.stage.addChild(obj);
//////////////////////////////////////
// // create a new Sprite from an image path
// const bunny = Sprite.from("https://pixijs.com/assets/bunny.png");

// // center the sprite's anchor point
// bunny.anchor.set(0.5);

// // move the sprite to the center of the screen
// bunny.x = app.screen.width / 2;
// bunny.y = app.screen.height / 2;

// app.stage.addChild(bunny);
