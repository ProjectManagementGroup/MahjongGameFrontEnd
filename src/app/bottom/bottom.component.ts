import {Component, Input, OnInit} from '@angular/core';
import { Tile } from '../object/tile';
import { SocketService } from '../service/socket.service';
import {OrderTileService} from '../service/order-tile.service';
import {CheckTileService} from '../service/check-tile.service';

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
  {type: 'bamboo', value: 1, typeid: 0},
  {type: 'bamboo', value: 2, typeid: 0},
  {type: 'bamboo', value: 3, typeid: 0},
  {type: 'bamboo', value: 4, typeid: 0},
  {type: 'bamboo', value: 5, typeid: 0},
  {type: 'bamboo', value: 6, typeid: 0}
];

@Component({
  selector: 'bottom',
  templateUrl: './bottom.component.html',
  styleUrls: [ './bottom.component.css' ]
})

export class BottomComponent  implements OnInit {

  // 0 using_tile 1 used_tile 2  useless_tile
  private tiles: Tile[][]=[[],[],[]];
  private new_tile:Tile;
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
        this.orderTileService.bubbleSortTile(this.tiles[0]);
        let newNum = this.tiles[2].length;
        if(newNum > this.lastUselessNum) {
          this.hasCurrentTile = true;
        }else {
          this.hasCurrentTile = false;
        }
        this.lastUselessNum = newNum;
      }
    );
    this.socketService.get_new_tile.subscribe(
      (val)=>{
        this.new_tile=val;
      }
    )
  }

  //检测碰牌是否成功，如果成功就发给后台
  bump(): void {
    let bumpTiles = [];
    if(this.turn !== this.uuid){
      if(this.checkTileService.checkBump(this.current_tile, this.tiles[0], bumpTiles)){
        this.socketService.sendEatBumpMessage(bumpTiles);
        this.socketService.sendMessage('bump|');

      }
    }
  }

  eat(): void {
    let eatTiles = [];
    if(this.turn == ((this.uuid + 3)%4)){
      if(this.checkTileService.checkEat(this.current_tile, this.tiles[0], eatTiles)){
        this.socketService.sendEatBumpMessage(eatTiles);
        this.socketService.sendMessage('eat|');

      }
    }
  }

  rob(): void {

  }

  win(): void {

  }

  outTile(tile:Tile):void {
    var message="out|"+tile;
    this.socketService.setOuttile(tile);
    this.socketService.sendMessage(message);
  }
}
