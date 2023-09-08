import {
  _decorator,
  Animation,
  AudioSource,
  Component,
  find,
  Label,
  Node,
  Sprite,
  SpriteFrame,
} from "cc";
import { Store } from "../Store";
import { EZ, Medium } from "../constan";
const { ccclass, property } = _decorator;

@ccclass("NavbarView")
export class NavbarView extends Component {
  @property({ type: Label })
  private level: Label;
  @property({ type: Label })
  private move: Label;
  @property({ type: Label })
  private time: Label;
  @property({ type: Animation })
  private winAnim: Animation;
  @property({ type: Label })
  private levelWin: Label;
  @property({ type: Label })
  private moveWIn: Label;
  @property({ type: Label })
  private timeWin: Label;
  @property({ type: Sprite })
  private star: Sprite;
  @property({ type: [SpriteFrame] })
  private arrStar: SpriteFrame[] = [];
  @property({ type: Animation })
  private loseAnim: Animation;
  @property({ type: Animation })
  private loading: Animation;
  @property({ type: AudioSource })
  private playAudio: AudioSource;
  @property({ type: AudioSource })
  private openWinAudio: AudioSource;
  @property({ type: AudioSource })
  private WinAudio: AudioSource;
  @property({ type: AudioSource })
  private closeWinAudio: AudioSource;
  @property({ type: AudioSource })
  private clickAudio: AudioSource;
  @property({ type: Animation })
  private onConfirm: Animation;
  private offConfirm: AudioSource;
  private statusPupupWin: boolean = true;
  private timeGame: string;
  protected start(): void {
    this.setLevel();
    this.loaddingStart();
  }
  public loaddingStart(): void {
    this.loading.play("offSceneLoadding");
  }
  public setTime(time: number): void {
    let minute = Math.floor(time / 60);
    let second = time % 60;
    this.timeGame = `${minute <= 9 ? `0${minute}` : minute}:${
      second <= 9 ? `0${second}` : second
    }`;
    this.time.string = this.timeGame;
  }
  public setMove(move: string): void {
    this.move.string = move;
  }
  public setLevel(): void {
    let store = find("store");
    this.level.string = `${store.getComponent(Store).getDifficult().level}`;
  }
  public offWinGame(): void {
    if (this.statusPupupWin) {
      this.winAnim.play("offPupupWin");
      this.closeWinAudio.play();
      this.statusPupupWin = false;
    } else {
      this.winAnim.play("onPupupgame");
      this.openWinAudio.play();
      this.statusPupupWin = true;
    }
  }
  public winGame(): void {
    this.setStar();
    this.WinAudio.play();
    this.levelWin.string = this.level.string;
    this.timeWin.string = this.timeGame;
    this.moveWIn.string = this.move.string;
  }
  public loseGame(): void {
    this.loseAnim.play();
  }
  public onSceneLoadding(): void {
    this.loading.play();
  }
  private onPlayAudio(): void {
    this.playAudio.play();
  }
  private onClickAudio(): void {
    this.clickAudio.play();
  }
  private confirmHome(): void {
    if (this.statusPupupWin) {
      this.statusPupupWin = false;
      this.onConfirm.play("onConfirm");
    } else {
      this.statusPupupWin = true;
      this.onConfirm.play("offConfirm");
    }
  }
  public setStar(): void {
    let store = find("store");
    let level = store.getComponent(Store).levels;
    if (level === EZ) {
      this.star.spriteFrame = this.arrStar[0];
    } else if (level === Medium) {
      this.star.spriteFrame = this.arrStar[1];
    } else {
      this.star.spriteFrame = this.arrStar[2];
    }
  }
}
