import { sound } from "@pixi/sound";
import { app } from "../main.js";
import { Assets } from "pixi.js";
import assets from "./assets.json";
import { AudioManager } from "../AudioManager.js";

export async function preload() {
    assets.map((o) => Assets.add(o.alias, o.src));
    await Assets.load(assets.map((a) => a.alias));

    const audio = new AudioManager();
    setSounds(audio);
}

function setSounds(audio: AudioManager) {
    app.stage.on("spin_play_sound", () => {
        audio.playSpin();
    });
    app.stage.on("spin_stop_sound", () => {
        audio.playStop();
    });
    app.stage.on("spin_last_reel_stop", () => {
        audio.playLastStop();
        app.stage.emit("spin_ended");
        audio.reset();
    });
}
