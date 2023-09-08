import {
  _decorator,
  Animation,
  assetManager,
  AudioSource,
  Component,
  director,
  find,
  ImageAsset,
  Node,
  resources,
  Sprite,
  SpriteFrame,
} from "cc";
import GameClient from "@onechaintech/gamesdk-dev";
import { Store } from "../Store";
import { EZ, game, Hard, Medium } from "../constan";
import { level } from "../level";
import { MenuView } from "../view/MenuView";
import { StoreApi } from "../StoreApi";
import { ImgModal } from "../modal/ImgModal";
const { ccclass, property } = _decorator;

@ccclass("MenuController")
export class MenuController extends Component {
  @property({ type: MenuView })
  private menuView: MenuView;
  @property({ type: Animation })
  private loadding: Animation;
  @property({ type: ImgModal })
  private imgModal: ImgModal;
  private storeNode: Node;
  private store: Store;
  private statusLoadding: boolean = false;
  public gameClient;
  // public matchId: string;
  private parameters: Node;

  async start() {
    await this.loadAPI();
    if (find("store") === null) {
      this.storeNode = new Node("store");
      this.storeNode.addComponent(Sprite);
      let storeNew = this.storeNode.getComponent(Store);
      this.menuView.HL(storeNew.levels);

      this.menuView.setLevel(storeNew.getDifficult().level);
    } else {
      this.storeNode = find("store");
      this.store = find("store").getComponent(Store);
      this.store.setDificult();
      this.menuView.HL(this.store.levels);
      this.menuView.setLevel(this.store.getDifficult().level);
    }
    await this.loadImg();
  }
  private async callDataApi() {
    let userId: any;
    this.parameters = find("GameClient");
    if (this.parameters === null) {
      this.parameters = new Node("GameClient");
      if (this.gameClient === undefined) {
        this.gameClient = new GameClient(
          "64b0d206486cfae38b3439c5",
          "eefdf7c8-a562-4780-9231-a86d0d613729",
          window.parent,
          { dev: true }
        );
        await this.gameClient
          .initAsync()
          .then(() => {
            userId = this.gameClient.user.citizen.getSaId();
          })
          .catch((err) => console.log(err));

        try {
          if (localStorage.getItem("userId")) {
            if (localStorage.getItem("userId") !== userId) {
              localStorage.clear();
            }
          }
          localStorage.setItem("userId", userId);
        } catch (error) {}
      }
      let gameClientParams = this.parameters.addComponent(StoreApi);
      gameClientParams.gameClient = this.gameClient;
    } else {
      this.gameClient = this.parameters.getComponent(StoreApi).gameClient;
    }
  }
  private async loadAPI() {
    this.loadding.play("sceneLoading");
    this.statusLoadding = true;
    await this.callDataApi();
    this.loadding.play("offSceneLoadding");
    this.statusLoadding = false;

    // // director.loadScene(game);
  }
  update(deltaTime: number) {}
  public loadImg() {
    this.storeNode.getComponent(Sprite).spriteFrame =
      this.imgModal.img[(this.store.getDifficult().level - 1) % level.length];
    // this.statusLoadding = false;
    // assetManager.loadRemote(
    //   level[(this.store.getDifficult().level - 1) % level.length],
    //   (err, texture: ImageAsset) => {
    //     this.storeNode.getComponent(Sprite).spriteFrame =
    //       SpriteFrame.createWithImage(texture);
    //     this.statusLoadding = true;
    //   }
    // );
  }
  private async playGame() {
    if (!this.statusLoadding) {
      this.statusLoadding = true;
      this.loadding.play("sceneLoading");
      await this.gameClient.match
        .startMatch()
        .then((data) => {
          // this.matchId = data.matchId;
          this.parameters.getComponent(StoreApi).matchId = data.matchId;
        })
        .catch((error) => console.log(error));
      director.addPersistRootNode(this.parameters);
      director.addPersistRootNode(find("store"));
      director.loadScene(game);
    } else {
    }
  }
  private setLevel(event, customEventData: string): void {
    if (customEventData === "0") {
      this.store.levels = EZ;
      this.loadImg();
      this.menuView.HL(EZ);
      this.menuView.setLevel(this.store.getDifficult().level);
    } else if (customEventData === "1") {
      this.store.levels = Medium;
      this.loadImg();
      this.menuView.HL(Medium);
      this.menuView.setLevel(this.store.getDifficult().level);
    } else {
      this.store.levels = Hard;
      this.loadImg();
      this.menuView.HL(Hard);
      this.menuView.setLevel(this.store.getDifficult().level);
    }
  }
}
