import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, first, map } from 'rxjs';
import { StockItem } from './models/stockItem.model';
import { ItemState } from './models/itemState.model';

@Injectable({
  providedIn: 'root',
})
export class ItemSelectorService {
  private stateSubject: BehaviorSubject<ItemState> =
    new BehaviorSubject<ItemState>({
      inventoryItems: [],
      allItems: [],
      toTradeItems: [],
      forTradeItems: [],
    });
  itemState$ = this.stateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchAllItems().subscribe((items: any[]) => {
      this.updateState({ allItems: items });
    });

    this.fetchItems().subscribe((items: any[]) =>
      this.updateState({ inventoryItems: items })
    );
  }
  updateState(partialState: Partial<ItemState>): void {
    this.stateSubject.next({
      ...this.stateSubject.value,
      ...partialState,
    });
  }

  getAllItems(): Observable<StockItem[]> {
    return this.stateSubject.pipe(map((state) => state.allItems));
  }

  getInventoryItems() {
    return this.stateSubject.pipe(map((state) => state.inventoryItems));
  }

  getItemsToTrade() {
    return this.stateSubject.pipe(map((state) => state.toTradeItems));
  }

  getItemsForTrade() {
    return this.stateSubject.pipe(map((state) => state.forTradeItems));
  }

  emptyItemsToTrade(): void {
    this.updateState({ toTradeItems: [] });
  }
  emptyItemForTrade(): void {
    this.updateState({ forTradeItems: [] });
  }

  fetchItems(): Observable<any> {
    return this.http
      .get<Observable<any>>('http://localhost:3000/alma')
      .pipe(map((data: any) => data.descriptions));
  }

  fetchAllItems(): Observable<StockItem[]> {
    return this.http.get<StockItem[]>('http://localhost:3000/items/all-items');
  }

  moveItemToTrade(index: number) {
    this.itemState$.pipe(first()).subscribe((state) => {
      const inventoryItems = state.inventoryItems;
      const itemToMove = inventoryItems.splice(index, 1)[0];

      itemToMove.lastIndex = index;
      this.updateState({ inventoryItems: inventoryItems });

      const itemsToTrade = state.toTradeItems;
      this.updateState({ toTradeItems: [...itemsToTrade, itemToMove] });
    });
  }

  moveItemToInventory(index: number) {
    this.itemState$.pipe(first()).subscribe((state) => {
      const toItems = state.toTradeItems;
      const item = toItems.splice(index, 1)[0];
      const items = state.inventoryItems;
      items.splice(item.lastIndex, 0, item);

      this.updateState({ inventoryItems: items });
    });
  }

  removeItemFrom(index: number) {
    this.itemState$.pipe(first()).subscribe((state) => {
      const items = state.forTradeItems;
      items.splice(index, 1);
      this.updateState({ forTradeItems: items });
    });
  }
}
