import { sound } from "@pixi/sound";

export class AudioManager {
    private wasHiddenDuringSpin = false;
    private lastStopPlayed = false;

    constructor() {
        sound.add("spin", "src/static/sound/spin.mp3");
        sound.add("stop", "src/static/sound/stop.mp3");
        sound.volume("spin", 0.01);
        sound.volume("stop", 0.05);

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.wasHiddenDuringSpin = true;
            }
        });
    }

    playSpin() {
        if (document.hidden || this.wasHiddenDuringSpin) return;
        console.log("[AudioManager] playing: spin");
        sound.play("spin");
    }

    playStop() {
        if (document.hidden || this.wasHiddenDuringSpin) return;
        console.log("[AudioManager] playing: stop");
        sound.play("stop");
    }

    playLastStop() {
        if (document.hidden) {
            // Will be handled when spin_ended resets state
            return;
        }
        if (this.wasHiddenDuringSpin && !this.lastStopPlayed) {
            console.log("[AudioManager] playing: stop (last reel, after tab return)");
            sound.play("stop");
            this.lastStopPlayed = true;
            return;
        }
        if (!this.wasHiddenDuringSpin) {
            console.log("[AudioManager] playing: stop (last reel)");
            sound.play("stop");
        }
    }

    reset() {
        this.wasHiddenDuringSpin = false;
        this.lastStopPlayed = false;
    }
}
