import { Component, OnInit } from '@angular/core';
import {Tile} from '../object/tile';
import {GameResult} from '../object/game-result';
import {GameResultService} from '../service/game-result.service';
import {PlayerService} from '../service/player.service';

@Component({
  selector: 'game-result',
  templateUrl: './game-result.component.html',
  styleUrls: [ './game-result.component.css' ]
})

export class GameResultComponent  implements OnInit {
  player_gameid: number;
  winner_tiles: Array<Tile>;
  hu_tile: Tile;
  game_results: Array<GameResult>;
  imgsrc: Array<string>;

  constructor(private gameResultSer: GameResultService ,
              private playerSer: PlayerService) {
    this.winner_tiles = [];
    this.game_results = [];
    this.imgsrc = [];
  }

  ngOnInit(): void {
    this.initializePlayerGameId();
    this.initializeWinnerTiles();
    this.initializeHuTile();
    this.initializeGameResults();
    this.initializeImgSrc();
  }

  initializePlayerGameId() {}
  initializeWinnerTiles() {}
  initializeHuTile() {}
  initializeGameResults() {}

  initializeImgSrc() {
    const length = this.winner_tiles.length;
    const basepath = '../../assets/picture/';
    for ( let i = 0; i < length; i++) {
      this.imgsrc.push(basepath + this.winner_tiles[i].type + '/' + this.winner_tiles[i].value + '.png');
    }
  }



}
