import {Component, Input} from '@angular/core';
import {Player} from '../object/player';
import {SocketService} from '../service/socket.service';
/*
const PLAYERS: Player[] = [
  {name: 'name1', gameid: 0, point: 100, ready: true},
  {name: 'name2', gameid: 1, point: 100, ready: true},
  {name: 'name3', gameid: 2, point: 100, ready: true},
  {name: 'name4', gameid: 3, point: 100, ready: true}
];
*/
@Component({
  selector: 'center-table',
  templateUrl: './center.component.html',
  styleUrls: [ './center.component.css' ]
})

export class CenterComponent {
  @Input() leftPlayer: Player;
  @Input() rightPlayer: Player;
  @Input() upPlayer: Player;
  @Input() bottomPlayer: Player;

  private next_turn: number;//下一个要出牌的人

  private countDown: number = 7;

  constructor(private socketService: SocketService) {
    //this.leftPlayer = PLAYERS[0];
    //this.upPlayer = PLAYERS[1];
    //this.rightPlayer = PLAYERS[2];
    //this.bottomPlayer = PLAYERS[3];
    //this.countDown = 7;
  }

  ngOnInit(): void {
    this.socketService.get_next_turn.subscribe(
      (next_turn)=>{
        this.next_turn = next_turn;
      }
    );
  }
}
