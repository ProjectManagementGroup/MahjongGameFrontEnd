import {Component, OnInit} from '@angular/core';
import {SocketService} from "../service/socket.service";
import {Router} from "@angular/router";

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})

export class RegisterComponent implements OnInit{

  username:string;
  password:string;
  register_state:boolean = false;

  constructor(private socket: SocketService,private router:Router){
  }
  ngOnInit(): void {
    this.socket.getRS.subscribe((val)=>{
      this.register_state=val;
      if(this.register_state){
        this.router.navigate(['/login']);
      }
    });
  }
  register(): void {
    let message = 'register|'+this.username+'|'+this.password;
    this.socket.sendMessage(message);
  }
}
