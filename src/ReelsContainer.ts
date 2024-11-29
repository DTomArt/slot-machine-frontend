import { BlurFilter, Container, Graphics, Sprite, Texture } from "pixi.js";
import { Reel } from "./types.js";
import { app, REEL_WIDTH, SYMBOL_SIZE } from "./main.js";

export class ReelsContainer extends Container {
  private reels: Reel[] = [];

  constructor() {
    super();

    const slotTextures = [
      Texture.from("singleBar.png"),
      Texture.from("doubleBar.png"),
      Texture.from("tripleBar.png"),
      Texture.from("blackGold.png"),
    ];

    // Create different slot textures
    const reelStrips = [
      [1, 2, 1, 3, 3, 1, 2, 0, 2, 3],
      [1, 1, 1, 2, 2, 0, 2, 3, 3, 3, 3, 1, 2, 2, 0],
      [3, 1, 2, 3, 2, 3, 3, 2],
    ];

    const reels: Reel[] = [];

    const mask = new Graphics()
      .beginFill(0xff0000)
      .drawRect(0, 0, REEL_WIDTH * 5, SYMBOL_SIZE * 6)
      .endFill();
    this.mask = mask;

    const backgroundContainer = new Container();
    this.addChild(backgroundContainer);
    const symbolsMask = new Graphics()
      .beginFill(0xff0000)
      .drawRect(0, 0, REEL_WIDTH * 5, SYMBOL_SIZE * 5)
      .endFill();
    backgroundContainer.mask = symbolsMask;

    for (let i = 0; i < 3; i++) {
      // add reel background
      const reelBackground = new Sprite(Texture.from("symbolBack.png"));
      // center the sprite's anchor point
      reelBackground.anchor.set(0.5);
      reelBackground.scale.x = 0.22;
      reelBackground.scale.y = 0.45;
      reelBackground.y = (app.screen.height - SYMBOL_SIZE * 3) / 2 + 15;
      reelBackground.x =
        i === 0
          ? app.screen.width / 2
          : i === 2
          ? app.screen.width / 2 - REEL_WIDTH
          : app.screen.width / 2 + REEL_WIDTH;
      backgroundContainer.addChild(reelBackground);

      const rc = new Container();
      // rc.x = i * REEL_WIDTH;
      rc.x =
        i === 0
          ? app.screen.width / 2
          : i === 2
          ? app.screen.width / 2 - REEL_WIDTH
          : app.screen.width / 2 + REEL_WIDTH;
      backgroundContainer.addChild(rc);

      const reel: Reel = {
        container: rc,
        strip: [],
        symbols: [],
        position: rc.x,
        previousPosition: 0,
        blur: new BlurFilter(),
        reelBackground,
      };

      // Randomise start of sequence
      const randomStartIndex = Math.floor(Math.random() * reelStrips[i].length);
      const randomStartSequence = [
        ...reelStrips[i].slice(randomStartIndex),
        ...reelStrips[i].slice(0, randomStartIndex),
      ];
      reel.strip.push(...randomStartSequence);
      reel.blur.blurX = 0;
      reel.blur.blurY = 0;
      rc.filters = [reel.blur];

      // Build the symbols
      for (let j = 0; j < reel.strip.length; j++) {
        const texturesIndex = reel.strip[j];
        const symbol = new Sprite(slotTextures[texturesIndex]);
        // Scale the symbol to fit symbol area
        symbol.anchor.set(0.5);
        symbol.y = j * SYMBOL_SIZE;
        symbol.scale.x = symbol.scale.y =
          Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height) *
          0.95;
        symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
        // console.log(symbol.width);
        reel.symbols.push(symbol);
        rc.addChild(symbol);
      }

      const mask = new Graphics()
        .beginFill(0xff0000)
        .drawRect(
          reel.reelBackground.x - SYMBOL_SIZE / 2,
          reel.reelBackground.y,
          REEL_WIDTH * 2,
          reel.reelBackground.height - 30
        )
        .endFill();
      rc.mask = mask;

      reels.push(reel);
    }
    this.reels = reels;
  }

  getReels() {
    return this.reels;
  }
}
