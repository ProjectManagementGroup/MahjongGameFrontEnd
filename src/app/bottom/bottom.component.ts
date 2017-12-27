import { Component, OnInit } from '@angular/core';
import {Tile} from '../object/tile';
import {Player} from '../object/player';

const USELESSTRILE: Tile[] = [
  {type: 'bamboo', value: 1},
  {type: 'bamboo', value: 1},
  {type: 'bamboo', value: 1},
  {type: 'bamboo', value: 1},
  {type: 'bamboo', value: 1},
  {type: 'bamboo', value: 1},
  {type: 'bamboo', value: 1},
  {type: 'bamboo', value: 1},
  {type: 'bamboo', value: 1},
  {type: 'bamboo', value: 1},
  {type: 'bamboo', value: 1},
  {type: 'bamboo', value: 1},
  {type: 'bamboo', value: 1},
  {type: 'bamboo', value: 1},
  {type: 'bamboo', value: 1},
  {type: 'bamboo', value: 1},
  {type: 'bamboo', value: 1}
];

const USINGTILE: Tile[] = [
  {type: 'bamboo', value: 1 },
  {type: 'bamboo', value: 2 },
  {type: 'bamboo', value: 2 },
  {type: 'bamboo', value: 3 },
  {type: 'bamboo', value: 5 },
  {type: 'bamboo', value: 6 },
  {type: 'bamboo', value: 9 }
];

const USEDTILE: Tile[] = [
  {type: 'bamboo', value: 1},
  {type: 'bamboo', value: 2},
  {type: 'bamboo', value: 3},
  {type: 'bamboo', value: 4},
  {type: 'bamboo', value: 5},
  {type: 'bamboo', value: 6}
];

@Component({
  selector: 'bottom',
  templateUrl: './bottom.component.html',
  styleUrls: [ './bottom.component.css' ]
})

export class BottomComponent  implements OnInit {
  private player: Player;
  private useless_tiles: Array<Tile>;
  private using_tiles: Array<Tile>;
  private used_tiles: Array<Tile>;

  constructor() {
    // this.useless_tiles = [];
    // this.using_tiles = [];
    // this.used_tiles = [];
    this.useless_tiles = USELESSTRILE;
    this.using_tiles = USINGTILE;
    this.used_tiles = USEDTILE;
  }

  ngOnInit(): void {
    this.initializePlayer();
    this.initializeUsingTiles();
  }

  initializePlayer() {

  }

  initializeUsingTiles() {

  }

}
