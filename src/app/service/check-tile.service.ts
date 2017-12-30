import { Injectable } from '@angular/core';
import { Tile } from '../object/tile';


@Injectable()
export class CheckTileService {
  constructor () {}

  private getTileNum(tile: Tile) : number{
    return tile.typeid * 10 + tile.value;
  }

  public checkBump(target: Tile, tiles: Array<Tile>, eatTiles: Tile[]): boolean {
    return this.isNumMoreThan(target, tiles, 2, eatTiles);
  }
  public checkRod(target: Tile, tiles: Array<Tile>, eatTiles: Tile[]): boolean {
    return this.isNumMoreThan(target, tiles, 3, eatTiles);
  }

  private isNumMoreThan(target: Tile, tiles: Array<Tile>, mixNum: number, eatTiles: Tile[]) {
    let num = 0;
    let size = tiles.length;
    for(let i = 0; i < size; i++) {
      if(this.getTileNum(target) == this.getTileNum(tiles[i])) {
        num++;
        eatTiles.push(tiles[i]);
      }
    }
    if(num >= mixNum) {
      return true;
    }else {
      return false;
    }
  }

  public checkEat(target: Tile, tiles: Array<Tile>, eatTiles: Tile[]): boolean {
    let targetTileNum = this.getTileNum(target);
    if(this.checkEatLRM(tiles, targetTileNum + 1, targetTileNum + 2, eatTiles)) {
      return true;
    }
    if(this.checkEatLRM(tiles, targetTileNum - 1, targetTileNum + 1, eatTiles)) {
      return true;
    }
    if(this.checkEatLRM(tiles, targetTileNum - 2, targetTileNum - 1, eatTiles)) {
      return true;
    }

    return false;
    //return true;
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

  private bubbleSortNum(nums: number[]): void{
    let size = nums.length;
    for (let i = 0; i < size; i++) {
      for (let j = i; j < size; j++) {
        if (nums[j] < nums[i]) {
          let tmp = nums[j];
          nums[j] = nums[i];
          nums[i] = tmp;
        }
      }
    }
  }
  private checkIsWin(tiles: number[], numof3: number): boolean{
    //给tiles数组排序
    this.bubbleSortNum(tiles);
    //初始化标志位
    let tag = [];
    for(let i=0;i<tiles.length;i++){
      tag.push(0);
    }

    let pairIndex = -1;
    let iswin = false;

    while(pairIndex<tiles.length){
      //清空标记位
      for(let i=0;i<tag.length;i++){
        tag[i]=0;
      }
      //找对
      let isFindPair = false;
      for(let b = pairIndex+1;b<tiles.length-1;b++){
        if(tiles[b]==tiles[b+1]){
          pairIndex = b+1;
          tag[b]=1;
          tag[b+1]=1;
          isFindPair = true;
          break;
        }
      }
      if(!isFindPair){
        break;
      }

      //看3333
      for(let i=0;i<numof3;i++){
        let firstUnTag = this.findFirstUnTag(tag);
        if(this.findKe(tiles, tag, firstUnTag)){
          continue;
        }else if(this.findShun(tiles, tag, firstUnTag)){
          continue;
        }else{
          break;
        }
      }

      if(this.findFirstUnTag(tag) == -1){
        iswin = true;
        break;
      }
    }
    return iswin;
  }

  public checkWinAtGameStart(using_tiles: Tile[]): boolean{
    //先判断牌数可不可以胡
    let numof3 = (using_tiles.length-2)/3;
    if((using_tiles.length-2)%3 !== 0){
      return false;
    }
    //初始化tiles数组
    let tiles = [];
    for(let i=0; i<using_tiles.length; i++){
      tiles.push(this.getTileNum(using_tiles[i]));
    }
    return this.checkIsWin(tiles, numof3);

  }

  public checkWin(using_tiles: Tile[], win_tile: Tile): boolean{
    //先判断牌数可不可以胡
    let numof3 = (using_tiles.length-1)/3;
    if((using_tiles.length-1)%3 !== 0){
      return false;
    }
    //初始化tiles数组
    let tiles = [];
    for(let i=0; i<using_tiles.length; i++){
      tiles.push(this.getTileNum(using_tiles[i]));
    }
    tiles.push(this.getTileNum(win_tile));
    return this.checkIsWin(tiles, numof3);
  }

  private findFirstUnTag(tag: number[]): number{
    for(let i=0;i<tag.length;i++){
      if(tag[i]==0){
        return i;
      }
    }
    return -1;
  }
  private findKe(tiles: number[], tag: number[], firstUnTag: number): boolean{
    let isFind = false;
    if(tiles[firstUnTag+1]==tiles[firstUnTag] && tiles[firstUnTag+2]==tiles[firstUnTag]){
      tag[firstUnTag]=1;
      tag[firstUnTag+1]=1;
      tag[firstUnTag+2]=1;
      isFind = true;
    }
    return isFind;
  }

  private findShun(tiles: number[], tag: number[], firstUnTag: number): boolean{
    let pointer = firstUnTag  + 1;
    let find1Index = -1;
    let find2Index = -1;
    for(let i=pointer;i<tiles.length;i++){
      if(tag[i] == 0){
        if(tiles[i] == (tiles[firstUnTag]+1)){
          pointer = i+1;
          find1Index = i;
          break;
        }
      }
    }

    for(let i=pointer;i<tiles.length;i++){
      if(tag[i] == 0){
        if(tiles[i] == (tiles[firstUnTag]+2)){
          find2Index = i;
          break;
        }
      }
    }

    if(find1Index !== -1 && find2Index !== -1){
      tag[firstUnTag] = 1;
      tag[find1Index] = 1;
      tag[find2Index] = 1;
      return true;
    }
    return false;
  }
  /*
  // bump碰牌 eat吃牌 rod杠牌
  public checkBump(rget: Tile, sameTypeTiles: Array<Tile>): boolean {
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


