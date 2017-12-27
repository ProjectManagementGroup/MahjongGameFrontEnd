import {Component, OnInit} from '@angular/core';
import {SocketService} from '../service/socket.service';
import {Player} from '../object/player';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit{
  private gameStart: boolean;
  private players: Array<Player> = [];

  constructor(private socketService: SocketService) {

  }
  ngOnInit(): void {
    this.socketService.get_game_start.subscribe(
      (gameStart)=>{
        this.gameStart = gameStart;
      }
    );
  }
}
