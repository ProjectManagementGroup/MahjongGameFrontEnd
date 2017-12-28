import { Component, OnInit } from '@angular/core';
import { Tile } from '../object/tile';
import { GameResult } from '../object/game-result';
import { SocketService } from '../service/socket.service';
import {Player} from "../object/player";

// const WINNERTILES: Tile[] = [
//   {type: 'bamboo', value: 1, typeid: 0 },
//   {type: 'bamboo', value: 1, typeid: 0 },
//   {type: 'bamboo', value: 1, typeid: 0 },
//   {type: 'bamboo', value: 1, typeid: 0 },
//   {type: 'bamboo', value: 1, typeid: 0 },
//   {type: 'bamboo', value: 1, typeid: 0 },
//   {type: 'bamboo', value: 1, typeid: 0 },
//   {type: 'bamboo', value: 1, typeid: 0 },
//   {type: 'bamboo', value: 1, typeid: 0 },
//   {type: 'bamboo', value: 1, typeid: 0 },
//   {type: 'bamboo', value: 1, typeid: 0 },
//   {type: 'bamboo', value: 1, typeid: 0 },
//   {type: 'bamboo', value: 1, typeid: 0 }
// ];
//
// const GAMERESULTS: GameResult[] = [
//   {name: "name1", gameid:0, point:100, win: "-"},
//   {name: "name2", gameid:1, point:300, win: "+"},
//   {name: "name3", gameid:2, point:100, win: "-"},
//   {name: "name4", gameid:3, point:100, win: "-"}
// ]

@Component({
  selector: 'game-result',
  templateUrl: './game-result.component.html',
  styleUrls: [ './game-result.component.css' ]
})

export class GameResultComponent  implements OnInit {
  private winner_tiles: Array<Tile> = [];
  private hu_tile: Tile ;
  //private game_results: Array<GameResult> = [];
  private win: boolean = false;
  private uuid:number;
  private players:Player[];
  constructor(private socketService: SocketService) {


    // this.winner_tiles = WINNERTILES;
    // this.hu_tile = {type: 'bamboo', value: 2, typeid: 0 };
    // this.game_results = GAMERESULTS;
    this.winner_tiles=this.socketService.win_tiles;
    this.hu_tile=this.socketService.win_tile;
    this.players=this.socketService.players;
    this.uuid=this.socketService.uuid;
  }

  ngOnInit(): void {

  }



}
