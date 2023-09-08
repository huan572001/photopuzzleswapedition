import { _decorator, Animation, Component, Node } from "cc";
import { location } from "../enum";
const { ccclass, property } = _decorator;

@ccclass("ChildImgController")
export class ChildImgController extends Component {
  @property({ type: Animation })
  private imgAnim: Animation;
  public playAnim(st: location, end: location): void {
    if (st.x === end.x) {
      if (st.y > end.y) this.imgAnim.play("img");
      else {
        this.imgAnim.play("imgright");
      }
    } else if (st.y === end.y) {
      if (st.x > end.x) {
        this.imgAnim.play("imgTop");
      } else {
        this.imgAnim.play("imgBottom");
      }
    } else if (st.x > end.x) {
      if (st.y > end.y) {
        this.imgAnim.play("imgTL");
      } else {
        this.imgAnim.play("imgTR");
      }
    } else if (st.y < end.y) {
      if (st.x > end.x) {
        this.imgAnim.play("imgBL");
      } else {
        this.imgAnim.play("imgBR");
      }
    }
  }
  public playTL(): void {
    this.imgAnim.play("imgTL");
  }
}
