import { Injectable } from '@angular/core';
import * as Rx from 'rxjs/Rx';
import { Tile } from '../object/tile';
import { User} from '../object/user';
import { Player} from '../object/player';
import {Subject} from 'rxjs';
@Injectable()
export class SocketService {
  //0 using_tile 1 used_tile 2  useless_tile
   top_tile: Tile[][];
   getTile_Top: Subject<Tile[][]> = new Subject<Tile[][]>();
   left_tile: Tile[][];
   getTile_Left: Subject<Tile[][]> = new Subject<Tile[][]>();
   right_tile:Tile[][];
   getTile_Right: Subject<Tile[][]> = new Subject<Tile[][]>();
   bottom_tile:Tile[][];
   getTile_Bottom: Subject<Tile[][]> = new Subject<Tile[][]>();

   turn: number=0; //当前出牌者
   get_turn: Subject<number> = new Subject<number>();
   current_tile: Tile; //最后出的牌
   get_current: Subject<Tile> = new Subject<Tile>();
   rest: number; //剩下的牌
   get_rest: Subject<number> = new Subject<number>();
   user: User; //本人的user信息
   get_user: Subject<User> = new Subject<User>();
   //isfinished: boolean; //是否结束
  //自己的index
    uuid: number;
    get_uuid: Subject<number> = new Subject<number>();
  //游戏是否开始
   game_start: boolean=false;
   get_game_start: Subject<boolean> = new Subject<boolean>();
   eat_bump_tiles: Tile[];
   players: Player[]; //player列表
   get_players: Subject<Player[]> = new Subject<Player[]>();
   register_state:boolean=false;
   getRS: Subject<boolean> = new Subject<boolean>();
   login_state:boolean=false;
   getLS: Subject<boolean> = new Subject<boolean>();
   //被邀请信息
   inviation: string[];
   get_invitation: Subject<string[]> = new Subject<string[]>();
   //成功邀请的房间号
   room_number: string;
   get_room_number: Subject<string> = new Subject<string>();
   wsUrl: string = 'wss://192.168.99.1:9000/game/ws';
   socket: WebSocket = null;
     //
     private create():void {
     this.socket = new WebSocket(this.wsUrl);
     this.socket.onmessage = this.dealData;

     this.socket.onerror = function () {
       console.log("warning!!!!!!!");
     };
     this.socket.onopen = function () {
       console.log("success!!!!!!!");
     };
   }
   dealData(event){
       var message = JSON.parse(event.data);
       console.log(event.data);
        switch (message.message) {
          case 'register':
           if (message.ok) {
             this.register_state=true;
             this.getRS.next(this.register_state);
            }else{
              this.register_state=false;
              this.getRS.next(this.register_state);
            }
            break;
         case 'login':
           if (message.ok) {
             this.login_state=true;
             this.getLS.next(this.register_state);
           }else{
             this.login_state=false;
             this.getLS.next(this.register_state);
           }
           break;
         case 'join random success':
           break;
         case 'room information':

           break;
          //被邀请玩家收到消息
         case 'invatation':
           var content = message.object;
           this.inviation[0]=content.banker;
           this.inviation[1]=content.username1;
           this.inviation[2]=content.username2;
           this.inviation[3]=content.username3;
           this.inviation[4]=content.room;
           this.get_invitation.next(this.inviation);
           break;
         case 'invite success':
           this.room_number=message.object;
           this.get_room_number.next(this.room_number);
           break;
          case "game start":
            this.game_start=true;
            this.get_game_start.next(this.game_start);
          case "game start allocate":

         case 'gettile':
           break;
         case 'outtile':
           break;
         case 'bump':
           break;
         case 'eat':
           break;
         case 'bump_request':
           break;
         case 'eat_request':
           break;
         case 'win':
           break;
       }
   }
   sendMessage(message: string):void {
     if(!this.socket){
       this.create();
     }
     this.socket.send(message);
   }
   sendEatBumpMessage(message:Tile[]):void {
     this.eat_bump_tiles=message;
   }



}
