import { Sprite, Text, Texture } from "pixi.js";
import { app } from "../main.js";
import { headerTextStyle } from "../textStyles.js";
import { layout } from "../layout.js";

export class SpinButton extends Sprite {
    private running: boolean = false;

    constructor() {
        super(Texture.from("button.png"));
        this.anchor.set(0.5);
        this.scale.set(layout.spinButton.scale.x, layout.spinButton.scale.y);

        this.x = layout.spinButton.x;
        this.y = layout.spinButton.y;

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
            layout.spinButton.scale.x * layout.spinButton.pressedRatio,
            layout.spinButton.scale.y * layout.spinButton.pressedRatio,
        );
    }

    enable() {
        this.eventMode = "static";
        this.cursor = "pointer";
        this.scale.set(layout.spinButton.scale.x, layout.spinButton.scale.y);
    }
}
