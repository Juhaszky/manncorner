import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemSelectorService {
  private allItems: BehaviorSubject<any> = new BehaviorSubject([]);
  private itemsToTrade: BehaviorSubject<any> = new BehaviorSubject([]);
  constructor(private http: HttpClient) {
    this.fetchItems().subscribe((items: any[]) => this.allItems.next(items));
  }

  getInventoryItems() {
    return this.allItems.asObservable();
  }
  getItemsToTrade() {
    return this.itemsToTrade.asObservable();
  }

  fetchItems(): Observable<any> {
    return this.http.get<Observable<any>>('http://localhost:3000/alma').pipe(
      map((data: any) => {
        return data.descriptions;
      })
    );
  }

  moveItemToTrade(index: number) {
    const allItemsValue = this.allItems.getValue();
    const itemToMove = allItemsValue.splice(index, 1)[0];
    itemToMove.lastIdx = index;
    this.allItems.next(allItemsValue);

    const itemsToTradeValue = this.itemsToTrade.getValue();
    itemsToTradeValue.push(itemToMove);
    this.itemsToTrade.next(itemsToTradeValue);
  }

  moveItemToInventory(index: number) {
    const toItems = this.itemsToTrade.getValue();
    const item = toItems.splice(index, 1)[0];
    const items = this.allItems.getValue();

    items.splice(item.lastIdx, 0, item);
    this.allItems.next(items);
  }
}
