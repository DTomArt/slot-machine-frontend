import { Text, Container } from "pixi.js";
import { Configuration, Reel } from "./types.js";
import { ReelsContainer } from "./ReelsContainer.js";
import { SYMBOL_SIZE } from "./layout.js";
import { headerTextStyle } from "./textStyles.js";
import { UI } from "./view/UI.js";
import TWEEN from "@tweenjs/tween.js";
import { GameContainer } from "./GameContainer.js";
import { layout } from "./layout.js";


// onAssetsLoaded handler builds the slot machine
export function onAssetsLoaded({ app }: Configuration): Reel[] {
    const gameContainer = new GameContainer();

    const reelsContainer = new ReelsContainer(layout.reels.y);
    const reels = reelsContainer.getReels();

    const headerContainer = new Container();
    headerContainer.x = layout.header.x;
    headerContainer.y = layout.header.y;
    headerContainer.pivot.x = headerContainer.width / 2;

    const UIContainer = new UI();

    // Add header text
    const headerText = new Text("BLACK GOLD SLOT MACHINE", headerTextStyle);
    headerText.pivot.x = headerText.width / 2;
    headerContainer.addChild(headerText);

    gameContainer.addChild(headerContainer, reelsContainer, UIContainer);
    app.stage.addChild(gameContainer);

    // Listen for animate update
    app.ticker.add(() => {
        // Update the slots
        for (let i = 0; i < reels.length; i++) {
            const reel = reels[i];
            // Update blur filter y amount based on speed
            reel.blur.blurY = (reel.position - reel.previousPosition) * 80;
            reel.previousPosition = reel.position;
            // Update symbol positions on reel
            for (let j = 0; j < reel.symbols.length; j++) {
                const symbol = reel.symbols[j];
                symbol.y = ((reel.position + j) % reel.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
            }
        }
        // Update tweens group
        TWEEN.update();
    });

    return reels;
}

