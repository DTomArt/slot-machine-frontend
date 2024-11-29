import { Application } from "pixi.js";
import { preload } from "./preload.js";
import { onAssetsLoaded } from "./onAssetsLoaded.js";
import { Configuration } from "./types.js";
import { setInteractivity } from "./setInteractivity.js";
import * as PIXI from "pixi.js";

export const REEL_WIDTH = 300;
export const SYMBOL_SIZE = 150;

// Create the application
export const app = new Application<HTMLCanvasElement>({
  background: "#000000",
  // background: "#FFFFFF",
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
