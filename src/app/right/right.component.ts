import { Component, OnInit } from '@angular/core';
import {Tile} from '../object/tile';
import {Player} from '../object/player';
import {PlayerService} from '../service/player.service';

@Component({
  selector: 'right',
  templateUrl: './right.component.html',
  styleUrls: [ './right.component.css' ]
})

export class RightComponent  implements OnInit {
  private rightplayer: Player;
  private useless_tiles: Array<Tile>;
  private using_tiles: Array<Tile>;
  private used_tiles: Array<Tile>;

  constructor(private playerSer: PlayerService) {
    this.useless_tiles = [];
    this.using_tiles = [];
    this.used_tiles = [];
  }

  ngOnInit(): void {
    this.initializeRightPlayer();
    this.initializeUsingTiles();
  }

  initializeRightPlayer() {

  }

  initializeUsingTiles() {

  }
}
