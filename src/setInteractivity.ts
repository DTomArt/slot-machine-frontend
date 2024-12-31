import { Sprite, Text, Texture } from "pixi.js";
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
  const reelsResultCopyForLog = new Array(
    reelsResult[2],
    reelsResult[0],
    reelsResult[1]
  );
  console.log("==========");
  console.log("Result from spin: ", reelsResultCopyForLog);
  console.log("TotalWin: ", totalWin);
  console.log("==========");

  // Custom easing function
  function backout(amount: number) {
    return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
  }

  for (let i = 0; i < reels.length; i++) {
    const r = reels[i];
    const targetSymbolIndex = r.symbols.findIndex((symbol: Sprite) =>
      symbol.texture.textureCacheIds[0].includes(reelsResult[i])
    );
    const extra = Math.floor(Math.random() * 3);
    const howManySymbolsWillRoll =
      20 + i * 5 + extra + (targetSymbolIndex === -1 ? 0.5 : 0);
    let target = Math.round(r.position) + howManySymbolsWillRoll;

    const time = 3500 + i * 250;

    // swap texture on result from backend
    let currentIndex = r.symbols.findIndex(
      (symbol: Sprite) => Math.round(symbol.y) === 150
    );
    if (currentIndex === -1) {
      currentIndex = r.symbols.findIndex(
        (symbol: Sprite) => Math.round(symbol.y) === 225
      );
      target++;
    }
    if (Number.isInteger(howManySymbolsWillRoll)) {
      const indexOfWinSymbol = r.symbols.findIndex(
        (_, index) =>
          Math.round(
            ((target + index) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE
          ) === 150
      );
      if (targetSymbolIndex !== -1) {
        const buffer = r.symbols[indexOfWinSymbol].texture;
        r.symbols[indexOfWinSymbol].texture =
          r.symbols[targetSymbolIndex].texture;
        r.symbols[targetSymbolIndex].texture = buffer;
      }
    }

    new TWEEN.Tween(r)
      .to({ position: target }, time)
      .onStart(() => {
        app.stage.emit("spin_play");
      })
      .easing(backout(0.2))
      .onComplete(() => {
        // isWinLineSymbol(r, targetSymbolIndex);
        if (i === reels.length - 1) {
          running = false;
        }
        app.stage.emit("spin_stop");
      })
      .start();
  }
}

// function isWinLineSymbol(currentReel: Reel, targetSymbolIndex: number) {
//   const winLineSymbol = currentReel.symbols.find(
//     (symbol: Sprite) => Math.round(symbol.y) === 150
//   );
// if (winLineSymbol)
//   winLineSymbol.texture = currentReel.symbols[targetSymbolIndex].texture;
// console.log(winLineSymbol?._texture?.textureCacheIds);
// }

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
    button.scale.set(0.35, 0.3);
    buttonText.scale.set(2.95);
  };
  const onButtonUp = function () {
    button.scale.set(0.4, 0.35);
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
      r.blur.blurY = (r.position - r.previousPosition) * 80;
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
