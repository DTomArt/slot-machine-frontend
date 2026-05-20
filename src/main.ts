import { Application } from "pixi.js";
import { onAssetsLoaded } from "./onAssetsLoaded.js";
import { Configuration } from "./types.js";
import { PlayController } from "./PlayController.js";
import * as PIXI from "pixi.js";
import { preload } from "./preloader/preload.js";

export const REEL_WIDTH = 350;


// Create the application
export const app = new Application<HTMLCanvasElement>({
    background: "#000000",
    resizeTo: window,
    antialias: false,
    autoDensity: true,
    width: window.innerWidth,
    height: window.innerHeight,
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
    };
    await setup();
    await preload();
    const reels = onAssetsLoaded(configuration);
    new PlayController(reels);
    app.renderer.on('resize', (width, height) => {
        app.stage.emit('resize', { width, height });
    });
})();

async function setup() {
    app.view.style.position = "absolute";
    document.body.appendChild(app.view);
}
