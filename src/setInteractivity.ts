import { Sprite, Text } from "pixi.js";
import { Configuration, Reel } from "./types.js";
import TWEEN from "@tweenjs/tween.js";
import { sound } from "@pixi/sound";
import { play } from "../slot-machine/src/play.js";

export function setInteractivity(
  { app, symbolSize }: Configuration,
  {
    button,
    buttonText,
    reels,
  }: {
    button: Sprite;
    buttonText: Text;
    reels: Reel[];
  }
) {
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
  button.interactive = true;
  button.cursor = "pointer";
  button.on("pointerdown", onButtonDown).on("pointerup", onButtonUp);
  button.addListener("pointerdown", () => {
    startPlay();
  });
  let running = false;
  // Function to start playing
  function startPlay() {
    if (running) return;
    running = true;

    // Custom easing function
    function backout(amount: number) {
      return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
    }

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      const extra = Math.floor(Math.random() * 3);
      const target = r.position + 10 + i * 5 + extra;
      const time = 2000 + i * 250;
      new TWEEN.Tween(r)
        .to({ position: target }, time)
        .onStart(() => {
          // debugger;
          // app.stage.emit("spin_play");
          sound.play("spin");
        })
        .easing(backout(0.2))
        .onComplete(() => {
          isWinLineSymbol(r);
          if (i === reels.length - 1) {
            running = false;
            checkWinLine(line);
          }
          //   sound.play("stop");
        })
        .start();
    }
  }
  // Function to check win line
  let line: string[] = [];
  function isWinLineSymbol(currentReel: any) {
    const winLineSymbol = currentReel.symbols.find(
      (symbol: Sprite) => Math.round(symbol.y) === 150
    )._texture.textureCacheIds;
    console.log(winLineSymbol);
    line.push(winLineSymbol);
  }
  function checkWinLine(line: string[]) {
    const win = line.every((x, i, a) => x === a[0]);
    console.log(win ? "You won!" : "Try again!");
  }
  // Listen for animate update
  app.ticker.add(() => {
    // Update the slots
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      // Update blur filter y amount based on speed
      r.blur.blurY = (r.position - r.previousPosition) * 8;
      r.previousPosition = r.position;
      // Update symbol positions on reel
      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        s.y = ((r.position + j) % r.symbols.length) * symbolSize - symbolSize;
      }
    }
    // Update tweens group
    TWEEN.update();
  });
}
