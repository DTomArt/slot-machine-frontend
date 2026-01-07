import { sound } from "@pixi/sound";
import { app } from "../main.js";
import { Assets } from "pixi.js";
import assets from "./assets.json";

export async function preload() {
    assets.map((o) => Assets.add(o.alias, o.src));
    await Assets.load(assets.map((a) => a.alias));

    preloadSounds();
}

function preloadSounds() {
    sound.add("spin", "src/static/sound/spin.mp3");
    sound.add("stop", "src/static/sound/stop.mp3");
    sound.volume("spin", 0.01);
    sound.volume("stop", 0.05);

    setSounds();
}

function setSounds() {
    app.stage.on("spin_play", () => {
        sound.play("spin");
    });
    app.stage.on("spin_stop", () => {
        sound.play("stop");
    });
}
