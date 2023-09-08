import {
  _decorator,
  Camera,
  Component,
  director,
  EventMouse,
  EventTouch,
  find,
  Node,
  Size,
  Vec3,
  view,
} from "cc";
import { GameView } from "../view/GameView";
import { ImgChild, location } from "../enum";
import { NavbarView } from "../view/NavbarView";
import { Modal } from "../modal/Modal";
import { NavbarController } from "./NavbarController";
import { game, home } from "../constan";
import { Store } from "../Store";
import { level } from "../level";
import { audioConntroller } from "./audioConntroller";
import { StoreApi } from "../StoreApi";
const { ccclass, property } = _decorator;

@ccclass("GameController")
export class GameController extends Component {
  @property({ type: GameView })
  private gameView: GameView;
  @property({ type: NavbarController })
  private navBarController: NavbarController;
  @property({ type: audioConntroller })
  private audio: audioConntroller;
  @property({ type: Modal })
  private modal: Modal;
  @property({ type: Camera })
  private camera: Camera;
  @property({ type: Node })
  private sceneGame: Node;
  private arrIMG: ImgChild[] = [];
  private arr2: ImgChild[][] = [];
  private sizeImg: Size = new Size(0, 0);
  private startPick: location = null;
  private checkCoutImg: number = 0;
  private totalImg: number = 0;
  private store: Store;
  private gameClient: StoreApi;
  protected start(): void {
    this.store = find("store").getComponent(Store);
    this.gameClient = find("GameClient").getComponent(StoreApi);
    const screenSize = view.getVisibleSize();
    const imageWidth = screenSize.width - 100;
    const imageHeight = screenSize.height;
    this.sizeImg.width = imageWidth / this.store.getDifficult().col;
    this.sizeImg.height = imageHeight / this.store.getDifficult().row;
    this.gameView.cutImg(this.arrIMG, this.sizeImg.width, this.sizeImg.height);
    this.randomMap();
    let a = async () => {
      this.checkCoutImg = await this.gameView.innitMap(this.arr2);
    };
    a();
    this.scheduleOnce(() => {
      this.sceneGame.on(
        Node.EventType.TOUCH_END,
        (event) => {
          this.onClickBoard(event);
        },
        this.sceneGame
      );
    }, 1);
  }
  private onClickBoard(event: EventTouch) {
    let pos = new Vec3();
    pos = this.camera.screenToWorld(
      new Vec3(event.getLocationX(), event.getLocationY(), 0),
      pos
    );
    let localPos = new Vec3();
    this.sceneGame.inverseTransformPoint(localPos, pos);

    let x = Math.floor(localPos.x / this.sizeImg.width);
    let y = Math.floor(-localPos.y / this.sizeImg.height);
    if (x >= 0 && y >= 0) {
      this.onClickChild(y, x);
    }
  }
  private onClickChild(x, y): void {
    if (this.arr2[x][y] !== null) {
      if (this.startPick === null) {
        this.startPick = { x: x, y: y };
        this.gameView.onhighlight({ x: x, y: y });
      } else {
        this.gameView.offhighlight({
          x: this.startPick.x,
          y: this.startPick.y,
        });
        if (!(this.startPick.x === x && this.startPick.y === y)) {
          this.gameView.swap(this.startPick, { x: x, y: y });
          this.swap(this.startPick, { x: x, y: y });
          this.navBarController.setmove();
        }
        this.startPick = null;
      }
    }
  }
  private swap(st: location, end: location): void {
    let tmp = this.arr2[st.x][st.y];
    this.arr2[st.x][st.y] = this.arr2[end.x][end.y];
    this.arr2[end.x][end.y] = tmp;
    if (
      this.arr2[st.x][st.y].VT.x === st.x &&
      this.arr2[st.x][st.y].VT.y === st.y
    ) {
      this.arr2[st.x][st.y] = null;
      this.gameView.onDeleteSpriteFrame(st);
      this.checkCoutImg++;
    }
    if (
      this.arr2[end.x][end.y].VT.x === end.x &&
      this.arr2[end.x][end.y].VT.y === end.y
    ) {
      this.arr2[end.x][end.y] = null;
      this.gameView.onDeleteSpriteFrame(end);
      this.checkCoutImg++;
    }
    if (this.checkCoutImg >= this.totalImg) {
      this.win();
    } else if (this.modal.move === 1) {
      this.navBarController.loseGame();
      this.sceneGame.setPosition(10000, 10000);
      this.sceneGame.off(
        Node.EventType.TOUCH_END,
        (event) => {
          this.onClickBoard(event);
        },
        this.sceneGame
      );
    }
  }
  private async win() {
    this.gameView.winGame();
    this.navBarController.winGame();
    await this.gameClient.gameClient.match
      .completeMatch(this.gameClient.matchId, {
        score: this.store.getComponent(Store).getCountLevel(),
      })
      .then((data) => {})
      .catch((error) => console.log(error));
  }
  private randomMap(): void {
    this.totalImg =
      this.store.getDifficult().row * this.store.getDifficult().col - 1;
    let count = 0;
    const length = this.arrIMG.length;

    const shuffledArray = [...this.arrIMG];

    for (let i = length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      do {
        j = Math.floor(Math.random() * (i + 1));
      } while (
        shuffledArray[i].VT.x === this.arrIMG[j].VT.x &&
        shuffledArray[i].VT.y === this.arrIMG[j].VT.y &&
        i > 0
      );
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    for (let i = 0; i < this.store.getDifficult().row; i++) {
      this.arr2.push([]);
      for (let j = 0; j < this.store.getDifficult().col; j++) {
        this.arr2[i].push({
          spriteFrame: shuffledArray[count].spriteFrame,
          VT: shuffledArray[count].VT,
        });
        count++;
      }
    }
    const ranX = Math.floor(Math.random() * this.store.getDifficult().row);
    const ranY = Math.floor(Math.random() * this.store.getDifficult().row);
    const x = this.arr2[ranX][ranY].VT.x;
    const y = this.arr2[ranX][ranY].VT.y;
    [this.arr2[x][y], this.arr2[ranX][ranY]] = [
      this.arr2[ranX][ranY],
      this.arr2[x][y],
    ];
  }
}
