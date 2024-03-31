import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemSelectorService {
  private inventoryItems: BehaviorSubject<any> = new BehaviorSubject([]);
  private itemsToTrade: BehaviorSubject<any> = new BehaviorSubject([]);
  private allTf2Items: BehaviorSubject<any> = new BehaviorSubject([]);
  private itemsForTrade: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private http: HttpClient) {
    this.fetchAllItems().subscribe((items: any[]) => {
      this.allTf2Items.next(items);
    });
    this.fetchItems().subscribe((items: any[]) =>
      this.inventoryItems.next(items)
    );
  }
  getAllItems(): BehaviorSubject<any> {
    return this.allTf2Items;
  }

  getInventoryItems() {
    return this.inventoryItems;
  }
  getItemsToTrade() {
    return this.itemsToTrade;
  }
  getItemsForTrade() {
    return this.itemsForTrade;
  }
  emptyItemsToTrade() {
    this.itemsToTrade.next([]);
  }
  emptyItemForTrade() {
    this.itemsForTrade.next([]);
  }

  fetchItems(): Observable<any> {
    return this.http.get<Observable<any>>('http://localhost:3000/alma').pipe(
      map((data: any) => {
        return data.descriptions;
      })
    );
  }
  fetchAllItems(): Observable<any> {
    return this.http.get<Observable<any>>(
      'http://localhost:3000/items/all-items'
    );
  }
  makeTrade(tradeData: any): Observable<any> {
    return this.http.post('http://localhost:3000/trades', tradeData);
  }

  moveItemToTrade(index: number) {
    const allItemsValue = this.inventoryItems.getValue();
    const itemToMove = allItemsValue.splice(index, 1)[0];
    console.log(itemToMove);
    itemToMove.lastIdx = index;
    this.inventoryItems.next(allItemsValue);

    const itemsToTradeValue = this.itemsToTrade.getValue();
    itemsToTradeValue.push(itemToMove);
    this.itemsToTrade.next(itemsToTradeValue);
  }

  moveItemToInventory(index: number) {
    const toItems = this.itemsToTrade.getValue();
    const item = toItems.splice(index, 1)[0];
    const items = this.inventoryItems.getValue();

    items.splice(item.lastIdx, 0, item);
    this.inventoryItems.next(items);
  }
  removeItemFrom(index: number) {
    const items = this.itemsForTrade.getValue();
    items.splice(index, 1);
    console.log(items);
  }
}
