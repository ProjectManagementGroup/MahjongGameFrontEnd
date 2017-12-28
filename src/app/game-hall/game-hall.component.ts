import {Component, OnInit} from '@angular/core';
import {User} from '../object/user';
import {SocketService} from "../service/socket.service";
import { Router} from "@angular/router";
import {$} from "protractor";
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
  constructor(private socket:SocketService,private router:Router){
      this.user=socket.user;
  }
  ngOnInit(): void {
    this.socket.get_invitation.subscribe((val)=>{
      this.invatation = val;
      }
    );
    this.socket.get_room_number.subscribe((val)=>{
      this.room_number = val;
      $('#inviteModal').modal('hide');
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
}
