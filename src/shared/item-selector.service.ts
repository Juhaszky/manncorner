import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, first, map } from 'rxjs';
import { StockItem } from './models/stockItem.model';
import { ItemState } from './models/itemState.model';
import { ItemData } from './models/itemData.model';

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
    this.fetchAllItems().subscribe((items: StockItem[]) => {
      this.updateState({ allItems: items });
    });

    this.fetchItems().subscribe((items: ItemData[]) =>
      this.updateState({ inventoryItems: items, filteredInventoryItems: items })
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

  fetchItems(): Observable<ItemData[]> {
    return this.http
      .get<Observable<any>>('http://localhost:3000/alma')
      .pipe(map((data: any) => data));
  }

  fetchAllItems(): Observable<StockItem[]> {
    return this.http.get<StockItem[]>('http://localhost:3000/items/all-items');
  }

  moveItemToTrade(index: number) {
    const state = this.stateSubject.value;

    // Clone the current state arrays
    const inventoryItems = [...state.inventoryItems];
    const filteredInventoryItems = [...state.filteredInventoryItems];
    const toTradeItems = [...state.toTradeItems];

    // Find and remove the item from inventoryItems
    const itemToMove = filteredInventoryItems[index];
    const originalIndex = inventoryItems.findIndex(
      (item) => item.idx === itemToMove.idx
    );
    inventoryItems.splice(originalIndex, 1);
    // Remove the item from filteredInventoryItems
    filteredInventoryItems.splice(index, 1);

    // Add the item to toTradeItems
    toTradeItems.push(itemToMove);

    // Update the state with the modified arrays
    this.updateState({
      inventoryItems,
      filteredInventoryItems,
      toTradeItems,
    });
    this.updateFilteredItems(state.filterText);
  }

  moveItemToInventory(index: number) {
    const state = this.stateSubject.value;
    console.log(state.filterText);
    // Clone the current state arrays
    const inventoryItems = [...state.inventoryItems];
    const toTradeItems = [...state.toTradeItems];

    // Find and remove the item from toTradeItems
    const itemToMove = toTradeItems.splice(index, 1)[0];
    itemToMove.selected = false;
    console.log(itemToMove);

    // Insert the item back into inventoryItems at its original position
    inventoryItems.splice(itemToMove.idx, 0, itemToMove);

    // Update the state with the modified arrays
    this.updateState({
      inventoryItems,
      toTradeItems,
    });
  }
  moveItemToFilteredInventory(index: number) {
    const state = this.stateSubject.value;
    console.log(state.filterText);
    // Clone the current state arrays
    const filteredInventoryItems = [...state.filteredInventoryItems];
    const toTradeItems = [...state.toTradeItems];

    // Find and remove the item from toTradeItems
    const itemToMove = toTradeItems.splice(index, 1)[0];
    itemToMove.selected = false;
    console.log(itemToMove);

    // Insert the item back into inventoryItems at its original position
    filteredInventoryItems.splice(itemToMove.idx, 0, itemToMove);
    console.log(filteredInventoryItems);
    
    // Update the state with the modified arrays
    this.updateState({
      filteredInventoryItems,
      toTradeItems,
    });
  }

  filterItems(items: ItemData[], filterText: string): ItemData[] {
    return items.filter((item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }
  

  updateFilteredItems(filterText: string): void {
    const state = this.stateSubject.value;
    console.log(state);
    const filteredItems = state.inventoryItems.filter((item) =>
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
