import { _decorator, Component, Node } from "cc";
import { Difficult } from "./enum";
import { EZ, Hard, Medium } from "./constan";
import { LocalData } from "./localData";
const { ccclass, property } = _decorator;

@ccclass("Store")
export class Store extends Component {
  private Levels: string = EZ;
  private EZ: Difficult = { level: 1, row: 3, col: 4, move: 20 };
  private Medium: Difficult = { level: 1, row: 4, col: 6, move: 40 };
  private Hard: Difficult = { level: 1, row: 6, col: 8, move: 100 };
  public get hard(): Difficult {
    return this.Hard;
  }
  public set hard(value: Difficult) {
    this.Hard = value;
  }

  private Audio: boolean = true;
  public get audio(): boolean {
    return this.Audio;
  }
  public set audio(value: boolean) {
    this.Audio = value;
  }
  public get levels(): string {
    return this.Levels;
  }
  public set levels(level: string) {
    this.Levels = level;
  }
  public getDifficult(): Difficult {
    try {
      if (this.Levels === EZ) {
        localStorage.setItem(EZ, this.EZ.level.toString());
        return this.EZ;
      } else if (this.Levels === Medium) {
        localStorage.setItem(Medium, this.Medium.level.toString());
        return this.Medium;
      } else {
        localStorage.setItem(Hard, this.Hard.level.toString());
        return this.Hard;
      }
    } catch (error) {
      if (this.Levels === EZ) {
        LocalData.EZ = this.EZ.level;
        return this.EZ;
      } else if (this.Levels === Medium) {
        LocalData.Medium = this.Medium.level;
        return this.Medium;
      } else {
        LocalData.Hard = this.Hard.level;
        return this.Hard;
      }
    }
  }
  public getCountLevel(): number {
    const count = this.EZ.level + this.Hard.level + this.Medium.level + 1 - 3;
    console.log(count);

    return count;
  }
  public setDificult(): void {
    try {
      this.EZ.level = localStorage.getItem(EZ)
        ? Number(localStorage.getItem(EZ))
        : 1;
      this.Medium.level = localStorage.getItem(Medium)
        ? Number(localStorage.getItem(Medium))
        : 1;
      this.Hard.level = localStorage.getItem(Hard)
        ? Number(localStorage.getItem(Hard))
        : 1;
    } catch (error) {
      this.EZ.level = LocalData.EZ !== null ? LocalData.EZ : 1;
      this.Medium.level = LocalData.Medium !== null ? LocalData.Medium : 1;
      this.Hard.level = LocalData.Hard !== null ? LocalData.Hard : 1;
    }
  }
  public setDifficult(level: number): void {
    if (this.Levels === EZ) {
      this.EZ.level = level;
    } else if (this.Levels === Medium) {
      this.Medium.level = level;
    }
  }
}
