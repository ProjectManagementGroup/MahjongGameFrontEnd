import {Component, OnInit} from '@angular/core';
import {User} from '../object/user';
import {SocketService} from "../service/socket.service";
import { Router} from "@angular/router";


//
// const FRIENDS: Friend[] = [
//   {name:'wn',state:'在线'},
//   {name:'ymm',state:'在线'},
//   {name:'anyi',state:'在线'},
//   {name:'wxy',state:'在线'},
//   {name:'wangying',state:'在线'},
//   {name:'xh',state:'离线'},
// ];

// const USERS: User[] = [
//   {name:'wn',point:1000},
//   {name:'ymm',point:80},
//   {name:'anyi',point:780},
//   {name:'wxy',point:100},
//   {name:'wangying',point:105}
//   ];

@Component({
  selector: 'game-hall',
  templateUrl: './game-hall.component.html',
  styleUrls: [ './game-hall.component.css' ]
})

export class GameHallComponent implements OnInit{
  user:User;
  //被邀请信息
  invatation: string[]=null;
  //主动邀请信息
  room_number:  string=null;
  name1:string;
  name2:string;
  name3:string;
  visible:boolean=false;
  //被加好友邀请信息
  friendInvitation:string=null;
  private friends: string[]=[];//搜索的朋友信息
  //private users: User[]=[];//搜索的朋友信息
  //邀请的好友
  inviting_friend:string;
  constructor(private socket:SocketService,private router:Router){
      this.user=socket.user;
      this.friends=socket.friendsList;
      // this.users=USERS;
  }
  ngOnInit(): void {
    this.socket.get_invitation.subscribe((val)=>{
      this.invatation = val;
      }
    );
    this.socket.get_room_number.subscribe((val)=>{
      this.room_number = val;
      this.visible=false;
      this.router.navigate(['room']);
    });
    this.socket.get_friendList.subscribe((val)=>{
      this.friends=val;
    });
    this.socket.get_friendInvitation.subscribe((val)=>{
      this.friendInvitation=val;
    });

  }
  accept_invitation(): void {
    let message = 'accept|'+this.invatation[4];
    this.socket.sendMessage(message);
    this.router.navigate(['room']);
  }

  send_invitation(): void {
      let message='invite|'+ this.name1+'|'+this.name2+'|'+this.name3;

      this.socket.sendMessage(message);

  }
  create_room():void {
    this.visible=true;
  }
  send_friendinvitation() : void {
    var message = "friendInvitation|"+this.inviting_friend;
    this.socket.sendMessage(message);
  }

  accept_friendinvitation():void {
    var message = "friendAccept|"+this.friendInvitation;
  }
}
