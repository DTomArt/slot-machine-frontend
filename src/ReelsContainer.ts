import { Container, Texture } from "pixi.js";
import { Reel } from "./types.js";
import { ReelContainer } from "./ReelContainer.js";

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

    for (let i = 0; i < 3; i++) {
      const reelContainer = new ReelContainer(i, reelStrips[i], slotTextures);
      this.reels.push({
        ...reelContainer,
        position: reelContainer.reelPositionX,
      });
      this.addChild(reelContainer);
    }
  }

  getReels() {
    return this.reels;
  }
}
