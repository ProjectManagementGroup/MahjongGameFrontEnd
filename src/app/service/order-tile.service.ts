import { Injectable } from '@angular/core';
import { Tile } from '../object/tile';
@Injectable()
export class OrderTileService {
  /*
  // 第一次发牌的时候，需要对所有的牌进行排序
  public getOrderedAllTypeTile(tiles: Array<Tile>): Array<{ divider: string, oneTypeTiles: Array<Tile>, size: number }> {
    let allTypeTiles: Array<{ divider: string, oneTypeTiles: Array<Tile>, size: number }> = [];
    this.initAllTypeTiles(allTypeTiles);
    this.divideTile(tiles, allTypeTiles);
    for (let i = 0; i < 5; i++) {
      this.bubbleSortOneTypeTile(allTypeTiles[i].oneTypeTiles.length, allTypeTiles[i].oneTypeTiles);
    }
    return allTypeTiles;
  }
  */

  private getTileNum(tile: Tile) : number{
    return tile.typeid * 10 + tile.value;
  }
  public bubbleSortTile(list: Array<Tile>) {
    let size = list.length;
    for (let i = 0; i < size; i++) {
      for (let j = i; j < size; j++) {
        if (this.getTileNum(list[j]) < this.getTileNum(list[i])) {
          let tmp = list[j];
          list[j] = list[i];
          list[i] = tmp;
        }
      }
    }
  }
  /*
  public bubbleSortOneTypeTile(size: number, list: Array<Tile>) {
    for (let i = 0; i < size; i++) {
      for (let j = i; j < size; j++) {
        if (list[j].value < list[i].value) {
          let tmp = list[j];
          list[j] = list[i];
          list[i] = tmp;
        }
      }
    }
  }

  // 根据条饼万中发白将牌分类
  private divideTile(originList, resultList) {
    let size = originList.length;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < 5; j++) {
        if (resultList[j].divider === originList[i].type) {
          resultList[j].oneTypeTiles.push(originList[i]);
          resultList[j].size++;
          break;
        }
      }
    }
  }

  private initAllTypeTiles(list) {
    let divider = ['bamboo', 'dot', 'myriad', 'wind', 'dragon'];
    for (let i = 0; i < 5; i++) {
      list.push({
        divider: divider[i],
        oneTypeTiles: [],
        size: 0
      });
    }
  }
  */
}
