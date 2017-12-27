import { Component } from '@angular/core';
import { SocketService } from '../service/socket.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css']
})

export class LoginComponent {
  private username: string;
  private password: string;
  private login_state:boolean=null;

  constructor(private socketService: SocketService) {
  }

  login(){
    if(this.username!="" && this.password!="") {
      let message = "login|" + this.username + "|" + this.password;
      this.socketService.sendMessage(message);
      this.socketService.getLS.subscribe(
        (login_state)=>{
          this.login_state=login_state;
          if(this.login_state) {

          }else {

          }
        }
      );
    }
    else{
      console.log("username或password不能为空");
    }

  }
}
