import { _decorator, Component, director, find, Node } from "cc";
import { game } from "../constan";
import { StoreApi } from "../StoreApi";
const { ccclass, property } = _decorator;

@ccclass("EntryController")
export class EntryController extends Component {
  public gameClient;
  public matchId: string;
  start() {}

  update(deltaTime: number) {}
}
