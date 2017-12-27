import { Component, OnInit } from '@angular/core';
import { Tile } from '../object/tile';
import { Player } from '../object/player';
import { SocketService } from '../service/socket.service';

const USELESSTRILE: Tile[] = [
  {type: 'bamboo', value: 1, typeid: 0 },
  {type: 'bamboo', value: 1, typeid: 0 },
  {type: 'bamboo', value: 1, typeid: 0 },
  {type: 'bamboo', value: 1, typeid: 0 },
  {type: 'bamboo', value: 1, typeid: 0 },
  {type: 'bamboo', value: 1, typeid: 0 },
  {type: 'bamboo', value: 1, typeid: 0 },
  {type: 'bamboo', value: 1, typeid: 0 },
  {type: 'bamboo', value: 1, typeid: 0 },
  {type: 'bamboo', value: 1, typeid: 0 },
  {type: 'bamboo', value: 1, typeid: 0 },
  {type: 'bamboo', value: 1, typeid: 0 },
  {type: 'bamboo', value: 1, typeid: 0 },
  {type: 'bamboo', value: 1, typeid: 0 },
  {type: 'bamboo', value: 1, typeid: 0 },
  {type: 'bamboo', value: 1, typeid: 0 },
  {type: 'bamboo', value: 1, typeid: 0 }
];

const USINGTILE: Tile[] = [
  {type: 'bamboo', value: 1 , typeid: 0 },
  {type: 'bamboo', value: 2 , typeid: 0 },
  {type: 'bamboo', value: 2 , typeid: 0 },
  {type: 'bamboo', value: 3 , typeid: 0 },
  {type: 'bamboo', value: 5 , typeid: 0 },
  {type: 'bamboo', value: 6 , typeid: 0 },
  {type: 'bamboo', value: 9 , typeid: 0 }
];

const USEDTILE: Tile[] = [
  {type: 'bamboo', value: 1, typeid: 0 },
  {type: 'bamboo', value: 2, typeid: 0 },
  {type: 'bamboo', value: 3, typeid: 0 },
  {type: 'bamboo', value: 4, typeid: 0 },
  {type: 'bamboo', value: 5, typeid: 0 },
  {type: 'bamboo', value: 6, typeid: 0 }
];

@Component({
  selector: 'up',
  templateUrl: './up.component.html',
  styleUrls: [ './up.component.css' ]
})

export class UpComponent  implements OnInit {
  private player: Player;
  // 0 using_tile 1 used_tile 2  useless_tile
  private tiles: Tile[][]=[[],[],[]];
  private hasCurrentTile: boolean = false;
  private lastUselessNum: number = 0;

  constructor(private socketService: SocketService) {
    this.tiles[0] = USINGTILE;
    this.tiles[1] = USEDTILE;
    this.tiles[2] = USELESSTRILE;
  }

  ngOnInit(): void {
    this.socketService.getTile_Top.subscribe(
      (tiles)=>{
        this.tiles = tiles;
        let newNum = this.tiles[2].length;
        if(newNum > this.lastUselessNum) {
          this.hasCurrentTile = true;
        }else {
          this.hasCurrentTile = false;
        }
        this.lastUselessNum = newNum;
      }
    );
  }
}
