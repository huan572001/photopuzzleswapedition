import {
  _decorator,
  assetManager,
  Component,
  director,
  find,
  ImageAsset,
  Node,
  Sprite,
  SpriteFrame,
} from "cc";
import { Modal } from "../modal/Modal";
import { NavbarView } from "../view/NavbarView";
import { game, home } from "../constan";
import { Store } from "../Store";
import { level } from "../level";
import { StoreApi } from "../StoreApi";
import { ImgModal } from "../modal/ImgModal";
const { ccclass, property } = _decorator;

@ccclass("NavbarController")
export class NavbarController extends Component {
  @property({ type: Modal })
  private modal: Modal;
  @property({ type: NavbarView })
  private navbarView: NavbarView;
  @property({ type: ImgModal })
  private imgModal: ImgModal;
  private time: number = 0;
  private imgNextLevel: SpriteFrame;
  private statusGame: boolean = true;
  private store: Node;
  private statusReset: boolean = false;
  protected start(): void {
    this.navbarView.setMove(`${this.modal.move}`);
    this.startTime();
    this.loadImg();
  }
  public setmove(): void {
    this.modal.move--;
    this.navbarView.setMove(`${this.modal.move}`);
  }
  public startTime(): void {
    this.schedule(
      () => {
        if (this.statusGame) {
          this.navbarView.setTime(this.time++);
        }
      },
      1,
      999999,
      0
    );
  }
  public winGame(): void {
    this.navbarView.winGame();
  }
  public loseGame(): void {
    this.navbarView.loseGame();
    this.statusGame = false;
  }
  private onHome(): void {
    Modal.loadding = true;
    this.scheduleOnce(() => {
      director.addPersistRootNode(find("GameClient"));
      director.addPersistRootNode(find("store"));
      director.loadScene(home);
    }, 0.2);
  }
  private async resetGame() {
    if (!this.statusReset) {
      this.statusReset = true;
      let gameClient = find("GameClient").getComponent(StoreApi);
      this.navbarView.onSceneLoadding();
      await gameClient.gameClient.match
        .startMatch()
        .then((data) => {
          gameClient.matchId = data.matchId;
        })
        .catch((error) => console.log(error));
      this.scheduleOnce(() => {
        director.addPersistRootNode(find("GameClient"));
        director.addPersistRootNode(find("store"));
        director.loadScene(game);
      }, 0.5);
    }
  }
  public loadImg() {
    this.store = find("store");
    let levels = this.store.getComponent(Store).getDifficult().level;
    // assetManager.loadRemote(
    //   level[levels % level.length],
    //   // "https://wallpaperaccess.com/full/2586823.jpg",
    //   // "https://images.pexels.com/photos/92866/pexels-photo-92866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    //   (err, texture: ImageAsset) => {
    this.imgNextLevel = this.imgModal.img[levels];
    //   }
    // );
  }
  private async nextLevel() {
    if (!this.statusReset) {
      this.statusReset = true;
      let gameClient = find("GameClient").getComponent(StoreApi);
      this.navbarView.onSceneLoadding();
      await gameClient.gameClient.match
        .startMatch()
        .then((data) => {
          gameClient.matchId = data.matchId;
        })
        .catch((error) => console.log(error));
      this.store
        .getComponent(Store)
        .setDifficult(this.store.getComponent(Store).getDifficult().level + 1);
      this.store.getComponent(Sprite).spriteFrame = this.imgNextLevel;
      director.addPersistRootNode(find("GameClient"));
      director.addPersistRootNode(find("store"));
      director.loadScene(game);
    }
  }
}
