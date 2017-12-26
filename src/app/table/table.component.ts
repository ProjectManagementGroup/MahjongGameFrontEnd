import { Component,OnInit } from '@angular/core';
import {PlayerService} from '../service/player.service';
import {Player} from '../object/player';

const PLAYERS: Player[] = [
  {name: 'name1', gameid: 0, point: 100, ready: true},
  {name: 'name2', gameid: 1, point: 100, ready: true},
  {name: 'name3', gameid: 2, point: 100, ready: true},
  {name: 'name4', gameid: 3, point: 100, ready: true}
];

@Component({
  selector: 'table',
  templateUrl: './table.component.html',
  styleUrls: [ './table.component.css' ]
})

export class TableComponent  implements OnInit {
  private leftPlayer: Player;
  private rightPlayer: Player;
  private upPlayer: Player;
  private bottomPlayer: Player;

  constructor(private playerSer: PlayerService ) {
    this.leftPlayer = PLAYERS[0];
    this.upPlayer = PLAYERS[1];
    this.rightPlayer = PLAYERS[2];
    this.bottomPlayer = PLAYERS[3];
  }

  ngOnInit(): void {
    this.initializeLeftPlayer();
    this.initializeUpPlayer();
    this.initializeRightPlayer();
    this.initializeBottomPlayer();
  }

  initializeLeftPlayer() {

  }

  initializeRightPlayer() {

  }

  initializeUpPlayer() {

  }

  initializeBottomPlayer() {

  }
}
