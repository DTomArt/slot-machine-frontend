import { Graphics, Sprite, TextStyle, Texture, Text } from "pixi.js";
import { Configuration, Reel } from "./types.js";
import { ReelsContainer } from "./ReelsContainer.js";
import { REEL_WIDTH, SYMBOL_SIZE } from "./main.js";
import {
  counterTextStyle,
  counterTitleTextStyle,
  headerTextStyle,
} from "./textStyles.js";

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

  const setCounterProps = (
    counterSprite: Sprite,
    props: {
      positionX: number;
      scale?: { x: number | undefined; y: number | undefined };
    }
  ) => {
    const { positionX, scale } = props;
    counterSprite.scale.set(scale?.x ?? 0.35, scale?.y ?? 0.25);
    counterSprite.anchor.set(0.5);
    counterSprite.x = Math.round(app.screen.width / 2 + positionX);
    counterSprite.y = app.screen.height - margin / 2;
  };

  const addCounter = (
    counter: Sprite,
    text: string,
    inHalfOfTexture: boolean = false
  ) => {
    const newText = new Text(text, counterTextStyle);
    newText.scale.set(2);
    newText.anchor.set(0.5);
    newText.x += inHalfOfTexture ? counter.width / 2 : counter.width;
    counter.addChild(newText);
  };

  const addTextToCounter = (counter: Sprite, text: string) => {
    const newText = new Text(text, counterTitleTextStyle);
    newText.scale.set(2);
    newText.anchor.set(0.5);
    newText.y -= counter.height * 2.5;
    counter.addChild(newText);
  };

  const textureCounter = Texture.from("counter.png");
  const textureCounterSmall = Texture.from("counterSmall.png");

  // Build and position counters: coinsIn, totalWin, win
  const coinsInCounter = new Sprite(textureCounter);
  setCounterProps(coinsInCounter, {
    positionX: -button.width,
  });
  bottom.addChild(coinsInCounter);
  addTextToCounter(coinsInCounter, "COINS IN");
  addCounter(coinsInCounter, "0");

  const winCounter = new Sprite(textureCounter);
  setCounterProps(winCounter, {
    positionX: button.width,
  });
  bottom.addChild(winCounter);
  addTextToCounter(winCounter, "TOTAL WIN");
  addCounter(winCounter, "0");

  const totalWinCounter = new Sprite(textureCounterSmall);
  setCounterProps(totalWinCounter, {
    positionX: button.width + winCounter.width,
    scale: { x: 0.35, y: 0.3 },
  });
  bottom.addChild(totalWinCounter);
  addTextToCounter(totalWinCounter, "WIN");
  addCounter(totalWinCounter, "0", true);

  // Add button text
  const buttonText = new Text("SPIN", headerTextStyle);
  buttonText.scale.set(3);
  buttonText.anchor.set(0.5);
  button.addChild(buttonText);

  // Add header text
  const headerText = new Text("BLACK GOLD SLOT MACHINE", headerTextStyle);
  headerText.x = Math.round((top.width - headerText.width) / 2);
  headerText.y = Math.round((margin - headerText.height) / 2);
  top.addChild(headerText);

  app.stage.addChild(top, reelsContainer, bottom, left, right);

  return { button, reels, buttonText };
}
