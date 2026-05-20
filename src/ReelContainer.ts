import {
    BlurFilter,
    Container,
    Graphics,
    Resource,
    Sprite,
    Texture,
} from "pixi.js";
import { REEL_WIDTH } from "./main.js";
import { SYMBOL_SIZE } from "./layout.js";
import { GameContainer } from "./GameContainer.js";

export class ReelContainer extends Container {
    public symbols: Sprite[] = [];
    public reelPositionX: number;
    public reelPositionY: number;
    public previousPosition: number = 0;
    public blur: BlurFilter;
    public reelBackground: Sprite;
    public rc: Container;
    public reelMask: Graphics;

    constructor(
        public id: number,
        public strip: number[],
        private slotTextures: Texture<Resource>[]
    ) {
        super();

        this.init();
    }

    private init() {
        // this.setUpRandomStrip();
        this.createElements();
    }

    private setUpRandomStrip() {
        // Randomise start of sequence
        const randomStartIndex = Math.floor(Math.random() * this.strip.length);
        const randomStartSequence = [
            ...this.strip.slice(randomStartIndex),
            ...this.strip.slice(0, randomStartIndex),
        ];
        this.strip.push(...randomStartSequence);
    }

    private createElements() {
        this.reelBackground = this.createReelBackground();
        this.blur = this.createBlur();
        this.reelMask = this.createReelMask();
        this.rc = this.createReelContainer();
        this.symbols = this.createSymbols();
    }

    private getReelX(): number {
        const center = GameContainer.DESIGN_WIDTH / 2;
        const offset = this.id === 0 ? 0 : this.id === 2 ? -REEL_WIDTH : REEL_WIDTH;
        return center + offset * GameContainer.spreadX;
    }

    private createReelBackground(): Sprite {
        // add reel background
        const reelBackground = new Sprite(Texture.from("symbolBack.png"));
        // center the sprite's anchor point
        reelBackground.anchor.set(0.5, 0);
        reelBackground.scale.x = 0.22;
        reelBackground.scale.y = 0.45;
        reelBackground.x = this.getReelX();
        return this.addChild(reelBackground);
    }

    private createReelMask(): Graphics {
        const reelBackgroundFrameTop = 15;
        const reelBackgroundFrameBottom = 30;
        // Mask is relative to ReelsContainer which already has y = marginHeight
        const symbolsInRangeMask = new Graphics()
            .beginFill(0xff0000)
            .drawRect(
                this.reelBackground.x - REEL_WIDTH / 2,
                reelBackgroundFrameTop,
                REEL_WIDTH,
                this.reelBackground.height - reelBackgroundFrameBottom
            )
            .endFill();
        return this.addChild(symbolsInRangeMask);
    }

    private createReelContainer(): Container {
        const rc = new Container();
        rc.x = this.getReelX();

        rc.filters = [this.blur];
        rc.mask = this.reelMask;

        this.reelPositionX = rc.x;
        this.reelPositionY = rc.y;

        return this.addChild(rc);
    }

    private createBlur(): BlurFilter {
        const blur = new BlurFilter();
        blur.blurX = 0;
        blur.blurY = 0;

        return blur;
    }

    private createSymbols(): Sprite[] {
        const symbols = [];
        // Build the symbols
        for (let j = 0; j < this.strip.length; j++) {
            const texturesIndex = this.strip[j];
            const symbol = new Sprite(this.slotTextures[texturesIndex]);
            // Scale the symbol to fit symbol area
            symbol.anchor.set(0.5, 0);
            symbol.y = j * SYMBOL_SIZE;
            symbol.scale.x = symbol.scale.y =
                Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height) *
                0.95;
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            symbols.push(symbol);
            this.rc.addChild(symbol);
        }

        return symbols;
    }
}
