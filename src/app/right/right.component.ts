import { Component, OnInit } from '@angular/core';
import {Tile} from '../object/tile';
import {Player} from '../object/player';
import {PlayerService} from '../service/player.service';
import {UselessTileService} from '../service/useless-tile.service';
import {UsingTileService} from '../service/using-tile.service';
import {UsedTileService} from '../service/used-tile.service';

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
  {type: 'unknown', value: 0 },
  {type: 'unknown', value: 0 },
  {type: 'unknown', value: 0 },
  {type: 'unknown', value: 0 },
  {type: 'unknown', value: 0 },
  {type: 'unknown', value: 0 },
  {type: 'unknown', value: 0 }
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
  selector: 'right',
  templateUrl: './right.component.html',
  styleUrls: [ './right.component.css' ]
})

export class RightComponent  implements OnInit {
  private player: Player;
  private useless_tiles: Array<Tile>;
  private using_tiles: Array<Tile>;
  private used_tiles: Array<Tile>;

  constructor(private playerSer: PlayerService,
              private uselessTileSer: UselessTileService,
              private usingTileSer: UsingTileService,
              private usedTileSer: UsedTileService) {
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
