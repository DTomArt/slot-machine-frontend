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
    { alias: "diamond.png", src: "src/static/img/300px/DIAMOND.png" },
    { alias: "counter.png", src: "src/static/img/300px/COUNTER.png" },
    {
      alias: "counterSmall.png",
      src: "src/static/img/300px/COUNTER_SMALL.png",
    },
  ];
  assets.map((o) => Assets.add(o.alias, o.src));
  await Assets.load(assets.map((a) => a.alias));

  sound.add("spin", "src/static/sound/spin.mp3");
  sound.add("stop", "src/static/sound/stop.mp3");
  sound.volume("spin", 0.01);
  sound.volume("stop", 0.05);

  app.stage.on("spin_play", () => {
    sound.play("spin");
  });
  app.stage.on("spin_stop", () => {
    sound.play("stop");
  });
}
