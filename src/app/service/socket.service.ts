import { Injectable } from '@angular/core';
import { Tile } from '../object/tile';
import { User} from '../object/user';
import { Player} from '../object/player';
import {Subject} from 'rxjs';
import {Message} from "../object/message";
import {nextTick} from "q";
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

  turn: number; //当前出牌者，最后一个牌是谁出的，是已经出完的
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
  new_tile: Tile=null;
  get_new_tile: Subject<Tile> = new Subject<Tile>();
  //此句是否结束
  is_finished: boolean = false;
  get_is_finished: Subject<boolean> =new Subject<boolean>();

  //聊天消息
  latest_message:Message[]=[];
  get_latest_message:Subject<Message[]> = new Subject<Message[]>();

  //4个boolean
  last_is_bottom:boolean = false;
  last_is_top:boolean = false;
  last_is_left:boolean = false;
  last_is_right:boolean = false;
  get_last_is_bottom:Subject<boolean> = new Subject<boolean>();
  get_last_is_top:Subject<boolean> = new Subject<boolean>();
  get_last_is_left:Subject<boolean> = new Subject<boolean>();
  get_last_is_right:Subject<boolean> = new Subject<boolean>();


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
           if(global.players[i].name==global.user.name)
           {
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
         break;
       case "game start allocate":
         var content = message.object;
         global.uuid=content.ownIndex;
         global.bottom_tile[0]=(<Tile[]>content.ownTiles);
         for(var i=0;i<13;i++){
           global.top_tile[0].push(null);
           global.left_tile[0].push(null);
           global.right_tile[0].push(null);
         }
         //判断谁是庄家多发张牌
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
         //第一次发牌设置next_turn
         global.next_turn=0;
         global.get_next_turn.next(global.next_turn);
         global.get_rest.next(global.rest);
         break;
       //我抓到一张牌
       case 'get tile':
         //并不改变原来手中的牌
         global.new_tile=<Tile>message.object;
         global.get_new_tile.next(global.new_tile);
         global.rest--;
         global.get_rest.next(global.rest);
         //global.getTile_Bottom.next(global.bottom_tile);
         //目前该我出牌了
         global.next_turn = global.uuid;
         console.log("，目前该出牌的人是我");
         global.get_next_turn.next(global.next_turn);
         break;
       //别人抓了一张牌
       case 'allocate tile':
         var temp = message.object.gameid-global.uuid;
         global.next_turn = message.object.gameid;
         console.log("目前"+message.object.gameid+"抓了一张牌该出牌了");
         global.get_next_turn.next(global.next_turn);
         global.rest--;
         if(temp==1||temp==-3){
           global.right_tile[0].push(null);
           console.log("我下家手中有"+global.right_tile[0].length+"张牌");
           global.getTile_Right.next(global.right_tile);
         }else if(temp==-1||temp==3){
           global.left_tile[0].push(null);
           console.log("我上家手中有"+global.left_tile[0].length+"张牌");
           global.getTile_Left.next(global.left_tile);
         }else{
           global.top_tile[0].push(null);
           console.log("我对家手中有"+global.top_tile[0].length+"张牌");
           global.getTile_Top.next(global.top_tile);
         }
         global.get_rest.next(global.rest);
         break;
       //出牌成功
       case 'out success':
         if(message.ok){
           var is_new = (global.new_tile==global.out_tile);
           console.log("打出的牌是否为新牌："+is_new);
           //如果打出的不是新牌那么从原有的牌中找到打出的牌并除去
           if(!is_new){
           global.bottom_tile[0].splice(global.bottom_tile[0].indexOf(global.out_tile), 1);
           console.log("此时bottom_tile的数量（打出的牌不是新牌）："+global.bottom_tile[0].length);
           //如果此时新牌不是null放到原有的数组中
            if(global.new_tile!=null) {
             global.bottom_tile[0].push(global.new_tile);
              console.log("此时bottom_tile的数量（打出的牌不是新牌且新牌不是null）："+global.bottom_tile[0].length);
           }
           }
           global.last_is_bottom=true;
           global.last_is_left=false;
           global.last_is_right=false;
           global.last_is_top=false;
           global.get_last_is_bottom.next(global.last_is_bottom);
           global.get_last_is_left.next(global.last_is_left);
           global.get_last_is_right.next(global.last_is_right);
           global.get_last_is_top.next(global.last_is_top);
            //将新的bottom，turn,当前牌推送出去，新牌（null）推送出去
           global.bottom_tile[2].push(global.out_tile);
           global.getTile_Bottom.next(global.bottom_tile);
           global.new_tile=null;
           global.get_new_tile.next(global.new_tile);
           global.turn = global.uuid;
           global.current_tile = global.out_tile;
           global.get_turn.next(global.turn);
           global.get_current.next(global.current_tile);
         }
         break;
       //别人出牌
       case 'other out':
         var content = message.object;
         global.turn = content.gameid;
         global.current_tile = (<Tile> content.tile);
         global.get_turn.next(global.turn);
         global.get_current.next(global.current_tile);
         var temp = global.turn-global.uuid;
         if(temp==1||temp==-3){
           console.log("出牌的是你的下家");
           global.right_tile[0].pop();
           global.right_tile[2].push(global.current_tile);
           global.getTile_Right.next(global.right_tile);
           global.last_is_bottom=false;
           global.last_is_left=false;
           global.last_is_right=true;
           global.last_is_top=false;
         }else if(temp==-1||temp==3){
           console.log("出牌的是你的上家");
           global.left_tile[0].pop();
           global.left_tile[2].push(global.current_tile);
           global.getTile_Left.next(global.left_tile);
           global.last_is_bottom=false;
           global.last_is_left=true;
           global.last_is_right=false;
           global.last_is_top=false
         }else{
           console.log("出牌的是你的对家");
           global.top_tile[0].pop();
           global.top_tile[2].push(global.current_tile);
           global.getTile_Top.next(global.top_tile);
           global.last_is_bottom=false;
           global.last_is_left=false;
           global.last_is_right=false;
           global.last_is_top=true;
         }
         global.get_last_is_bottom.next(global.last_is_bottom);
         global.get_last_is_left.next(global.last_is_left);
         global.get_last_is_right.next(global.last_is_right);
         global.get_last_is_top.next(global.last_is_top);
         break;
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
         if(temp==1||temp==-3){
           console.log("下家打出去的牌的张数"+global.right_tile[2].length);
           //global.right_tile[2].splice(global.right_tile[2].indexOf(global.current_tile),1);
           global.right_tile[2].pop();
           console.log("下家打出去的牌被拿走后的张数"+global.right_tile[2].length);
           global.getTile_Right.next(global.right_tile);
         }else if(temp==-1||temp==3){
           console.log("上家打出去的牌的张数"+global.left_tile[2].length);
           global.left_tile[2].splice(global.left_tile[2].indexOf(global.current_tile),1);
           console.log("上家打出去的牌被拿走后的张数"+global.left_tile[2].length);
           global.getTile_Left.next(global.left_tile);
         }else if(temp==0){
           console.log("我打出去的牌的张数"+global.bottom_tile[2].length);
           global.bottom_tile[2].splice(global.bottom_tile[2].indexOf(global.current_tile),1);
           console.log("我打出去的牌的被拿走后张数"+global.bottom_tile[2].length);
           global.getTile_Bottom.next(global.bottom_tile);
         }else{
           console.log("对家打出去的牌的张数"+global.top_tile[2].length);
           global.top_tile[2].splice(global.top_tile[2].indexOf(global.current_tile),1);
           console.log("对家打出去的牌被拿走后的张数"+global.top_tile[2].length);
           global.getTile_Top.next(global.top_tile);

         }
         //判断碰牌的人位置去掉吃碰人手中的牌和并增加用过的牌
         var temp = <number>(content.gameid-global.uuid);
         global.next_turn = content.gameid;
         console.log("当前吃碰牌该出牌的人是"+global.next_turn);
         console.log("temp是"+temp);
         global.get_next_turn.next(global.next_turn);
         if(temp==1||temp==-3){
           global.right_tile[0].pop();
           global.right_tile[0].pop();
           console.log("下家吃碰后手中的牌的数量："+global.right_tile[0].length);
           global.right_tile[1]=global.right_tile[1].concat(<Tile[]>content.tile);
           console.log("下家吃碰牌后的展出牌的个数："+global.right_tile[1].length);
           global.getTile_Right.next(global.right_tile);
         }else if(temp==-1||temp==3){
           global.left_tile[0].pop();
           global.left_tile[0].pop();
           console.log("上家吃碰后手中的牌的数量："+global.left_tile[0].length);
           global.left_tile[1]=global.left_tile[1].concat(<Tile[]>content.tile);
           console.log("上家吃碰牌后的展出牌的个数："+global.left_tile[1].length);
           global.getTile_Left.next(global.left_tile);
         }else if(temp==0){
           global.bottom_tile[0].splice(global.bottom_tile[0].indexOf(global.eat_bump_tiles[0]),1);
           global.bottom_tile[0].splice(global.bottom_tile[0].indexOf(global.eat_bump_tiles[1]),1);
           console.log("我吃碰后手中的牌的数量："+global.bottom_tile[0].length);
           global.bottom_tile[1]=global.bottom_tile[1].concat(<Tile[]>content.tile);
           console.log("我吃碰牌后的展出牌的个数："+global.bottom_tile[1].length);
           global.getTile_Bottom.next(global.bottom_tile);
         }else{
           global.top_tile[0].pop();
           global.top_tile[0].pop();
           console.log("对家吃碰后手中的牌的数量："+global.top_tile[0].length);
           global.top_tile[1]=global.top_tile[1].concat(<Tile[]>content.tile);
           console.log("对家吃碰牌后的展出牌的个数："+global.top_tile[1].length);
           global.getTile_Top.next(global.top_tile);
         }
         global.last_is_bottom=false;
         global.last_is_left=false;
         global.last_is_right=false;
         global.last_is_top=false;
         global.get_last_is_bottom.next(global.last_is_bottom);
         global.get_last_is_left.next(global.last_is_left);
         global.get_last_is_right.next(global.last_is_right);
         global.get_last_is_top.next(global.last_is_top);
         break;
       case 'game end':
         var content = message.object;
         global.winner = <number>content.winnerIndex;
         global.get_winner.next(global.winner);
         global.win_tiles=<Tile[]>content.ownTiles;
         global.get_win_tiles.next(global.win_tiles);
         //向玩家推送游戏结束的消息
         global.is_finished=true;
         global.get_is_finished.next(global.is_finished);
         break;
       case 'speak':
         if(global.latest_message.length<6){
           global.latest_message.push(<Message>message.object);
         }else{
           global.latest_message.splice(0,1);
           console.log("信息数量："+global.latest_message.length);
           global.latest_message.push(<Message>message.object)
         }
         global.get_latest_message.next(global.latest_message);
         break;
       case  '':
         break;
     }
   }
    this.socket.onerror = function () {
      console.log("warning!!!!!!!");
    };
    this.socket.onopen = function () {
      console.log("success!!!!!!!");
    };
  }
  sendMessage(message: string):void {
    if(!this.socket){
      this.create();
    }
    this.socket.send(message);
  }
  sendEatBumpMessage(message:Tile[]):void {
   console.log("有人发出吃碰请求牌数"+message.length);
   this.eat_bump_tiles=message;
  }
  setOuttile(tile:Tile):void {
    this.out_tile=tile;
  }
  setWintile(tile:Tile):void {
    this.win_tile=tile;
  }



}
