import {Component, Input, OnDestroy, AfterViewInit} from '@angular/core';
import {Player} from '../object/player';
import {SocketService} from '../service/socket.service';

const PLAYERS: Player[] = [
  {name: 'name1', gameid: 0, point: 100, ready: true},
  {name: 'name2', gameid: 1, point: 100, ready: true},
  {name: 'name3', gameid: 2, point: 100, ready: true},
  {name: 'name4', gameid: 3, point: 100, ready: true}
];

const COUNTDOWN: number = 5;

@Component({
  selector: 'center-table',
  templateUrl: './center.component.html',
  styleUrls: [ './center.component.css' ]
})

export class CenterComponent implements AfterViewInit,OnDestroy{
  @Input() leftPlayer: Player;
  @Input() rightPlayer: Player;
  @Input() upPlayer: Player;
  @Input() bottomPlayer: Player;

  @Input() next_turn: number;//下一个要出牌的人
  private turn: number;
  // 定时器
  private timer;
  private countDown: number = COUNTDOWN;
  private startTimer: boolean = false;

  constructor(private socketService: SocketService) {
    // this.leftPlayer = PLAYERS[0];
    // this.upPlayer = PLAYERS[1];
    // this.rightPlayer = PLAYERS[2];
    // this.bottomPlayer = PLAYERS[3];
    // this.startTimer = true;
  }

  ngOnInit(): void {
    this.socketService.get_next_turn.subscribe(
      (next_turn)=>{
        this.next_turn = next_turn;
      }
    );
    this.socketService.get_turn.subscribe(
      (turn)=>{
        this.turn = turn;
        this.startTimer = true;
      }
    );
  }

  // 每一秒更新
  ngAfterViewInit() {
    this.timer = setInterval(() => {
      if (this.startTimer && this.countDown > 1) {
        this.countDown--;
      }else{
        this.startTimer = false;
        this.countDown = COUNTDOWN;
      }
    }, 1000);
  }

  // 销毁组件时清除定时器
  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
