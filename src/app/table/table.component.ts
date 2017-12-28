import { Component,OnInit } from '@angular/core';
import {Player} from '../object/player';
import {SocketService} from '../service/socket.service';
import {Tile} from '../object/tile';
import {Router} from "@angular/router";
/*
const PLAYERS: Player[] = [
  {name: 'name1', gameid: 0, point: 100, ready: true},
  {name: 'name2', gameid: 1, point: 100, ready: true},
  {name: 'name3', gameid: 2, point: 100, ready: true},
  {name: 'name4', gameid: 3, point: 100, ready: true}
];
*/
@Component({
  selector: 'table',
  templateUrl: './table.component.html',
  styleUrls: [ './table.component.css' ]
})

export class TableComponent  implements OnInit {
  private players: Player[] = [];
  private uuid: number;
  private banker: Player;//庄家

  private leftPlayer: Player;
  private rightPlayer: Player;
  private upPlayer: Player;
  private bottomPlayer: Player;

  private restTile: number;//剩余牌数
  private current_tile: Tile; //最后出的牌
  private turn: number=0; //当前出牌者，最后一个牌是谁出的，是已经出完的

  private is_finished=false;

  constructor(private socketService: SocketService , private router: Router) {
    this.players = this.socketService.players;
    this.uuid = this.socketService.uuid;
    this.banker = this.players[0];

    this.bottomPlayer = this.players[this.uuid];
    this.rightPlayer = this.players[(this.uuid + 1)%4];
    this.upPlayer = this.players[(this.uuid + 2)%4];
    this.leftPlayer = this.players[(this.uuid + 3)%4];

    this.restTile = this.socketService.rest;

    //this.leftPlayer = PLAYERS[0];
    //this.upPlayer = PLAYERS[1];
    //this.rightPlayer = PLAYERS[2];
    //this.bottomPlayer = PLAYERS[3];
    //this.restTile = 83;
    //this.banker = PLAYERS[0];
  }

  ngOnInit(): void {
    this.socketService.get_rest.subscribe(
      (rest)=> {
        this.restTile = rest;
      }
    );

    this.socketService.get_current.subscribe(
      (tile)=>{
        this.current_tile = tile;
      }
    );

    this.socketService.get_turn.subscribe(
      (turn)=>{
        this.turn = turn;
      }
    );

    this.socketService.get_is_finished.subscribe(
      (val)=>{
        this.is_finished=val;
        if(this.is_finished){
          this.router.navigate(['/gameResult']);
        }
      }
    );
  }

}
