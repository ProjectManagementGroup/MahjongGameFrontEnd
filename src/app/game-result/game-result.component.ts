import { Component, OnInit } from '@angular/core';
import { Tile } from '../object/tile';
import { SocketService } from '../service/socket.service';
import {Player} from "../object/player";
import {OrderTileService} from "../service/order-tile.service";
import {Router} from '@angular/router';

const WINNERTILES: Tile[] = [
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
const PLAYERS: Player[] = [
  {name: 'name1', gameid: 0, point: 100, ready: true},
  {name: 'name2', gameid: 1, point: 100, ready: true},
  {name: 'name3', gameid: 2, point: 100, ready: true},
  {name: 'name4', gameid: 3, point: 100, ready: true}
];


@Component({
  selector: 'game-result',
  templateUrl: './game-result.component.html',
  styleUrls: [ './game-result.component.css' ]
})

export class GameResultComponent  implements OnInit {
  private winner_tiles: Array<Tile> = [];
  private hu_tile: Tile ;

  private players:Player[];
  private uuid:number;
  private winner_id:number;
  private win: boolean = false;

  private isReady = false;
  constructor(private socketService: SocketService,private orderService:OrderTileService,private router: Router) {
    this.winner_tiles=this.socketService.win_tiles;
    this.orderService.bubbleSortTile(this.winner_tiles);
    this.hu_tile=this.socketService.win_tile;
    this.players=this.socketService.players;
    this.uuid=this.socketService.uuid;
    this.winner_id=this.socketService.winner;
    this.win=this.winner_id==this.uuid;

    // this.winner_tiles = WINNERTILES;
    // this.hu_tile=WINNERTILES[0];
    // this.players=PLAYERS;
    // this.win=false;
  }

  ngOnInit(): void {
    this.socketService.get_players.subscribe(
      (val)=>{
        this.players=val;
        if(this.isReady){
          this.router.navigate(['/room']);
        }
      }
    );
  }

  ready(): void {
    this.socketService.sendMessage("ready|");
    this.isReady = true;
  }

}
