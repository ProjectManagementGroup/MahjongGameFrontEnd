import { Component, OnInit } from '@angular/core';
import {Player} from '../object/player';

const PLAYERS: Player[] = [
  {name: 'name1', gameid: 0, point: 100, ready: true},
  {name: 'name2', gameid: 1, point: 100, ready: true},
  {name: 'name3', gameid: 2, point: 100, ready: false},
  {name: 'name4', gameid: 3, point: 100, ready: true}
];

@Component({
  selector: 'room-information',
  templateUrl: './room-information.component.html',
  styleUrls: [ './room-information.component.css' ]
})

export class RoomInformationComponent implements OnInit {
  private players: Array<Player>;
  private banker: Player;

  constructor( ) {
    // this.players = [];
    this.players = PLAYERS;
    this.banker = {name: 'name1', gameid: 0, point: 100, ready: true};
  }

  ngOnInit(): void {
    this.initializePlayers();
    this.initializeBanker();
    this.initializeLeftTile();
  }

  initializePlayers() {

  }

  initializeBanker() {

  }

  initializeLeftTile() {

  }

}
