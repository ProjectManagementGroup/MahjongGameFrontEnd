import { Component, OnInit } from '@angular/core';
import { Tile } from '../object/tile';
import { Player } from '../object/player';
import { SocketService } from '../service/socket.service';
/*
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
*/
@Component({
  selector: 'left',
  templateUrl: './left.component.html',
  styleUrls: [ './left.component.css' ]
})

export class LeftComponent  implements OnInit {

  // 0 using_tile 1 used_tile 2  useless_tile
  private tiles: Tile[][]=[[],[],[]];
  private hasCurrentTile: boolean = false;
  private lastUselessNum: number = 0;

  constructor(private socketService: SocketService) {
    //this.tiles[0] = USINGTILE;
    //this.tiles[1] = USEDTILE;
    //this.tiles[2] = USELESSTRILE;
  }

  ngOnInit(): void {
    this.socketService.getTile_Left.subscribe(
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
