import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { StockTF2Item } from './models/stockItem.model';
import { ItemState } from './models/itemState.model';
import { ItemData } from './models/itemData.model';
import { Item } from './models/item.model';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ItemSelectorService {
  private stateSubject: BehaviorSubject<ItemState> =
    new BehaviorSubject<ItemState>({
      inventoryItems: [],
      filteredInventoryItems: [],
      allItems: [],
      toTradeItems: [],
      forTradeItems: [],
      filterText: '',
    });
  itemState$ = this.stateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initalizeState();
  }
  private initalizeState(): void {
    // this.fetchAllItems().subscribe((items: StockItem[]) => {
    //   this.updateState({ allItems: items });
    // });

    // this.fetchItems(0,20).subscribe((items: ItemData[]) =>
    //   this.updateState({ inventoryItems: items, filteredInventoryItems: items })
    // );
  }
  updateState(partialState: Partial<ItemState>): void {
    this.stateSubject.next({
      ...this.stateSubject.value,
      ...partialState,
    });
  }

  getAllItems(): Observable<StockTF2Item[]> {
    return this.stateSubject.pipe(map(state => state.allItems));
  }

  getInventoryItems() {
    return this.stateSubject.pipe(map(state => state.inventoryItems));
  }

  getItemsToTrade() {
    return this.stateSubject.pipe(map(state => state.toTradeItems));
  }

  getItemsForTrade() {
    return this.stateSubject.pipe(map(state => state.forTradeItems));
  }

  emptyItemsToTrade(): void {
    this.updateState({ toTradeItems: [] });
  }
  emptyItemForTrade(): void {
    this.updateState({ forTradeItems: [] });
  }

  fetchItems(offset: number, limit: number, userId: string): Observable<Item[]> {
    return this.http.get<Item[]>(
      `${environment.API_URL}/items?offset=${offset}&limit=${limit}&userId=${userId}`
    ).pipe(
    catchError(error => {
      console.error('Error fetching items:', error);

      return throwError(() => new Error('Failed to load items from the server.'));
    })
  );
  }

  fetchAllItems(): Observable<any> {
    return this.http.get("/assets/items.json");
  }
  fetchAllDefaultItemsForSearch(offset: number): Observable<Item[]> {
    return this.http.get<Item[]>(`${environment.MICROSERVICE_URL}/items?offset=${offset}`);
  }
  
  filterItems(items: ItemData[], filterText: string): ItemData[] {
    return items.filter(item =>
      item.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }

  updateFilteredItems(filterText: string): void {
    const state = this.stateSubject.value;
    console.log(state);
    const filteredItems = state.inventoryItems.filter(item =>
      item.name.toLowerCase().includes(filterText.toLowerCase())
    );
    this.updateState({ filteredInventoryItems: filteredItems, filterText });
  }

  removeItemFrom(index: number) {
    const state = this.stateSubject.value;

    const items = state.forTradeItems.slice();
    items.splice(index, 1);
    this.updateState({ forTradeItems: items });
  }
}
