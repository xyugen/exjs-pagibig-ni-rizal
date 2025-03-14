import { Actor, ActorArgs } from "excalibur";

export default class Player extends Actor {
  isOnGround: boolean = false;

  constructor(args: ActorArgs) {
    super(args);
  }
}