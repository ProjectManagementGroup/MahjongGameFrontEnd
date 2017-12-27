import { Component, OnInit } from '@angular/core';
import { Tile } from '../object/tile';
import { Player } from '../object/player';
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
  {type: 'bamboo', value: 1, typeid: 0 },
  {type: 'bamboo', value: 2, typeid: 0 },
  {type: 'bamboo', value: 3, typeid: 0 },
  {type: 'bamboo', value: 4, typeid: 0 },
  {type: 'bamboo', value: 5, typeid: 0 },
  {type: 'bamboo', value: 6, typeid: 0 }
];

@Component({
  selector: 'bottom',
  templateUrl: './bottom.component.html',
  styleUrls: [ './bottom.component.css' ]
})

export class BottomComponent  implements OnInit {
  private player: Player;
  // 0 using_tile 1 used_tile 2  useless_tile
  private tiles: Tile[][]=[[],[],[]];
  private hasCurrentTile: boolean = false;
  private lastUselessNum: number = 0;


  private uuid: number;
  private current_tile: Tile; //最后出的牌
  private turn: number=0; //当前出牌者，最后一个牌是谁出的，是已经出完的

  constructor(private socketService: SocketService,
              private orderTileService: OrderTileService,
              private checkTileService: CheckTileService ) {
    this.uuid = this.socketService.uuid;

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
    this.socketService.get_current.subscribe(
      (tile)=>{
        this.current_tile = tile;
      }
    );
    this.socketService.get_turn.subscribe(
      (turn)=>{
        this.turn = turn;
      }
    );
  }

  bump(): void {
    if(this.testBump()){
      this.socketService.sendMessage('bump|');
    }
  }

  private testBump(): boolean {
    let canBump = false;
    if(this.turn !== this.uuid){
      if(this.checkTileService.checkBump(this.current_tile, this.tiles[0])){
        canBump = true;
      }
    }
    return canBump;
  }

  eat(): void {


  }

  private testEat(): boolean {
    let canEat = false;
    if(this.turn == ((this.uuid + 3)%4)){
      // if(this.checkTileService.checkEat(this.current_tile, this.tiles[0])){
      //   canEat = true;
      // }
    }
    return canEat;
  }
  rob(): void {

  }

  win(): void {

  }
}
