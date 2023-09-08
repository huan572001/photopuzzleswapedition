import {
  _decorator,
  Animation,
  AudioSource,
  Color,
  Component,
  director,
  find,
  instantiate,
  Node,
  Prefab,
  Rect,
  Sprite,
  SpriteFrame,
  UIOpacity,
  UITransform,
  view,
} from "cc";
import { ImgChild, location } from "../enum";
import { Store } from "../Store";
import { ChildImgController } from "../controller/ChildImgController";
import { Modal } from "../modal/Modal";
const { ccclass, property } = _decorator;

@ccclass("GameView")
export class GameView extends Component {
  @property({ type: Sprite })
  private imgGame: Sprite;
  @property({ type: Node })
  private imgnode: Node;
  @property({ type: Node })
  private blur: Node;
  @property({ type: Prefab })
  private imgPrefab: Prefab;
  @property({ type: Node })
  private listImg: Node;
  @property({ type: Animation })
  private winAnim: Animation;
  @property({ type: AudioSource })
  private imgAudio: AudioSource;
  @property({ type: Node })
  private HLIMG: Node;
  private arrImg: Node[][] = [];
  private store: Store;
  private grid: number = 5;
  // private HL:location=null
  update(deltaTime: number) {}
  public cutImg(
    arrIMGEnum: ImgChild[],
    cutWidth: number,
    cutHeight: number
  ): void {
    let sizeGame = view.getVisibleSize();
    const store = find("store");
    this.HLIMG.getComponent(UITransform).setContentSize(
      cutWidth + 10,
      cutHeight + 10
    );
    this.store = store.getComponent(Store);
    this.imgGame.spriteFrame = store.getComponent(Sprite).spriteFrame;
    let x = this.imgnode.getComponent(UITransform).width / 2;
    let y = -this.imgnode.getComponent(UITransform).height / 2;
    // let x = (sizeGame.width - 100) / 2;
    // let y = -(sizeGame.height - 100) / 2;
    // let ximg = this.imgnode.getComponent(UITransform).width / 2 - x;
    // let yimg = -this.imgnode.getComponent(UITransform).height / 2 + y;
    this.imgnode.setPosition(x, y);
    for (let row = 0; row < this.store.getDifficult().row; row++) {
      this.arrImg.push([]);
      for (let col = 0; col < this.store.getDifficult().col; col++) {
        // Tạo khung hình cho phần cắt
        const rect = new Rect(
          col * cutWidth,
          row * cutHeight,
          cutWidth,
          cutHeight
        );
        const spriteFrame = this.imgGame.spriteFrame;
        const spriteFramePart = new SpriteFrame();
        spriteFramePart.texture = spriteFrame.texture;
        spriteFramePart.rect = rect;
        // Tạo đối tượng Sprite và hiển thị phần cắt
        const newImg = instantiate(this.imgPrefab);
        newImg.getComponent(UITransform).width = cutWidth;
        newImg.getComponent(UITransform).height = cutHeight;
        const img = newImg.getChildByName("img");
        img.getComponent(Sprite).spriteFrame = spriteFramePart;

        newImg.setPosition(
          col * cutWidth + cutWidth / 2,
          -row * cutHeight - cutHeight / 2
        );
        this.arrImg[row].push(newImg);
        arrIMGEnum.push({
          spriteFrame: spriteFramePart,
          VT: { x: row, y: col },
        });
        this.listImg.addChild(newImg);
      }
    }
  }
  private async delayAync(num: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, num);
    });
  }
  public async innitMap(arr: ImgChild[][]) {
    let count: number = 0;
    let time: number = Math.floor(
      1000 / (this.store.getDifficult().row * this.store.getDifficult().col)
    );
    Modal.loadding = false;

    for (let row = 0; row < this.store.getDifficult().row; row++) {
      for (let col = 0; col < this.store.getDifficult().col; col++) {
        if (Modal.loadding) {
          Modal.loadding = false;
          return;
        }
        await this.delayAync(time);
        this.imgAudio.play();
        if (arr[row][col].VT.x === row && arr[row][col].VT.y === col) {
          this.onDeleteSpriteFrame({ x: row, y: col });
          arr[row][col] = null;
          count++;
        } else {
          let tmp = this.arrImg[row][col].getChildByName("img");
          tmp.getComponent(Sprite).spriteFrame = arr[row][col].spriteFrame;
          this.arrImg[row][col].getComponent(ChildImgController).playTL();
          tmp.getComponent(UITransform).width -= this.grid;
          tmp.getComponent(UITransform).height -= this.grid;
        }
      }
    }
    return count;
  }
  public onhighlight(location: location): void {
    let x = this.arrImg[location.x][location.y].position.x - 960 / 2;
    let y = this.arrImg[location.x][location.y].position.y + 640 / 2;
    this.HLIMG.setPosition(x, y);
    this.HLIMG.getChildByName("img").getComponent(Sprite).spriteFrame =
      this.arrImg[location.x][location.y]
        .getChildByName("img")
        .getComponent(Sprite).spriteFrame;
  }
  public offhighlight(location: location): void {
    this.HLIMG.setPosition(1000, 1000);
  }
  public swap(st: location, end: location): void {
    this.imgAudio.play();
    let start = this.arrImg[st.x][st.y].getChildByName("img");
    let endGame = this.arrImg[end.x][end.y].getChildByName("img");
    let tmp = this.arrImg[st.x][st.y]
      .getChildByName("img")
      .getComponent(Sprite).spriteFrame;
    start.getComponent(Sprite).spriteFrame =
      endGame.getComponent(Sprite).spriteFrame;
    start.getComponent(UITransform).height -= this.grid;
    start.getComponent(UITransform).width -= this.grid;
    endGame.getComponent(Sprite).spriteFrame = tmp;
    endGame.getComponent(UITransform).height -= this.grid;
    endGame.getComponent(UITransform).width -= this.grid;
    this.arrImg[st.x][st.y].getComponent(ChildImgController).playAnim(st, end);
    this.arrImg[end.x][end.y]
      .getComponent(ChildImgController)
      .playAnim(end, st);
  }
  public onDeleteSpriteFrame(loc: location): void {
    this.arrImg[loc.x][loc.y]
      .getChildByName("img")
      .getComponent(Sprite).spriteFrame = null;
    this.arrImg[loc.x][loc.y].getComponent(Sprite).spriteFrame = null;
  }
  public winGame(): void {
    this.blur.setPosition(1000, 1000);
    this.winAnim.play();
  }
}
