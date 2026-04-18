import { Container } from "pixi.js";
import { app } from "./main.js";

/**
 * Root container that scales all children uniformly to fit the screen.
 * Design at DESIGN_WIDTH x DESIGN_HEIGHT, and everything scales automatically.
 */
export class GameContainer extends Container {
    static readonly DESIGN_WIDTH = 1920;
    static readonly DESIGN_HEIGHT = 1080;
    private static readonly PORTRAIT_THRESHOLD = 800;

    /** How much to spread elements horizontally from center (1.0 = default, >1 = wider) */
    static spreadX: number = 1;

    constructor() {
        super();
        this.resize();
        app.stage.on("resize", () => this.resize());
    }

    private resize() {
        const scaleX = app.screen.width / GameContainer.DESIGN_WIDTH;
        const scaleY = app.screen.height / GameContainer.DESIGN_HEIGHT;
        const scaleUniform = Math.min(scaleX, scaleY);

        // In landscape, use scaleY for height but stretch X to fill width
        // if (app.screen.width > GameContainer.PORTRAIT_THRESHOLD) {
        //     GameContainer.spreadX = scaleX / scaleY;
        //     this.scale.set(scaleX, scaleY);
        //     this.x = 0;
        //     this.y = 0;
        // } else {
        // Portrait: uniform scale, centered
        GameContainer.spreadX = 1;
        this.scale.set(scaleUniform);
        this.x = (app.screen.width - GameContainer.DESIGN_WIDTH * scaleUniform) / 2;
        this.y = (app.screen.height - GameContainer.DESIGN_HEIGHT * scaleUniform) / 2;
        // }
    }
}
