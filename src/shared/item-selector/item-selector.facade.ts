import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemSelectorService } from '../item-selector.service';
import { Item } from '../models/item.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ItemSelectorFacade {
  private _items = new BehaviorSubject<Item[]>([]);
  private _itemsToTrade = new BehaviorSubject<Item[]>([]);
  private _itemsForTrade = new BehaviorSubject<Item[]>([]);
  private _itemsEditToTrade = new BehaviorSubject<Item[]>([]);
  private _itemsEditForTrade = new BehaviorSubject<Item[]>([]);
  private _itemsOffer = new BehaviorSubject<Item[]>([])
  private loadedPages = new Set<string>();
  private selectedItemIds = new Set<string>();
  private selectedEditItemIds = new Set<string>();
  private selectedOfferItemIds = new Set<string>();
  loading = false;
  items$ = this._items.asObservable();
  itemsLength = 0;
  itemsToTrade$ = this._itemsToTrade.asObservable();
  itemsForTrade$ = this._itemsForTrade.asObservable();
  itemsEditToTrade$ = this._itemsEditToTrade.asObservable();
  itemsEditForTrade$ = this._itemsEditForTrade.asObservable();
  itemsOfferTrade$ = this._itemsOffer.asObservable();
  private _customIdCounter = 0;
  constructor(
    private itemService: ItemSelectorService,
    private http: HttpClient
  ) {}
  private deepEqual(obj1: unknown, obj2: unknown): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
  loadItemsLazy(first: number, rows: number, steamid: string): void {
    this.loading = true;
    const pageKey = `${first}-${rows}`;
    if (this.loadedPages.has(pageKey)) {
      this.loading = false;
      return;
    }
    this.loadedPages.add(pageKey);
    this.itemService.fetchItems(first, rows, steamid).subscribe({
      next: fetchedItems => {
        const currentItems = this._items.getValue();
        this._items.next([...currentItems, ...fetchedItems]);
        this.itemsLength = this._items.getValue().length;
      },
      error: err => console.error('Lazy loading failed', err),
      complete: () => {
        this.loading = false;
      },
    });
  }

  loadAllItems() {
    this.itemService.fetchAllItems().subscribe(items => {
      this._itemsForTrade.next(items);
    });
  }

  onAddItem(item: Item) {
    const currentItems = this._itemsToTrade.getValue();
    const exists = currentItems.some(existingItem =>
      this.deepEqual(existingItem, item)
    );

    if (!exists) {
      const itemWithCustomId = { ...item, customId: ++this._customIdCounter };
      this._itemsToTrade.next([...currentItems, itemWithCustomId]);
      this.selectedItemIds.add(item.id);
    }
  }
  onAddEditItem(item: Item) {
    const currentItems = this._itemsEditToTrade.getValue();
    const exists = currentItems.some(existingItem =>
      this.deepEqual(existingItem, item)
    );

    if (!exists) {
      const itemWithCustomId = { ...item, customId: ++this._customIdCounter };
      this._itemsEditToTrade.next([...currentItems, itemWithCustomId]);
      this.selectedEditItemIds.add(item.id);
    }
  }
  onOfferItem(item: Item) {
    const currentItems = this._itemsOffer.getValue();
    const exists = currentItems.some(existingItem =>
      this.deepEqual(existingItem, item)
    );

    if (!exists) {
      const itemWithCustomId = { ...item, customId: ++this._customIdCounter };
      this._itemsOffer.next([...currentItems, itemWithCustomId]);
      this.selectedOfferItemIds.add(item.id);
    }
  }

  onAddDefaultItem(items: Item[]) {
    this._itemsForTrade.next(items);
  }
  onAddEditDefaultItem(items: Item[]) {
    this._itemsEditForTrade.next(items);
  }

  onRemoveItem(item: Item) {
    const currentItems = this._itemsToTrade.getValue();
    const newItems = currentItems.filter(i => i.id !== item.id);
    this.selectedItemIds.delete(item.id);
    this._itemsToTrade.next(newItems);
  }
  onRemoveEditItem(item: Item) {
    const currentItems = this._itemsEditToTrade.getValue();
    const newItems = currentItems.filter(i => i.id !== item.id);
    this.selectedEditItemIds.delete(item.id);
    this._itemsEditToTrade.next(newItems);
  }
  onRemoveOfferItem(item: Item) {
    const currentItems = this._itemsOffer.getValue();
    const newItems = currentItems.filter(i => i.id !== item.id);
    this.selectedOfferItemIds.delete(item.id);
    this._itemsOffer.next(newItems);
  }
  onRemoveBaseItem(item: Item) {
    const currentItems = this._itemsForTrade.getValue();
    const newItems = currentItems.filter(i => i.name !== item.name);
    this.selectedItemIds.delete(item.name);
    this._itemsForTrade.next(newItems);
  }
  emptyTradeItems() {
    this.selectedItemIds.clear();
    this._itemsForTrade.next([]);
    this._itemsToTrade.next([]);
  }
  emptyEditTradeItems() {
    this.selectedEditItemIds.clear();
    this._itemsEditForTrade.next([]);
    this._itemsEditToTrade.next([]);
  }
  emptyOfferItems() {
    this.selectedOfferItemIds.clear();
    this._itemsOffer.next([]);
  }

  isItemSelected(item: Item): boolean {
    return this.selectedItemIds.has(item.id);
  }
  isOfferItemSelected(item: Item): boolean {
    return this.selectedOfferItemIds.has(item.id);
  }
  isEditItemSelected(item: Item): boolean {
    return this.selectedEditItemIds.has(item.id);
  }
}
