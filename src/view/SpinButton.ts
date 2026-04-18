import { Sprite, Text, Texture } from "pixi.js";
import { app } from "../main.js";
import { headerTextStyle } from "../textStyles.js";
import { GameContainer } from "../GameContainer.js";

export class SpinButton extends Sprite {
    private running: boolean = false;

    private static readonly SCALE_DEFAULT = { x: 0.4, y: 0.35 };
    private static readonly PRESSED_RATIO = 0.875;

    constructor() {
        super(Texture.from("button.png"));
        this.anchor.set(0.5);
        this.scale.set(SpinButton.SCALE_DEFAULT.x, SpinButton.SCALE_DEFAULT.y);

        const marginHeight = (GameContainer.DESIGN_HEIGHT - 150 * 3) / 2;
        this.x = GameContainer.DESIGN_WIDTH / 2;
        this.y = GameContainer.DESIGN_HEIGHT - marginHeight / 2;

        const buttonText = new Text("SPIN", headerTextStyle);
        buttonText.scale.set(3);
        buttonText.anchor.set(0.5);
        this.addChild(buttonText);

        this.setInteractivity();
        this.attachListeners();
    }

    private setInteractivity() {
        this.eventMode = "static";
        this.cursor = "pointer";
        this.on("pointerdown", () => {
            if (this.running) return;
            this.running = true;
            this.disable();
            app.stage.emit("start_spin");
        });
    }

    private attachListeners() {
        app.stage.on("spin_ended", () => {
            this.running = false;
            this.enable();
            console.log("Spin ended - UI notified");
        });
    }

    disable() {
        this.eventMode = "none";
        this.cursor = "default";
        this.scale.set(
            SpinButton.SCALE_DEFAULT.x * SpinButton.PRESSED_RATIO,
            SpinButton.SCALE_DEFAULT.y * SpinButton.PRESSED_RATIO,
        );
    }

    enable() {
        this.eventMode = "static";
        this.cursor = "pointer";
        this.scale.set(SpinButton.SCALE_DEFAULT.x, SpinButton.SCALE_DEFAULT.y);
    }
}
