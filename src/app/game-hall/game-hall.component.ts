import {Component, OnInit} from '@angular/core';
import {User} from '../object/user';
import {Friend} from '../object/friend';
import {SocketService} from "../service/socket.service";
import { Router} from "@angular/router";
import {$} from "protractor";


const FRIENDS: Friend[] = [
  {name:'wn',state:'在线'},
  {name:'ymm',state:'在线'},
  {name:'yay',state:'离线'},
  {name:'wxy',state:'在线'},
  {name:'xm',state:'在线'},
  {name:'xh',state:'在线'},
];

const USERS: User[] = [
  {name:'wn',point:1000},
  {name:'ymm',point:80},
  {name:'yay',point:780},
  {name:'wxy',point:100},
  {name:'xm',point:105},
  {name:'xh',point:100},
];

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

  private friends: Friend[]=[];//搜索的朋友信息
  private users: User[]=[];//搜索的朋友信息

  constructor(private socket:SocketService,private router:Router){
      this.user=socket.user;
      this.friends=FRIENDS;
      this.users=USERS;
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
}
