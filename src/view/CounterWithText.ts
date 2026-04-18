import { Sprite, Text, Texture } from "pixi.js";
import { counterTextStyle, counterTitleTextStyle } from "../textStyles.js";

interface CounterWithTextOptions {
    texture: string;
    title: string;
    value: string;
    positionX: number;
    positionY: number;
    scale?: { x: number; y: number };
    valueInHalfOfTexture?: boolean;
}

export class CounterWithText extends Sprite {
    private valueText: Text;

    constructor(options: CounterWithTextOptions) {
        super(Texture.from(options.texture));

        const { title, value, positionX, positionY, scale, valueInHalfOfTexture } = options;

        this.scale.set(scale?.x ?? 0.35, scale?.y ?? 0.25);
        this.anchor.set(0.5);
        this.x = positionX;
        this.y = positionY;

        this.createTitle(title);
        this.valueText = this.createValue(value, valueInHalfOfTexture);
    }

    private createTitle(title: string) {
        const titleText = new Text(title, counterTitleTextStyle);
        titleText.scale.set(2);
        titleText.anchor.set(0.5);
        titleText.y -= this.height * 3;
        this.addChild(titleText);
    }

    private createValue(value: string, inHalfOfTexture: boolean = false): Text {
        const valueText = new Text(value, counterTextStyle);
        valueText.scale.set(2);
        valueText.anchor.set(0.5);
        valueText.x += inHalfOfTexture ? this.width / 2 : this.width;
        this.addChild(valueText);
        return valueText;
    }

    setValue(value: string) {
        this.valueText.text = value;
    }
}
