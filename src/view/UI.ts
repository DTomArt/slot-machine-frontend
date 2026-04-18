import { Container, Texture } from "pixi.js";
import { SYMBOL_SIZE } from "../main.js";
import { SpinButton } from "./SpinButton.js";
import { CounterWithText } from "./CounterWithText.js";
import { GameContainer } from "../GameContainer.js";

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
        const designWidth = GameContainer.DESIGN_WIDTH;
        const designHeight = GameContainer.DESIGN_HEIGHT;
        const marginHeight = (designHeight - SYMBOL_SIZE * 3) / 2;

        this.button = new SpinButton();
        this.addChild(this.button);

        const centerX = Math.round(designWidth / 2);
        const centerY = designHeight - marginHeight / 2;
        const spread = GameContainer.spreadX;

        this.coinsInCounter = new CounterWithText({
            texture: "counter.png",
            title: "COINS IN",
            value: "0",
            positionX: centerX - this.button.width * spread,
            positionY: centerY,
        });

        this.winCounter = new CounterWithText({
            texture: "counter.png",
            title: "TOTAL WIN",
            value: "0",
            positionX: centerX + this.button.width * spread,
            positionY: centerY,
        });

        this.totalWinCounter = new CounterWithText({
            texture: "counterSmall.png",
            title: "WIN",
            value: "0",
            positionX: centerX + (this.button.width + this.winCounter.width) * spread,
            positionY: centerY,
            scale: { x: 0.35, y: 0.3 },
            valueInHalfOfTexture: true,
        });

        this.addChild(this.coinsInCounter, this.winCounter, this.totalWinCounter);
    }
}