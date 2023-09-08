import GameClient from "@onechaintech/gamesdk-dev";
import { _decorator, Component, Node, director, find } from "cc";
import { StoreApi } from "../StoreApi";
import { home } from "../constan";
const { ccclass, property } = _decorator;

@ccclass("loaddingController")
export class loaddingController extends Component {
  public gameClient;
  public async start(): Promise<void> {
    let parameters = find("GameClient");

    if (parameters === null) {
      let parameters = new Node("GameClient");
      if (this.gameClient === undefined) {
        this.gameClient = new GameClient(
          "64b0d206486cfae38b3439c5",
          "eefdf7c8-a562-4780-9231-a86d0d613729",
          window.parent,
          { dev: true }
        );
        await this.gameClient
          .initAsync()
          .then(() => {})
          .catch((err) => console.log(err));
      }
      let gameClientParams = parameters.addComponent(StoreApi);
      gameClientParams.gameClient = this.gameClient;
      director.addPersistRootNode(parameters);
    }
    director.loadScene(home);
  }
}
