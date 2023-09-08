import {
  _decorator,
  Animation,
  AudioSource,
  Component,
  find,
  Label,
  Node,
} from "cc";
import { EZ, Hard, Medium } from "../constan";
import { Store } from "../Store";
const { ccclass, property } = _decorator;

@ccclass("MenuView")
export class MenuView extends Component {
  @property({ type: Node })
  private HLStar: Node;
  @property({ type: Label })
  private labelStar: Label;
  @property({ type: Label })
  private level: Label;
  @property({ type: Animation })
  private settingAnim: Animation;
  @property({ type: AudioSource })
  private openSettingAudio: AudioSource;
  @property({ type: AudioSource })
  private closeSettingAudio: AudioSource;
  @property({ type: AudioSource })
  private playAudio: AudioSource;
  @property({ type: Node })
  private onAudio: Node;
  @property({ type: Node })
  private offAudio: Node;
  private statusSetting: boolean = false;
  private store: Store;
  protected start(): void {
    this.store = find("store").getComponent(Store);
    if (this.store.audio) {
      this.onAudioGame();
    } else {
      this.offAudioGame();
    }
  }
  public HL(level: string): void {
    if (level === EZ) {
      this.HLStar.setPosition(-90, -70);
      this.labelStar.string = EZ;
    } else if (level === Medium) {
      this.HLStar.setPosition(-5, -70);
      this.labelStar.string = Medium;
    } else if (level === Hard) {
      this.HLStar.setPosition(80, -70);
      this.labelStar.string = Hard;
    }
  }
  public onSetting(): void {
    if (this.statusSetting) {
      this.settingAnim.play("offSetting");
      this.closeSettingAudio.play();
      this.statusSetting = false;
    } else {
      this.settingAnim.play("onSetting");
      this.openSettingAudio.play();
      this.statusSetting = true;
    }
  }
  public onPlayAudio(): void {
    this.playAudio.play();
  }
  public setLevel(num: number): void {
    this.level.string = `${num}`;
  }
  public onAudioGame(): void {
    this.store.audio = true;
    this.onAudio.active = true;
    this.offAudio.active = false;
  }
  public offAudioGame(): void {
    this.store.audio = false;
    this.onAudio.active = false;
    this.offAudio.active = true;
  }
}
