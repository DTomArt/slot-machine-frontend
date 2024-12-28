import { Graphics, Sprite, TextStyle, Texture, Text } from "pixi.js";
import { Configuration, Reel } from "./types.js";
import { ReelsContainer } from "./ReelsContainer.js";
import { REEL_WIDTH, SYMBOL_SIZE } from "./main.js";

// onAssetsLoaded handler builds the slot machine
export function onAssetsLoaded({ app }: Configuration): {
  button: Sprite;
  reels: Reel[];
  buttonText: Text;
} {
  // Build top, bottom, left & right covers and position reelContainer
  const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
  const reelsContainer = new ReelsContainer(margin);
  const reels = reelsContainer.getReels();

  const top = new Graphics();
  top.beginFill(0, 1);
  top.drawRect(0, 0, app.screen.width, margin);

  const bottom = new Graphics();
  bottom.beginFill(0, 1);
  bottom.drawRect(
    0,
    top.height + reelsContainer.height,
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

  // Build and position button
  const textureButton = Texture.from("button.png");
  const button = new Sprite(textureButton);
  button.scale.set(0.4, 0.35);
  button.anchor.set(0.5);
  button.x = Math.round(app.screen.width / 2);
  button.y = app.screen.height - margin / 2;
  bottom.addChild(button);

  // Add text style
  const counterTextStyle = new TextStyle({
    fill: "#C2C2D2",
    fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
    fontSize: 43,
    fontVariant: "small-caps",
    fontWeight: "bold",
    letterSpacing: 2,
    lineJoin: "round",
  });

  // Build and position totalWinCounter
  const textureCounter = Texture.from("counter.png");
  const totalWinCounter = new Sprite(textureCounter);
  const setCounterProps = (counterSprite: Sprite, rightSide: boolean) => {
    counterSprite.scale.set(0.35, 0.25);
    counterSprite.anchor.set(0.5);
    counterSprite.x = Math.round(
      app.screen.width / 2 + (rightSide ? button.width : -button.width)
    );
    counterSprite.y = app.screen.height - margin / 2;
  };
  setCounterProps(totalWinCounter, true);
  bottom.addChild(totalWinCounter);

  const totalWinText = new Text("TOTAL WIN:", counterTextStyle);
  totalWinText.scale.set(2);
  totalWinText.anchor.set(0.5);
  totalWinText.y -= totalWinCounter.height * 2.5;
  totalWinCounter.addChild(totalWinText);

  const winCounter = new Sprite(textureCounter);
  setCounterProps(winCounter, false);
  bottom.addChild(winCounter);

  const winText = new Text("WIN:", counterTextStyle);
  winText.scale.set(2);
  winText.anchor.set(0.5);
  winText.y -= totalWinCounter.height * 2.5;
  winCounter.addChild(winText);

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

  app.stage.addChild(top, reelsContainer, bottom, left, right);

  return { button, reels, buttonText };
}
