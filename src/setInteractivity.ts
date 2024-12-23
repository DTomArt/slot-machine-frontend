import { Sprite, Text } from "pixi.js";
import { Reel } from "./types.js";
import TWEEN from "@tweenjs/tween.js";
import { app, SYMBOL_SIZE } from "./main.js";
import { play } from "../slot-machine/src/play.js";

// Function to start playing
function startPlay(running: Boolean, reels: Reel[]) {
  if (running) return;
  running = true;

  const { reelsResult, totalWin } = play();
  if (!reelsResult) {
    throw new Error("Cannot get reels from backend");
  }
  console.log(reelsResult);
  console.log(totalWin);

  // Custom easing function
  function backout(amount: number) {
    return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
  }

  for (let i = 0; i < reels.length; i++) {
    const r = reels[i];
    const targetSymbolIndex = reels[i].symbols.findIndex((symbol: Sprite) =>
      symbol.texture.textureCacheIds[0].includes(reelsResult[i])
    );
    const extra = Math.floor(Math.random() * 3);
    let target = r.position + 20 + i * 5 + extra;
    target = Math.round(target) + (targetSymbolIndex === -1 ? 0.5 : 0);
    const time = 3500 + i * 250;

    new TWEEN.Tween(r)
      .to({ position: target }, time)
      .onStart(() => {
        app.stage.emit("spin_play");
      })
      .easing(backout(0.2))
      .onComplete(() => {
        isWinLineSymbol(r, targetSymbolIndex);
        if (i === reels.length - 1) {
          running = false;
        }
        app.stage.emit("spin_stop");
      })
      .start();
  }
}

function isWinLineSymbol(currentReel: Reel, targetSymbolIndex: number) {
  const winLineSymbol = currentReel.symbols.find(
    (symbol: Sprite) => Math.round(symbol.y) === 150
  );
  if (winLineSymbol)
    winLineSymbol.texture = currentReel.symbols[targetSymbolIndex].texture;
  // console.log(winLineSymbol?._texture?.textureCacheIds);
}

export function setInteractivity({
  button,
  buttonText,
  reels,
}: {
  button: Sprite;
  buttonText: Text;
  reels: Reel[];
}) {
  // Add buttonDown effect
  const onButtonDown = function () {
    button.scale.set(0.25, 0.2);
    buttonText.scale.set(2.95);
  };
  const onButtonUp = function () {
    button.scale.set(0.3, 0.25);
    buttonText.scale.set(3);
  };
  // Set the interactivity
  button.eventMode = "static";
  button.cursor = "pointer";
  button.on("pointerdown", onButtonDown).on("pointerup", onButtonUp);
  let running = false;
  button.addListener("pointerdown", () => {
    startPlay(running, reels);
  });

  // Listen for animate update
  app.ticker.add(() => {
    // Update the slots
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      // Update blur filter y amount based on speed
      r.blur.blurY = (r.position - r.previousPosition) * 100;
      r.previousPosition = r.position;
      // Update symbol positions on reel
      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
      }
    }
    // Update tweens group
    TWEEN.update();
  });
}
