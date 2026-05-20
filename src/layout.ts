import { GameContainer } from "./GameContainer.js";

export const SYMBOL_SIZE = 150;
const DESIGN_WIDTH = GameContainer.DESIGN_WIDTH;
const DESIGN_HEIGHT = GameContainer.DESIGN_HEIGHT;
const MARGIN_HEIGHT = (DESIGN_HEIGHT - SYMBOL_SIZE * 3) / 2;

export const layout = {
    header: {
        x: DESIGN_WIDTH / 2,
        y: MARGIN_HEIGHT / 2,
    },

    reels: {
        y: MARGIN_HEIGHT,
    },

    spinButton: {
        x: DESIGN_WIDTH / 2,
        y: DESIGN_HEIGHT - MARGIN_HEIGHT / 2,
        scale: { x: 0.4, y: 0.35 },
        pressedRatio: 0.875,
    },

    coinsInCounter: {
        texture: "counter.png",
        title: "COINS IN",
        scale: { x: 0.35, y: 0.25 },
        offsetX: -1, // multiplied by button width * spread
    },

    winCounter: {
        texture: "counter.png",
        title: "TOTAL WIN",
        scale: { x: 0.35, y: 0.25 },
        offsetX: 1, // multiplied by button width * spread
    },

    totalWinCounter: {
        texture: "counterSmall.png",
        title: "WIN",
        scale: { x: 0.35, y: 0.3 },
        offsetX: 2, // multiplied by button width * spread (button + counter width)
        valueInHalfOfTexture: true,
    },
};
