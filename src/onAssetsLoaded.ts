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
  button.scale.set(0.3, 0.25);
  button.anchor.set(0.5);
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

  app.stage.addChild(top, reelsContainer, bottom, left, right);

  return { button, reels, buttonText };
}
