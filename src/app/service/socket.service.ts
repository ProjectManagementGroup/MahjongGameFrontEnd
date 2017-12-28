import { Injectable } from '@angular/core';
import { Tile } from '../object/tile';
import { User} from '../object/user';
import { Player} from '../object/player';
import {Subject} from 'rxjs';
import {Message} from "../object/message";
@Injectable()
export class SocketService {
  //0 using_tile 1 used_tile 2  useless_tile
  top_tile: Tile[][]=[[],[],[]];
  getTile_Top: Subject<Tile[][]> = new Subject<Tile[][]>();
  left_tile: Tile[][]=[[],[],[]];
  getTile_Left: Subject<Tile[][]> = new Subject<Tile[][]>();
  right_tile:Tile[][]=[[],[],[]];
  getTile_Right: Subject<Tile[][]> = new Subject<Tile[][]>();
  bottom_tile: Tile[][]=[[],[],[]];
  getTile_Bottom: Subject<Tile[][]> = new Subject<Tile[][]>();

  turn: number=0; //当前出牌者，最后一个牌是谁出的，是已经出完的
  get_turn: Subject<number> = new Subject<number>();

  current_tile: Tile; //最后出的牌
  get_current: Subject<Tile> = new Subject<Tile>();

  rest: number=83; //剩下的牌数
  get_rest: Subject<number> = new Subject<number>();

  user: User; //本人的user信息
  get_user: Subject<User> = new Subject<User>();

  uuid: number;
  get_uuid: Subject<number> = new Subject<number>();
  //游戏是否开始
  game_start: boolean=false;
  //下一个出牌者
  next_turn:number=0;
  get_next_turn:Subject<number> = new Subject<number>();
  //自己的index
  get_game_start: Subject<boolean> = new Subject<boolean>();
  //发出吃碰请求的两张牌
  eat_bump_tiles: Tile[];
  players: Player[]=[]; //player列表
  get_players: Subject<Player[]> = new Subject<Player[]>();
  register_state:boolean=false;
  getRS:Subject<boolean> = new Subject<boolean>();
  login_state:boolean=false;
  getLS: Subject<boolean> = new Subject<boolean>();
  //被邀请信息
  inviation: string[]=[];
  get_invitation: Subject<string[]> = new Subject<string[]>();
  //成功邀请的房间号
  room_number: string;
  get_room_number: Subject<string> = new Subject<string>();
  wsUrl: string = 'wss://47.96.147.90:9000/game/ws';
  //socket: WebSocket = null;
  socket : WebSocket = new WebSocket(this.wsUrl);
  //自己将要出的牌
  out_tile: Tile;
  //自己胡的牌
  win_tile: Tile;
  //胡牌后积分推送
  result_point:number[]=[];
  get_result_point: Subject<number[]> = new Subject<number[]>();
  //胡牌的人
  winner: number;
  get_winner: Subject<number> = new Subject<number>();
  //胡的牌
  win_tiles: Tile[];
  get_win_tiles: Subject<Tile[]> = new Subject<Tile[]>();
  //新发的牌
  new_tile: Tile;
  get_new_tile: Subject<Tile> = new Subject<Tile>();
  //此句是否结束
  is_finished: boolean = false;
  get_is_finished: Subject<boolean> =new Subject<boolean>();

  //聊天消息
  latest_message:Message;
  get_latest_message:Subject<Message> = new Subject<Message>();
 public create():void {
    //this.socket = new WebSocket(this.wsUrl);
    let global = this;
    //this.socket.onmessage = this.dealData;
   this.socket.onmessage = function (event) {
     //global.getRS.next(true);
     var message = JSON.parse(event.data);
     console.log(event.data);
     switch (message.message) {
       case 'register':
         if (message.ok) {
           console.log("register success");
           global.register_state=true;
           //console.log("register_state:"+this.register_state);
           global.getRS.next(global.register_state);
         }else{
           global.register_state=false;
           global.getRS.next(global.register_state);
         }
         break;
       case 'login':
         if (message.ok) {
           global.login_state=true;
           global.user=<User>message.object;
           global.getLS.next(global.login_state);
           global.get_user.next(global.user);
         }else{
           global.login_state=false;
           global.getLS.next(global.login_state);
         }
         break;
       case 'join random success':
         break;
       case 'room information':
         var content= message.object;
         global.players = <Player[]>content.all;
         //global.players.push(<Player>content.me);
         global.get_players.next(global.players);
         //global.uuid=content.me.index;
         for(var i=0;i<global.players.length;i++){
           if(global.players[i].name==global.user.name){
             global.uuid=global.players[i].gameid;
           }
         }
         global.get_uuid.next(global.uuid);
         break;
       //被邀请玩家收到消息
       case 'invitation':
         var content = message.object;
         global.inviation.push(content.banker);
         global.inviation.push(content.name0);
         global.inviation.push(content.name1);
         global.inviation.push(content.name2);
         global.inviation.push(content.room);
         global.get_invitation.next(global.inviation);
         break;
       case 'invite success':
         global.room_number=message.object;
         global.players.push(<Player>{name:global.user.name,gameid:0,point:global.user.point,ready:false})
         global.get_room_number.next(global.room_number);
         break;
       case "game start":
         global.game_start=true;
         global.get_game_start.next(global.game_start);
       case "game start allocate":
         var content = message.object;
         global.uuid=content.ownIndex;
         global.bottom_tile[0]=(<Tile[]>content.ownTiles);
         for(var i=0;i<13;i++){
           global.top_tile[0].push(null);
           global.left_tile[0].push(null);
           global.right_tile[0].push(null);
         }
         //TODO:其他人牌数量
         if(global.uuid==0){
         }else if(global.uuid==1){
           global.left_tile[0].push(null);

         }else if(global.uuid==2){
           global.top_tile[0].push(null);
         }else{
           global.right_tile[0].push(null);
         }
         global.getTile_Left.next(global.left_tile);
         global.getTile_Bottom.next(global.bottom_tile);
         global.getTile_Right.next(global.right_tile);
         global.getTile_Top.next(global.top_tile);
         global.get_turn.next(global.turn);
         global.next_turn=0;
         global.get_next_turn.next(global.next_turn);
         global.get_rest.next(global.rest);
       case 'get tile':
         //TODO：发牌数据问题
         //global.bottom_tile[0].push(<Tile>message.object);
         global.new_tile=<Tile>message.object;
         global.get_new_tile.next(global.new_tile);
         global.rest--;
         global.get_rest.next(global.rest);
         //global.getTile_Bottom.next(global.bottom_tile);
         global.next_turn = global.uuid;
         global.get_next_turn.next(global.next_turn);
         break;
       case 'allocate tile':
         var temp = message.object-global.uuid;
         global.next_turn = message.object;
         global.get_next_turn.next(global.next_turn);
         global.rest--;
         if(temp==1){
           global.right_tile[0].push(null);
           global.getTile_Right.next(global.right_tile);
         }else if(temp==-1){
           global.left_tile[0].push(null);
           global.getTile_Left.next(global.left_tile);
         }else{
           global.top_tile[0].push(null);
           global.getTile_Top.next(global.top_tile);
         }
         global.get_rest.next(global.rest);
       case 'out success':
         if(message.ok){
           var is_new = (global.new_tile==global.out_tile);
           if(!is_new){
           global.bottom_tile[0].splice(global.bottom_tile[0].indexOf( global.out_tile ,1), 1);
           global.bottom_tile[0].push(global.new_tile);
           }
           global.new_tile=null;
           global.get_new_tile.next(global.new_tile);
           global.bottom_tile[2].push(global.out_tile);
           global.getTile_Bottom.next(global.bottom_tile);
           global.turn = global.uuid;
           global.current_tile = global.out_tile;
           global.get_turn.next(global.turn);
           global.get_current.next(global.current_tile);
         }
         break;
       case 'other out':
         var content = message.object;
         global.turn = content.index;
         global.current_tile = (<Tile> content.tile);
         global.get_turn.next(global.turn);
         global.get_current.next(global.current_tile);
         var temp = global.turn-global.uuid;
         if(temp==1){
           global.right_tile[2].push(global.current_tile);
           global.getTile_Right.next(global.right_tile);
         }else if(temp==-1){
           global.left_tile[0].push(global.current_tile);
           global.getTile_Left.next(global.left_tile);
         }else{
           global.top_tile[0].push(global.current_tile);
           global.getTile_Top.next(global.top_tile);
         }
       case 'bump request success':
         console.log("bump request success!!!!");
         break;
       case 'eat request success':
         console.log("eat request success!!!!");
         break;
       case 'cut success':
         var content = message.object;
         //判断最后出牌人的位置,去掉它无用的牌中的一张
         var temp = global.turn-global.uuid;
         if(temp==1){
           global.right_tile[2].splice(global.right_tile[2].indexOf(global.current_tile),1);
           global.getTile_Right.next(global.right_tile);
         }else if(temp==-1){
           global.left_tile[2].splice(global.left_tile[2].indexOf(global.current_tile),1);
           global.getTile_Left.next(global.right_tile);
         }else if(temp==0){
           global.bottom_tile[2].splice(global.bottom_tile[2].indexOf(global.current_tile),1);
           global.getTile_Bottom.next(global.right_tile);
         }else{
           global.top_tile[2].splice(global.top_tile[2].indexOf(global.current_tile),1);
           global.getTile_Top.next(global.right_tile);
         }
         //判断碰牌的人位置去掉吃碰人手中的牌和并增加用过的牌
         temp = content.index-global.uuid;
         global.next_turn = content.index;
         global.get_next_turn.next(global.next_turn);
         if(temp==1){
           global.right_tile[0].splice(global.right_tile[0].indexOf(global.eat_bump_tiles[0]),1);
           global.right_tile[0].splice(global.right_tile[0].indexOf(global.eat_bump_tiles[1]),1);
           global.right_tile[1]=global.right_tile[1].concat(global.eat_bump_tiles);
           global.getTile_Right.next(global.right_tile);
         }else if(temp==-1){
           global.left_tile[0].splice(global.left_tile[0].indexOf(global.eat_bump_tiles[0]),1);
           global.left_tile[0].splice(global.left_tile[0].indexOf(global.eat_bump_tiles[1]),1);
           global.left_tile[1]=global.left_tile[1].concat(global.eat_bump_tiles);
           global.getTile_Left.next(global.left_tile);
         }else if(temp==0){
           global.bottom_tile[0].splice(global.bottom_tile[0].indexOf(global.eat_bump_tiles[0]),1);
           global.bottom_tile[0].splice(global.bottom_tile[0].indexOf(global.eat_bump_tiles[1]),1);
           global.bottom_tile[1]=global.bottom_tile[1].concat(global.eat_bump_tiles);
           global.getTile_Bottom.next(global.bottom_tile);
         }else{
           global.top_tile[0].splice(global.top_tile[0].indexOf(global.eat_bump_tiles[0]),1);
           global.top_tile[0].splice(global.top_tile[0].indexOf(global.eat_bump_tiles[1]),1);
           global.top_tile[1]=global.top_tile[1].concat(global.eat_bump_tiles);
           global.getTile_Top.next(global.top_tile);
         }
         break;;
       case 'game end':
         var content = message.object;
         global.winner = <number>content.winnerIndex;
         global.get_winner.next(global.winner);
         global.win_tiles=<Tile[]>content.all[global.winner].ownTiles;
         global.get_win_tiles.next(global.win_tiles);
         for (var i=0 ; i<4;i++){
           global.result_point.push(<number>content.all[i].point);
         }
         global.get_result_point.next(global.result_point);
         global.is_finished=true;
         global.get_is_finished.next(global.is_finished);
         break;
       case 'speak':
         global.latest_message=<Message>message.object;
         global.get_latest_message.next(global.latest_message);
     }
   }
    //this.getRS.next(true);
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
          console.log("register success");
          this.register_state=true;
          //console.log("register_state:"+this.register_state);
          //this.getRS.next(this.register_state);
        }else{
          this.register_state=false;
          this.getRS.next(this.register_state);
        }
        break;
      case 'login':
        if (message.ok) {
          this.login_state=true;
          this.user=<User>message.object;
          this.getLS.next(this.register_state);
          this.get_user.next(this.user);
        }else{
          this.login_state=false;
          this.getLS.next(this.register_state);
        }
        break;
      case 'join random success':
        break;
      case 'room information':
        var content= message.object;
        this.players = <Player[]>content.others;
        this.players.push(<Player>content.me);
        this.get_players.next(this.players);
        this.uuid=content.me.index;
        this.get_uuid.next(this.uuid);
        break;
      //被邀请玩家收到消息
      case 'invatation':
        var content = message.object;
        this.inviation[0]=content.banker;
        this.inviation[1]=content.name1;
        this.inviation[2]=content.name2;
        this.inviation[3]=content.name3;
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
        var content = message.object;
        this.uuid=content.ownIndex;
        this.bottom_tile[0]=(<Tile[]>content.ownTiles);
        for(var i=0;i<13;i++){
          this.top_tile[0].push(null);
          this.left_tile[0].push(null);
          this.right_tile[0].push(null);
        }
        //TODO:其他人牌数量
        if(this.uuid==0){
        }else if(this.uuid==1){
          this.left_tile[0].push(null);

        }else if(this.uuid==2){
          this.top_tile[0].push(null);
        }else{
          this.right_tile[0].push(null);
        }
        this.getTile_Left.next(this.left_tile);
        this.getTile_Bottom.next(this.bottom_tile);
        this.getTile_Right.next(this.right_tile);
        this.getTile_Top.next(this.top_tile);
        this.get_turn.next(this.turn);
        this.get_rest.next(this.rest);
      case 'get tile':
        //TODO：发牌数据问题
        this.bottom_tile[0].push(<Tile>message.object);
        this.rest--;
        this.get_rest.next(this.rest);
        this.getTile_Bottom.next(this.bottom_tile);
        break;
      case 'allocate tile':
        var temp = message.object-this.uuid;
        this.rest--;
        if(temp==1){
          this.right_tile[0].push(null);
          this.getTile_Right.next(this.right_tile);
        }else if(temp==-1){
          this.left_tile[0].push(null);
          this.getTile_Left.next(this.left_tile);
        }else{
          this.top_tile[0].push(null);
          this.getTile_Top.next(this.top_tile);
        }
        this.get_rest.next(this.rest);
      case 'out success':
        if(message.ok){
          this.bottom_tile[0].splice(this.bottom_tile[0].indexOf( this.out_tile ), 1);
          this.bottom_tile[2].push(this.out_tile);
          this.getTile_Bottom.next(this.bottom_tile);
          this.turn = this.uuid;
          this.current_tile = this.out_tile;
          this.get_turn.next(this.turn);
          this.get_current.next(this.current_tile);
        }
        break;
      case 'other out':
        var content = message.object;
        this.turn = content.index;
        this.current_tile = (<Tile> content.tile);
        this.get_turn.next(this.turn);
        this.get_current.next(this.current_tile);
        var temp = this.turn-this.uuid;
        if(temp==1){
          this.right_tile[2].push(this.current_tile);
          this.getTile_Right.next(this.right_tile);
        }else if(temp==-1){
          this.left_tile[0].push(this.current_tile);
          this.getTile_Left.next(this.left_tile);
        }else{
          this.top_tile[0].push(this.current_tile);
          this.getTile_Top.next(this.top_tile);
        }
      case 'bump request success':
        console.log("bump request success!!!!");
        break;
      case 'eat request success':
        console.log("eat request success!!!!");
        break;
      case 'cut success':
        var content = message.object;
        //判断最后出牌人的位置,去掉它无用的牌中的一张
        var temp = this.turn-this.uuid;
        if(temp==1){
          this.right_tile[2].splice(this.right_tile[2].indexOf(this.current_tile),1);
          this.getTile_Right.next(this.right_tile);
        }else if(temp==-1){
          this.left_tile[2].splice(this.left_tile[2].indexOf(this.current_tile),1);
          this.getTile_Left.next(this.right_tile);
        }else if(temp==0){
          this.bottom_tile[2].splice(this.bottom_tile[2].indexOf(this.current_tile),1);
          this.getTile_Bottom.next(this.right_tile);
        }else{
          this.top_tile[2].splice(this.top_tile[2].indexOf(this.current_tile),1);
          this.getTile_Top.next(this.right_tile);
        }
        //判断碰牌的人位置去掉吃碰人手中的牌和增加用过的牌
        temp = content.index-this.uuid;
        if(temp==1){
          this.right_tile[0].splice(this.right_tile[0].indexOf(this.eat_bump_tiles[0]),1);
          this.right_tile[0].splice(this.right_tile[0].indexOf(this.eat_bump_tiles[1]),1);
          this.right_tile[1]=this.right_tile[1].concat(this.eat_bump_tiles);
          this.getTile_Right.next(this.right_tile);
        }else if(temp==-1){
          this.left_tile[0].splice(this.left_tile[0].indexOf(this.eat_bump_tiles[0]),1);
          this.left_tile[0].splice(this.left_tile[0].indexOf(this.eat_bump_tiles[1]),1);
          this.left_tile[1]=this.left_tile[1].concat(this.eat_bump_tiles);
          this.getTile_Left.next(this.left_tile);
        }else if(temp==0){
          this.bottom_tile[0].splice(this.bottom_tile[0].indexOf(this.eat_bump_tiles[0]),1);
          this.bottom_tile[0].splice(this.bottom_tile[0].indexOf(this.eat_bump_tiles[1]),1);
          this.bottom_tile[1]=this.bottom_tile[1].concat(this.eat_bump_tiles);
          this.getTile_Bottom.next(this.bottom_tile);
        }else{
          this.top_tile[0].splice(this.top_tile[0].indexOf(this.eat_bump_tiles[0]),1);
          this.top_tile[0].splice(this.top_tile[0].indexOf(this.eat_bump_tiles[1]),1);
          this.top_tile[1]=this.top_tile[1].concat(this.eat_bump_tiles);
          this.getTile_Top.next(this.top_tile);
        }
        break;;
      case 'game end':
        var content = message.object;
        this.winner = <number>content.winnerIndex;
        this.get_winner.next(this.winner);
        this.win_tiles=<Tile[]>content.all[this.winner].ownTiles;
        this.get_win_tiles.next(this.win_tiles);
        for (var i=0 ; i<4;i++){
          this.result_point.push(<number>content.all[i].point);
        }
        this.get_result_point.next(this.result_point);
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
  setOuttile(tile:Tile):void {
    this.out_tile=tile;
  }
  setWintile(tile:Tile):void {
    this.win_tile=tile;
  }



}
