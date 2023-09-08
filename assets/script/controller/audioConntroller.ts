import { _decorator, AudioSource, Component, find, Node } from "cc";
import { Store } from "../Store";
const { ccclass, property } = _decorator;

@ccclass("audioConntroller")
export class audioConntroller extends Component {
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
  @property({ type: AudioSource })
  private moveAudio: AudioSource;
  protected start(): void {
    let store = find("store").getComponent(Store);
    if (store.audio) {
      this.onAudio();
    } else {
      this.offAudio();
    }
  }
  public onClickAudio(): void {
    this.clickAudio.play();
  }
  public onAudio(): void {
    this.playAudio.volume = 1;
    this.openWinAudio.volume = 1;
    this.WinAudio.volume = 1;
    this.closeWinAudio.volume = 1;
    this.clickAudio.volume = 1;
    this.moveAudio.volume = 1;
  }
  public offAudio(): void {
    this.playAudio.volume = 0;
    this.openWinAudio.volume = 0;
    this.WinAudio.volume = 0;
    this.closeWinAudio.volume = 0;
    this.clickAudio.volume = 0;
    this.moveAudio.volume = 0;
  }
}
