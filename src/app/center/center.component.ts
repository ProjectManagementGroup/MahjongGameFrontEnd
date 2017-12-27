import { Component } from '@angular/core';
import {Player} from '../object/player';

const PLAYERS: Player[] = [
  {name: 'name1', gameid: 0, point: 100, ready: true},
  {name: 'name2', gameid: 1, point: 100, ready: true},
  {name: 'name3', gameid: 2, point: 100, ready: true},
  {name: 'name4', gameid: 3, point: 100, ready: true}
];

@Component({
  selector: 'center-table',
  templateUrl: './center.component.html',
  styleUrls: [ './center.component.css' ]
})

export class CenterComponent {
  private leftPlayer: Player;
  private rightPlayer: Player;
  private upPlayer: Player;
  private bottomPlayer: Player;
  private curPlayer: Player;
  private countDown: number;

  constructor() {
    this.leftPlayer = PLAYERS[0];
    this.upPlayer = PLAYERS[1];
    this.rightPlayer = PLAYERS[2];
    this.bottomPlayer = PLAYERS[3];
    this.curPlayer = PLAYERS[2];
    this.countDown = 7;
  }

}
