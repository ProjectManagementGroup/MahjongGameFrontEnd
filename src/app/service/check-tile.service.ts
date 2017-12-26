import { Injectable } from '@angular/core';
import { Tile } from '../object/tile';
import { OrderTileService } from './order-tile.service';

@Injectable()
export class CheckTileService {
  constructor (private orderTileService: OrderTileService) {}

  // bump碰牌 eat吃牌 rod杠牌
  public checkBump(target: Tile, sameTypeTiles: Array<Tile>): boolean {
    return this.isNumMoreThan(target.value, sameTypeTiles, 2);
  }

  public checkRod(target: Tile, sameTypeTiles: Array<Tile>): boolean {
    return this.isNumMoreThan(target.value, sameTypeTiles, 3);
  }

  private isNumMoreThan(target: number, sameTypeTiles: Array<Tile>, mixNum: number) {
    let num = 0;
    let size = sameTypeTiles.length;
    for(let i = 0; i < size; i++) {
      if(target == sameTypeTiles[i].value) {
        num++;
      }
    }
    if(num >= mixNum) {
      return true;
    }else {
      return false;
    }
  }

  public checkEat(target: Tile, sameTypeTiles: Array<Tile>): boolean {
    return this.checkEatLRM(sameTypeTiles, target.value + 1, target.value + 2) ||
      this.checkEatLRM(sameTypeTiles, target.value - 1, target.value + 1) ||
      this.checkEatLRM(sameTypeTiles, target.value - 2, target.value - 1);
  }

  private checkEatLRM(sameTypeTiles: Array<Tile>, find1: number, find2: number): boolean {
    let size = sameTypeTiles.length;
    let isfind1 = false;
    let isfind2 = false;
    for(let i = 0; i < size; i++) {
      if(sameTypeTiles[i].value == find1) {
        isfind1 = true;
      }
      if(sameTypeTiles[i].value == find2) {
        isfind2 = true;
      }
    }
    return isfind1&&isfind2;
  }
  // 传手里有的牌 和 要和的那张牌
  public checkWin(usingTiles: Array<{ divider: string, oneTypeTiles: Array<Tile>, size: number }>, winTile: Tile) {
    let size = usingTiles.length;
    let newTiles: Array<Tile> = [];
    for(let i = 0; i < size; i++) {
      //newTiles.push({type: usingTiles[i].type, value: usingTiles[i].value});
    }
    newTiles.push({type: winTile.type, value: winTile.value});


  }


}


