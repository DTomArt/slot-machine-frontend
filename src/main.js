import { Application, Graphics } from "pixi.js";
(async () => {
    // Create the application
    const app = new Application({
        background: "#000000",
        resizeTo: window,
        // backgroundAlpha: 0.2,
    });
    app.view.style.position = "absolute";
    const rectangle = new Graphics();
    // rectangle.x = app.screen.width / 2;
    // rectangle.y = app.screen.height / 2;
    rectangle.beginFill(0x0000ff);
    rectangle.drawRect(100, 100, 600, 100);
    // rectangle.fill.color = 0x0000ff;
    app.stage.addChild(rectangle);
    // Create a Graphics object, set a fill color, draw a rectangle
    let obj = new Graphics();
    obj.beginFill(0xff0000);
    obj.drawRect(0, 0, 200, 100);
    // Add it to the stage to render
    app.stage.addChild(obj);
    // // create a new Sprite from an image path
    // const bunny = Sprite.from("https://pixijs.com/assets/bunny.png");
    // // center the sprite's anchor point
    // bunny.anchor.set(0.5);
    // // move the sprite to the center of the screen
    // bunny.x = app.screen.width / 2;
    // bunny.y = app.screen.height / 2;
    // app.stage.addChild(bunny);
    // Add the view to the DOM
    document.body.appendChild(app.view);
})();
