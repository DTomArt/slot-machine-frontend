import { Application, BlurFilter, Container, Sprite } from "pixi.js";

export interface Configuration {
  app: Application<HTMLCanvasElement>;
  reelWidth: number;
  symbolSize: number;
}

export interface Reel {
  container: Container;
  strip: number[];
  symbols: Sprite[];
  reelBackground: Sprite;
  position: number;
  previousPosition: number;
  blur: BlurFilter;
}
