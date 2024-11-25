import {
  Application,
  Assets,
  BlurFilter,
  Color,
  Container,
  Graphics,
  Sprite,
  TextStyle,
  Texture,
  Text,
} from "pixi.js";
import { sound } from "@pixi/sound";
import { play } from "../slot-machine/src/play.js";

// Create the application
export const app = new Application<HTMLCanvasElement>({
  // background: "#000000",
  background: "#FFFFFF",
  resizeTo: window,
  antialias: false,
  // resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  width: window.innerWidth,
  height: window.innerHeight,
  // backgroundAlpha: 0.2,
});

(async () => {
  await setup();
  await preload();
  onAssetsLoaded();
})();

async function setup() {
  app.view.style.position = "absolute";
  document.body.appendChild(app.view);
}

async function preload() {
  const assets = [
    { alias: "singleBar.png", src: "src/static/img/300px/SINGLE_BAR.png" },
    { alias: "doubleBar.png", src: "src/static/img/300px/DOUBLE_BAR.png" },
    { alias: "tripleBar.png", src: "src/static/img/300px/TRIPLE_BAR.png" },
    { alias: "blackGold.png", src: "src/static/img/300px/BLACK_GOLD.png" },
    { alias: "symbolBack.png", src: "src/static/img/300px/SYMBOL_BACK.png" },
    { alias: "button.png", src: "src/static/img/300px/BUTTON.png" },
  ];
  assets.map((o) => Assets.add(o.alias, o.src));
  await Assets.load(assets.map((a) => a.alias));

  sound.add("spin", "src/static/sound/spin.mp3");
  sound.add("win", "src/static/sound/win.mp3");
  sound.volume("spin", 0.01);
  sound.volume("win", 0.05);
}

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;

// onAssetsLoaded handler builds the slot machine
function onAssetsLoaded() {
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

  // Create each reel
  interface Reel {
    container: Container;
    strip: number[];
    symbols: Sprite[];
    position: number;
    previousPosition: number;
    blur: BlurFilter;
  }
  const reels: Reel[] = [];
  const reelContainer = new Container();

  for (let i = 0; i < 3; i++) {
    const rc = new Container();
    // rc.x = i === 0 ? i * REEL_WIDTH : i * (REEL_WIDTH + 150);
    rc.x = i * REEL_WIDTH;
    reelContainer.addChild(rc);

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
      console.log(symbol.width);
      reel.symbols.push(symbol);
      rc.addChild(symbol);
    }
    reels.push(reel);
  }
  app.stage.addChild(reelContainer);

  // Build top, bottom, left & right covers and position reelContainer
  const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
  reelContainer.y = margin;
  reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 3) / 2;
  const top = new Graphics();
  // top.beginFill(new Color("red").toArray(), 1);
  top.beginFill(0, 1);
  top.drawRect(0, 0, app.screen.width, margin - 5);
  // app.stage.addChild(top);
  const bottom = new Graphics();
  bottom.beginFill(0, 1);
  bottom.drawRect(
    0,
    SYMBOL_SIZE * 3 + margin - 5,
    app.screen.width,
    margin + 5
  );
  const left = new Graphics();
  left.beginFill(0, 1);
  left.drawRect(
    0,
    margin - 5,
    Math.round(app.screen.width - REEL_WIDTH * 5) / 2,
    app.screen.height - margin * 2
  );
  const right = new Graphics();
  right.beginFill(0, 1);
  right.drawRect(
    Math.round(app.screen.width - (app.screen.width - REEL_WIDTH * 5) / 2),
    margin - 5,
    Math.round(app.screen.width - REEL_WIDTH * 5) / 2,
    app.screen.height - margin * 2
  );

  // // Build and position button
  const textureButton = Texture.from("button.png");
  const button = new Sprite(textureButton);
  button.scale.set(0.3, 0.25);
  button.anchor.set(0.5);
  button.x = Math.round((bottom.width - button.width) / 2);
  button.y =
    app.screen.height -
    margin +
    Math.round((bottom.height - button.height) / 2);
  bottom.addChild(button);

  // Add buttonDown effect
  // const onButtonDown = function () {
  //   button.scale.set(0.25, 0.2);
  //   buttonText.scale.set(2.95);
  // };
  // const onButtonUp = function () {
  //   button.scale.set(0.3, 0.25);
  //   buttonText.scale.set(3);
  // };

  // Add text style
  const style = new TextStyle({
    fill: "#ffffff",
    fillGradientStops: [0.6],
    fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
    fontSize: 36,
    fontVariant: "small-caps",
    fontWeight: "bold",
    letterSpacing: 2,
    lineJoin: "round",
    stroke: "#f20707",
    strokeThickness: 4,
  });

  // Add button text
  const buttonText = new Text("SPIN!", style);
  buttonText.scale.set(3);
  buttonText.anchor.set(0.5);
  button.addChild(buttonText);

  // Add header text
  const headerText = new Text("MY FIRST SLOT MACHINE", style);
  headerText.x = Math.round((top.width - headerText.width) / 2);
  headerText.y = Math.round((margin - headerText.height) / 2);
  top.addChild(headerText);

  app.stage.addChild(top);
  app.stage.addChild(bottom);
  app.stage.addChild(left);
  app.stage.addChild(right);
}

// const rectangle = new Graphics();
// rectangle.beginFill(0x0000ff);
// rectangle.drawRect(100, 100, 600, 100);
// // rectangle.fill.color = 0x0000ff;

// app.stage.addChild(rectangle);

// // Create a Graphics object, set a fill color, draw a rectangle
// let obj = new Graphics();
// obj.beginFill(0xff0000);
// obj.drawRect(0, 0, 200, 100);

// // Add it to the stage to render
// app.stage.addChild(obj);
//////////////////////////////////////
// // create a new Sprite from an image path
// const bunny = Sprite.from("https://pixijs.com/assets/bunny.png");

// // center the sprite's anchor point
// bunny.anchor.set(0.5);

// // move the sprite to the center of the screen
// bunny.x = app.screen.width / 2;
// bunny.y = app.screen.height / 2;

// app.stage.addChild(bunny);
