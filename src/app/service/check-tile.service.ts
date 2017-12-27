import { Injectable } from '@angular/core';
import { Tile } from '../object/tile';


@Injectable()
export class CheckTileService {
  constructor () {}

  private getTileNum(tile: Tile) : number{
    return tile.typeid * 10 + tile.value;
  }

  public checkBump(target: Tile, tiles: Array<Tile>): boolean {
    return this.isNumMoreThan(target, tiles, 2);
  }
  public checkRod(target: Tile, tiles: Array<Tile>): boolean {
    return this.isNumMoreThan(target, tiles, 3);
  }

  private isNumMoreThan(target: Tile, tiles: Array<Tile>, mixNum: number) {
    let num = 0;
    let size = tiles.length;
    for(let i = 0; i < size; i++) {
      if(this.getTileNum(target) == this.getTileNum(tiles[i])) {
        num++;
      }
    }
    if(num >= mixNum) {
      return true;
    }else {
      return false;
    }
  }

  public checkEat(target: Tile, tiles: Array<Tile>, eatTiles: Tile[]): boolean {
    return true;
    //return this.checkEatLRM(tiles, this.getTileNum(target) + 1, this.getTileNum(target) + 2) ||
      //this.checkEatLRM(tiles, this.getTileNum(target) - 1, this.getTileNum(target) + 1) ||
      //this.checkEatLRM(tiles, this.getTileNum(target) - 2, this.getTileNum(target) - 1);
  }

  private checkEatLRM(tiles: Array<Tile>, find1: number, find2: number, eatTiles: Tile[]): boolean {
    let size = tiles.length;
    let isfind1 = -1;
    let isfind2 = -1;
    for(let i = 0; i < size; i++) {
      if(this.getTileNum(tiles[i]) == find1) {
        isfind1 = i;
      }
      if(this.getTileNum(tiles[i]) == find2) {
        isfind2 = i;
      }
    }
    if((isfind1!= -1) && (isfind2 != -1)) {
      eatTiles[0] = tiles[isfind1];
      eatTiles[1] = tiles[isfind2];
    }
    return (isfind1!= -1) && (isfind2 != -1);
  }
  /*
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
    //newTiles.push({type: winTile.type, value: winTile.value});


  }
  */

}


