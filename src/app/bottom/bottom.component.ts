import {Component, Input, OnInit} from '@angular/core';
import { Tile } from '../object/tile';
import { Player } from '../object/player';
import { SocketService } from '../service/socket.service';
import {OrderTileService} from '../service/order-tile.service';
import {CheckTileService} from '../service/check-tile.service';
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
*/
@Component({
  selector: 'bottom',
  templateUrl: './bottom.component.html',
  styleUrls: [ './bottom.component.css' ]
})

export class BottomComponent  implements OnInit {

  // 0 using_tile 1 used_tile 2  useless_tile
  private tiles: Tile[][]=[[],[],[]];
  // 最后出的那张牌在不在这个方位
  private hasCurrentTile: boolean = false;
  private lastUselessNum: number = 0;

  @Input() uuid: number;
  @Input() current_tile: Tile; //最后出的牌
  @Input() turn: number=0; //当前出牌者，最后一个牌是谁出的，是已经出完的

  constructor(private socketService: SocketService,
              private orderTileService: OrderTileService,
              private checkTileService: CheckTileService ) {

  }

  ngOnInit(): void {
    this.socketService.getTile_Bottom.subscribe(
      (tiles)=>{
        this.tiles = tiles;
        this.orderTileService.bubbleSortTile(tiles[0]);
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

  //检测碰牌是否成功，如果成功就发给后台
  bump(): void {
    let bumpTiles = [];
    if(this.turn !== this.uuid){
      if(this.checkTileService.checkBump(this.current_tile, this.tiles[0], bumpTiles)){
        this.socketService.sendMessage('bump|');
        this.socketService.sendEatBumpMessage(bumpTiles);
      }
    }
  }

  eat(): void {
    let eatTiles = [];
    if(this.turn == ((this.uuid + 3)%4)){
      if(this.checkTileService.checkEat(this.current_tile, this.tiles[0], eatTiles)){
        this.socketService.sendMessage('eat|');
        this.socketService.sendEatBumpMessage(eatTiles);
      }
    }
  }

  rob(): void {

  }

  win(): void {

  }
}
