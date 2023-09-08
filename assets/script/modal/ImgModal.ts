import { _decorator, Component, Node, SpriteFrame } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ImgModal")
export class ImgModal extends Component {
  @property({ type: [SpriteFrame] })
  private Img: SpriteFrame[] = [];
  public get img(): SpriteFrame[] {
    return this.Img;
  }
  public set img(value: SpriteFrame[]) {
    this.Img = value;
  }
  start() {}

  update(deltaTime: number) {}
}
