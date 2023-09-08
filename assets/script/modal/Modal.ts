import { _decorator, CCInteger, Component, find, Node, SpriteFrame } from "cc";
import { Store } from "../Store";
import { EZ, Hard, Medium } from "../constan";
const { ccclass, property } = _decorator;

@ccclass("Modal")
export class Modal extends Component {
  @property({ type: CCInteger })
  private MoveLevel1: number;
  @property({ type: CCInteger })
  private MoveLevel3: number;
  @property({ type: CCInteger })
  private MoveLevel2: number;

  private store: Store;
  static loadding: boolean = false;
  protected onLoad(): void {
    this.store = find("store").getComponent(Store);
  }
  public get move(): number {
    if (this.store.levels === EZ) {
      return this.MoveLevel1;
    } else if (this.store.levels === Medium) {
      return this.MoveLevel2;
    } else if (this.store.levels === Hard) {
      return this.MoveLevel3;
    }
  }
  public set move(value: number) {
    if (this.store.levels === EZ) {
      this.MoveLevel1 = value;
    } else if (this.store.levels === Medium) {
      this.MoveLevel2 = value;
    } else if (this.store.levels === Hard) {
      this.MoveLevel3 = value;
    }
  }
}
