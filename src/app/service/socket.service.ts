import { Injectable } from '@angular/core';
import { Tile } from '../object/tile';
import { User} from '../object/user';
import { Player} from '../object/player';
import {Subject} from 'rxjs';
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

  turn: number=0; //当前出牌者
  get_turn: Subject<number> = new Subject<number>();

  current_tile: Tile; //最后出的牌
  get_current: Subject<Tile> = new Subject<Tile>();

  rest: number=83; //剩下的牌
  get_rest: Subject<number> = new Subject<number>();

  user: User; //本人的user信息
  get_user: Subject<User> = new Subject<User>();

  //自己的index
  uuid: number;
  get_uuid: Subject<number> = new Subject<number>();
  //游戏是否开始
  game_start: boolean=false;
  get_game_start: Subject<boolean> = new Subject<boolean>();
  //发出吃碰请求的三张牌
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
        this.getTile_Bottom.next(this.bottom_tile);
        break;
      case 'allocate tile':
        var temp = message.object-this.uuid;
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
