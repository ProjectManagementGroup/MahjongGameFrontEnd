import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../service/socket.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css']
})

export class LoginComponent {
  private username: string;
  private password: string;
  private login_state: boolean = null;

  constructor(private socketService: SocketService, private router: Router) {
  }

  login(): void{
    if(this.username!="" && this.password!="") {
      let message = "login|" + this.username + "|" + this.password;
      this.socketService.sendMessage(message);
      this.socketService.getLS.subscribe(
        (login_state)=>{
          this.login_state=login_state;
          if(this.login_state) {
            this.router.navigate(['/register']);
          }else {
            //提示输入错误
          }
        }
      );
    }
    else{
      console.log("username或password不能为空");
    }

  }
}
