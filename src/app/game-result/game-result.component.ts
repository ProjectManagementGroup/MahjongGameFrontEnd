import { Component, OnInit } from '@angular/core';
import { Tile } from '../object/tile';
import { GameResult } from '../object/game-result';
import { SocketService } from '../service/socket.service';


@Component({
  selector: 'game-result',
  templateUrl: './game-result.component.html',
  styleUrls: [ './game-result.component.css' ]
})

export class GameResultComponent  implements OnInit {
  private player_gameid: number;
  private winner_tiles: Array<Tile> = [];
  private hu_tile: Tile ;
  private game_results: Array<GameResult> = [];
  private imgsrc: Array<string>;

  constructor(private socketService: SocketService) {
    this.winner_tiles = [];
    this.game_results = [];
    this.imgsrc = [];
  }

  ngOnInit(): void {
    this.initializePlayerGameId();
    this.initializeWinnerTiles();
    this.initializeHuTile();
    this.initializeGameResults();
  }

  initializePlayerGameId() {}
  initializeWinnerTiles() {}
  initializeHuTile() {}
  initializeGameResults() {}

}
