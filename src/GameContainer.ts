import { Container } from "pixi.js";
import { app } from "./main.js";

/**
 * Root container that scales all children uniformly to fit the screen.
 * Design at DESIGN_WIDTH x DESIGN_HEIGHT, and everything scales automatically.
 */
export class GameContainer extends Container {
    static readonly DESIGN_WIDTH = 1920;
    static readonly DESIGN_HEIGHT = 1080;
    private static readonly PORTRAIT_THRESHOLD = 900;

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

        if (app.screen.width > GameContainer.PORTRAIT_THRESHOLD) {
            // Landscape: fill viewport, no margins
            const scale = Math.max(scaleX, scaleY);
            GameContainer.spreadX = 1;
            this.scale.set(scale);
            this.x = (app.screen.width - GameContainer.DESIGN_WIDTH * scale) / 2;
            this.y = (app.screen.height - GameContainer.DESIGN_HEIGHT * scale) / 2;
        } else {
            // Portrait: fill screen width, scale down uniformly
            const scale = app.screen.width / (GameContainer.DESIGN_WIDTH * 0.55);
            GameContainer.spreadX = 1;
            this.scale.set(scale);
            this.x = (app.screen.width - GameContainer.DESIGN_WIDTH * scale) / 2;
            this.y = (app.screen.height - GameContainer.DESIGN_HEIGHT * scale) / 2;
        }
    }
}
