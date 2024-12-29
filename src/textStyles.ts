import { TextStyle } from "pixi.js";

export const headerTextStyle = new TextStyle({
  fill: "#ffffff",
  fillGradientStops: [0.6],
  fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
  fontSize: 36,
  fontVariant: "small-caps",
  fontWeight: "bold",
  letterSpacing: 2,
  lineJoin: "round",
  stroke: "#2403fc",
  strokeThickness: 3,
});

export const counterTitleTextStyle = new TextStyle({
  fill: "#C2C2D2",
  fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
  fontSize: 43,
  fontVariant: "small-caps",
  fontWeight: "bold",
  letterSpacing: 2,
  lineJoin: "round",
});

export const counterTextStyle = new TextStyle({
  fill: "#C2C2D2",
  fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
  fontSize: 43,
  fontVariant: "small-caps",
  fontWeight: "bold",
  letterSpacing: 2,
  lineJoin: "round",
});
