import {
  BlurFilter,
  Container,
  Graphics,
  Resource,
  Sprite,
  Texture,
} from "pixi.js";
import { app, REEL_WIDTH, SYMBOL_SIZE } from "./main.js";

export class ReelContainer extends Container {
  public id: number;
  public strip: number[];
  public symbols: Sprite[] = [];
  public reelPositionX: number;
  public reelPositionY: number;
  public previousPosition: number = 0;
  public blur: BlurFilter = new BlurFilter();
  public reelBackground: Sprite;

  constructor(
    reelId: number,
    reelStrips: number[],
    slotTextures: Texture<Resource>[]
  ) {
    super();

    this.id = reelId;
    this.strip = reelStrips;
    // add reel background
    const reelBackground = new Sprite(Texture.from("symbolBack.png"));
    // center the sprite's anchor point
    reelBackground.anchor.set(0.5);
    reelBackground.scale.x = 0.22;
    reelBackground.scale.y = 0.45;
    reelBackground.y = app.screen.height / 4;
    reelBackground.x =
      reelId === 0
        ? app.screen.width / 2
        : reelId === 2
        ? app.screen.width / 2 - REEL_WIDTH
        : app.screen.width / 2 + REEL_WIDTH;
    this.addChild(reelBackground);
    this.reelBackground = reelBackground;

    const rc = new Container();
    // rc.x = i * REEL_WIDTH;
    rc.x =
      reelId === 0
        ? app.screen.width / 2
        : reelId === 2
        ? app.screen.width / 2 - REEL_WIDTH
        : app.screen.width / 2 + REEL_WIDTH;
    this.addChild(rc);

    this.reelPositionX = rc.x;
    this.reelPositionY = rc.x;
    this.reelBackground = reelBackground;

    // Randomise start of sequence
    const randomStartIndex = Math.floor(Math.random() * reelStrips.length);
    const randomStartSequence = [
      ...reelStrips.slice(randomStartIndex),
      ...reelStrips.slice(0, randomStartIndex),
    ];
    this.strip.push(...randomStartSequence);
    this.blur.blurX = 0;
    this.blur.blurY = 0;
    rc.filters = [this.blur];

    // Build the symbols
    for (let j = 0; j < this.strip.length; j++) {
      const texturesIndex = this.strip[j];
      const symbol = new Sprite(slotTextures[texturesIndex]);
      // Scale the symbol to fit symbol area
      symbol.anchor.set(0.5);
      symbol.y = j * SYMBOL_SIZE;
      symbol.scale.x = symbol.scale.y =
        Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height) *
        0.95;
      symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
      this.symbols.push(symbol);
      rc.addChild(symbol);
    }

    const symbolsInRangeMask = new Graphics()
      .beginFill(0xff0000)
      .drawRect(
        this.reelBackground.x - SYMBOL_SIZE / 2,
        this.reelBackground.y,
        REEL_WIDTH * 2,
        this.reelBackground.height - 30
      )
      .endFill();
    rc.mask = symbolsInRangeMask;
  }
}
