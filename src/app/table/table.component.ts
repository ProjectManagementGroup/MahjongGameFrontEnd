import { Component,OnInit } from '@angular/core';
import {Player} from '../object/player';
import {SocketService} from '../service/socket.service';

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
  private leftTile: number;
  private banker: Player;

  constructor(private socketService: SocketService) {
    if(this.socketService.players.length < 4){

    }
    this.leftPlayer = PLAYERS[0];
    this.upPlayer = PLAYERS[1];
    this.rightPlayer = PLAYERS[2];
    this.bottomPlayer = PLAYERS[3];
    this.leftTile = 100;
    this.banker = PLAYERS[0];
  }

  ngOnInit(): void {
    
  }

  initializeLRUBPlayer(): void{

  }

}
