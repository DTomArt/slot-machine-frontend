import {
  BlurFilter,
  Container,
  Graphics,
  Sprite,
  TextStyle,
  Texture,
  Text,
} from "pixi.js";
import { Configuration, Reel } from "./types.js";
import {ReelNew} from "./ReelNew.js";

// onAssetsLoaded handler builds the slot machine
export function onAssetsLoaded({ app, reelWidth, symbolSize }: Configuration): {
  button: Sprite;
  reels: Reel[];
  buttonText: Text;
} {
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
  const reels: Reel[] = [];
  const reelContainer = new Container();
  reelContainer.on("reelContainer", () => {
      debugger;
    });
    reelContainer.emit("reelContainer");
  reelContainer.name = "reelContainer";
  const mask = new Graphics().beginFill(0xff0000).drawRect(0, 0, reelWidth *6, symbolSize * 6).endFill();
  reelContainer.mask = mask;

  app.stage.addChild(mask);

  app.stage.addChild(new ReelNew());

  for (let i = 0; i < 3; i++) {
    const rc = new Container();
    // rc.x = i === 0 ? i * REEL_WIDTH : i * (REEL_WIDTH + 150);
    rc.x = i * reelWidth;
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
      symbol.y = j * symbolSize;
      symbol.scale.x = symbol.scale.y =
        Math.min(symbolSize / symbol.width, symbolSize / symbol.height) * 0.95;
      symbol.x = Math.round((symbolSize - symbol.width) / 2);
      // console.log(symbol.width);
      reel.symbols.push(symbol);
      rc.addChild(symbol);
    }
    reels.push(reel);
  }
  app.stage.addChild(reelContainer);

  // Build top, bottom, left & right covers and position reelContainer
  const margin = (app.screen.height - symbolSize * 3) / 2;
  reelContainer.y = margin;
  reelContainer.x = Math.round(app.screen.width - reelWidth * 3) / 2;
  const top = new Graphics();
  // top.beginFill(new Color("red").toArray(), 1);
  top.beginFill(0, 1);
  top.drawRect(0, 0, app.screen.width, margin - 5);
  // app.stage.addChild(top);
  const bottom = new Graphics();
  bottom.beginFill(0, 1);
  bottom.drawRect(0, symbolSize * 3 + margin - 5, app.screen.width, margin + 5);
  const left = new Graphics();
  left.beginFill(0, 1);
  left.drawRect(
    0,
    margin - 5,
    Math.round(app.screen.width - reelWidth * 5) / 2,
    app.screen.height - margin * 2
  );
  const right = new Graphics();
  right.beginFill(0, 1);
  right.drawRect(
    Math.round(app.screen.width - (app.screen.width - reelWidth * 5) / 2),
    margin - 5,
    Math.round(app.screen.width - reelWidth * 5) / 2,
    app.screen.height - margin * 2
  );

  // Build and position button
  const textureButton = Texture.from("button.png");
  const button = new Sprite(textureButton);
  button.scale.set(0.3, 0.25);
  button.anchor.set(0.5);
  //   button.x = Math.round((bottom.width - button.width) / 2);
  button.x = Math.round(app.screen.width / 2);
  button.y =
    app.screen.height -
    margin +
    Math.round((bottom.height - button.height) / 2);
  bottom.addChild(button);

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
    stroke: "#2403fc",
    strokeThickness: 3,
  });

  // Add button text
  const buttonText = new Text("SPIN", style);
  buttonText.scale.set(3);
  buttonText.anchor.set(0.5);
  button.addChild(buttonText);

  // Add header text
  const headerText = new Text("BLACK GOLD SLOT MACHINE", style);
  headerText.x = Math.round((top.width - headerText.width) / 2);
  headerText.y = Math.round((margin - headerText.height) / 2);
  top.addChild(headerText);

  app.stage.addChild(top);
  app.stage.addChild(bottom);
  app.stage.addChild(left);
  app.stage.addChild(right);

  return { button, reels, buttonText };
}
