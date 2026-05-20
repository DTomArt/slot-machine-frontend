import { Container } from "pixi.js";

import { SpinButton } from "./SpinButton.js";
import { CounterWithText } from "./CounterWithText.js";
import { GameContainer } from "../GameContainer.js";
import { layout } from "../layout.js";

export class UI extends Container {

    protected button: SpinButton;
    protected coinsInCounter: CounterWithText;
    protected winCounter: CounterWithText;
    protected totalWinCounter: CounterWithText;


    constructor() {
        super();
        this.createElements();
    }

    private createElements() {
        this.button = new SpinButton();
        this.addChild(this.button);

        const centerX = layout.spinButton.x;
        const centerY = layout.spinButton.y;
        const spread = GameContainer.spreadX;

        this.coinsInCounter = new CounterWithText({
            texture: layout.coinsInCounter.texture,
            title: layout.coinsInCounter.title,
            value: "0",
            positionX: centerX + this.button.width * layout.coinsInCounter.offsetX * spread,
            positionY: centerY,
            scale: layout.coinsInCounter.scale,
        });

        this.winCounter = new CounterWithText({
            texture: layout.winCounter.texture,
            title: layout.winCounter.title,
            value: "0",
            positionX: centerX + this.button.width * layout.winCounter.offsetX * spread,
            positionY: centerY,
            scale: layout.winCounter.scale,
        });

        this.totalWinCounter = new CounterWithText({
            texture: layout.totalWinCounter.texture,
            title: layout.totalWinCounter.title,
            value: "0",
            positionX: centerX + (this.button.width + this.winCounter.width) * layout.totalWinCounter.offsetX / 2 * spread,
            positionY: centerY,
            scale: layout.totalWinCounter.scale,
            valueInHalfOfTexture: layout.totalWinCounter.valueInHalfOfTexture,
        });

        this.addChild(this.coinsInCounter, this.winCounter, this.totalWinCounter);
    }
}