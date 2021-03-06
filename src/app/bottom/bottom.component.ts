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
  private new_tile:Tile = null;
  // 最后出的那张牌在不在这个方位
  private hasCurrentTile: boolean = false;
  private can_win:boolean=false;

  @Input() uuid: number;
  @Input() current_tile: Tile; //最后出的牌
  @Input() turn: number=0; //当前出牌者，最后一个牌是谁出的，是已经出完的
  private next_turn: number = 0;//默认庄家出牌


  constructor(private socketService: SocketService,
              private orderTileService: OrderTileService,
              private checkTileService: CheckTileService ) {

    // this.tiles[0] = USINGTILE;
    // this.tiles[1] = USEDTILE;
    // this.tiles[2] = USELESSTRILE;
    // this.new_tile = USINGTILE[0];
  }

  ngOnInit(): void {
    this.socketService.getTile_Bottom.subscribe(
      (tiles)=>{
        this.tiles = tiles;
        this.orderTileService.bubbleSortTile(this.tiles[0]);
      }
    );
    this.socketService.get_new_tile.subscribe(
      (val)=>{
        this.new_tile=val;
      }
    );
    this.socketService.get_next_turn.subscribe(
      (val)=>{
        this.next_turn=val;
      }
    );
    this.socketService.get_last_is_bottom.subscribe(
      (val)=>{
        this.hasCurrentTile = val;
      }
    );
    this.socketService.get_can_win.subscribe(
      (val)=>{
        this.can_win=val;
      }
    );
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
        this.socketService.sendMessage('eat|'+eatTiles[0].value+'|'+eatTiles[1].value);

      }
    }
  }

  rob(): void {

  }

  win(): void {
    if(this.can_win) {
      if (this.new_tile !== null) {
        if(this.checkTileService.checkWin(this.tiles[0],this.new_tile)){
          this.socketService.setWintile(this.new_tile);
          var message = "win|" + this.new_tile.typeid + "|" + this.new_tile.value;
          this.socketService.sendMessage(message);
        }
      } else if (this.current_tile !== null) {
        if(this.checkTileService.checkWin(this.tiles[0], this.current_tile)){
          this.socketService.setWintile(this.current_tile);
          var message = "win|" + this.current_tile.typeid + "|" + this.current_tile.value;
          this.socketService.sendMessage(message);
        }
      }
    }
  }

  outTile(tile:Tile):void {

    if(this.next_turn == this.uuid) {
      this.next_turn++;
      this.new_tile = null;
      var message="out|"+tile.type+"|"+tile.value;
      this.socketService.setOuttile(tile);
      this.socketService.sendMessage(message);
    }
  }
}
