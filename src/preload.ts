import { sound } from "@pixi/sound";
import { Assets } from "pixi.js";
import { app } from "./main.js";

export async function preload() {
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

  debugger;
  app.stage.on("spin_play", () => {
    debugger;
    sound.play("spin");
  });
}
