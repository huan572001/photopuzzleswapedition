import { SpriteFrame } from "cc";

export type ImgChild = {
  spriteFrame: SpriteFrame;
  VT: location;
};
export type location = {
  x: number;
  y: number;
};
export type Difficult = {
  level: number;
  row: number;
  col: number;
  move: number;
};
