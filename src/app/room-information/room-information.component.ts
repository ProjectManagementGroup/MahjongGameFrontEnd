import { Component, OnInit } from '@angular/core';
import {Player} from '../object/player';
import {SocketService} from '../service/socket.service';
import {Router} from '@angular/router';

const PLAYERS: Player[] = [
  {name: 'name1', gameid: 0, point: 100, ready: true},
  {name: 'name2', gameid: 1, point: 100, ready: true},
  {name: 'name3', gameid: 2, point: 100, ready: false},
  {name: 'name4', gameid: 3, point: 100, ready: true}
];

@Component({
  selector: 'room-information',
  templateUrl: './room-information.component.html',
  styleUrls: [ './room-information.component.css' ]
})

export class RoomInformationComponent implements OnInit {
  private players: Array<Player> = [];
  private banker: Player;

  constructor(private socketService: SocketService, private router: Router) {
    if(this.socketService.players.length > 0) {
      this.players = this.socketService.players;
      this.banker = this.players[0];
    }

    //this.players = PLAYERS;
    //this.banker = {name: 'name1', gameid: 0, point: 100, ready: true};
  }

  ngOnInit(): void {
    this.socketService.get_players.subscribe(
      (players)=>{
        this.players = players;
        this.banker = this.players[0];

        if(this.players.length == 4) {
          this.router.navigate(['/table']);
        }
      }
    );
  }

  ready(): void {
    this.socketService.sendMessage("ready|");
  }
}
