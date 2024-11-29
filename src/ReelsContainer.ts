import { BlurFilter, Container, Graphics, Sprite, Texture } from "pixi.js";
import { Reel } from "./types.js";
import { REEL_WIDTH, SYMBOL_SIZE } from "./main.js";

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

    for (let i = 0; i < 3; i++) {
      const rc = new Container();
      // rc.x = i === 0 ? i * REEL_WIDTH : i * (REEL_WIDTH + 150);
      rc.x = i * REEL_WIDTH;
      this.addChild(rc);

      const reel: Reel = {
        container: rc,
        strip: [],
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur: new BlurFilter(),
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
        symbol.y = j * SYMBOL_SIZE;
        symbol.scale.x = symbol.scale.y =
          Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height) *
          0.95;
        symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
        // console.log(symbol.width);
        reel.symbols.push(symbol);
        rc.addChild(symbol);
      }
      reels.push(reel);
    }
    this.reels = reels;
    const mask = new Graphics()
      .beginFill(0xff0000)
      .drawRect(0, 0, REEL_WIDTH * 6, SYMBOL_SIZE * 5)
      .endFill();
    this.mask = mask;
  }

  getReels() {
    return this.reels;
  }
}
