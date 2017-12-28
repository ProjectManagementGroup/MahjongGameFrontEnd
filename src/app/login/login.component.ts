import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../service/socket.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css']
})

export class LoginComponent implements OnInit{
  private username: string;
  private password: string;
  private login_state: boolean = null;

  constructor(private socket: SocketService, private router: Router) {
  }

  ngOnInit(): void {
    this.socket.create();
    this.socket.getLS.subscribe((val)=>{
      this.login_state=val;
      if(this.login_state){
        this.router.navigate(['/gameHall']);
      }
    });
  }

  login(): void{
    if(this.username!="" && this.password!="") {
      let message = "login|" + this.username + "|" + this.password;
      this.socket.sendMessage(message);
    }
    else{
      console.log("username或password不能为空");
    }
  }

  register(): void{
    this.router.navigate(['/register']);
  }
}
