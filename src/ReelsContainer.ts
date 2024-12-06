import { Container, Sprite, Texture } from "pixi.js";
import { Reel } from "./types.js";
import { ReelContainer } from "./ReelContainer.js";
import { app, REEL_WIDTH, SYMBOL_SIZE } from "./main.js";

export class ReelsContainer extends Container {
  private reels: Reel[] = [];

  constructor() {
    super();

    this.initDiamonds();

    const slotTextures = [
      Texture.from("singleBar.png"),
      Texture.from("doubleBar.png"),
      Texture.from("tripleBar.png"),
      Texture.from("blackGold.png"),
    ];

    // Create different slot textures
    const reelStrips = [
      [1, 2, 1, 0, 3, 1, 2, 0, 2, 3],
      [1, 1, 1, 2, 2, 0, 2, 0, 3, 0, 1, 2, 0, 1, 0],
      [2, 1, 2, 0, 2, 0, 3, 2],
    ];

    for (let i = 0; i < 3; i++) {
      const reelContainer = new ReelContainer(i, reelStrips[i], slotTextures);
      this.reels.push({
        ...reelContainer,
        position: reelContainer.reelPositionX,
      });
      this.addChild(reelContainer);
    }
  }

  initDiamonds() {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 3; j++) {
        const diamond = new Sprite(Texture.from("diamond.png"));
        diamond.x = REEL_WIDTH + app.screen.width / 3 - i * REEL_WIDTH;
        diamond.y = SYMBOL_SIZE * j;
        this.addChild(diamond);
      }
    }
  }

  getReels() {
    return this.reels;
  }
}
