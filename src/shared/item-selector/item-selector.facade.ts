import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemSelectorService } from '../item-selector.service';
import { Item } from '../models/item.model';
import { MessageService } from 'primeng/api';
import { ErrorMessage } from '../models/enums/error-message.enum';

@Injectable({ providedIn: 'root' })
export class ItemSelectorFacade {
  private _items = new BehaviorSubject<Item[]>([]);
  private _itemsToTrade = new BehaviorSubject<Item[]>([]);
  private _itemsForTrade = new BehaviorSubject<Item[]>([]);
  private _itemsEditToTrade = new BehaviorSubject<Item[]>([]);
  private _itemsEditForTrade = new BehaviorSubject<Item[]>([]);
  private _itemsSearchToTrade = new BehaviorSubject<Item[]>([]);
  private _itemsFavourite = new BehaviorSubject<Item[]>([]);
  private _itemsSearchForTrade = new BehaviorSubject<Item[]>([]);
  private _itemsOffer = new BehaviorSubject<Item[]>([]);
  private loadedPages = new Set<string>();
  private selectedItemIds = new Set<string>();
  private selectedEditItemIds = new Set<string>();
  private selectedSearchItemIds = new Set<string>();
  private selectedFavouriteItemIds = new Set<string>();
  private selectedOfferItemIds = new Set<string>();
  loading = false;
  items$ = this._items.asObservable();
  itemsLength = 0;
  itemsToTrade$ = this._itemsToTrade.asObservable();
  itemsForTrade$ = this._itemsForTrade.asObservable();
  itemsEditToTrade$ = this._itemsEditToTrade.asObservable();
  itemsEditForTrade$ = this._itemsEditForTrade.asObservable();
  itemsSearchForTrade$ = this._itemsSearchForTrade.asObservable();
  itemsSearchToTrade$ = this._itemsSearchToTrade.asObservable();
  itemsFavourite$ = this._itemsFavourite.asObservable();
  itemsOfferTrade$ = this._itemsOffer.asObservable();
  private _customIdCounter = 0;
  private _customEditIdCounter = 0;
  private _customSearchIdCounter = 0;
  constructor(
    private itemService: ItemSelectorService,
    private messageService: MessageService
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
  onAddItem(item: Item) {
    const currentItems = this._itemsToTrade.getValue();
    if (currentItems.length >= 10) {
      this.showMaxLimitMessage();
      return;
    }
    const exists = currentItems.some(existingItem =>
      this.deepEqual(existingItem, item)
    );

    if (!exists) {
      const itemWithCustomId = {
        ...item,
        customId: (++this._customEditIdCounter).toString(),
      };
      this._itemsToTrade.next([...currentItems, itemWithCustomId]);
      this.selectedItemIds.add(item.id);
    }
  }
  onAddEditItem(item: Item) {
    const currentItems = this._itemsEditToTrade.getValue();
    if (currentItems.length >= 10) {
      this.showMaxLimitMessage();
      return;
    } else {
      const exists = currentItems.some(existingItem =>
        this.deepEqual(existingItem, item)
      );

      if (!exists) {
        const itemWithCustomId = {
          ...item,
          customId: (++this._customEditIdCounter).toString(),
        };
        this._itemsEditToTrade.next([...currentItems, itemWithCustomId]);
        this.selectedEditItemIds.add(item.id);
      }
    }
  }
  onAddSearchItem(item: Item) {
    const currentItems = this._itemsSearchToTrade.getValue();
    if (currentItems.length >= 10) {
      this.showMaxLimitMessage();
      return;
    } else {
      const exists = currentItems.some(existingItem =>
        this.deepEqual(existingItem, item)
      );
      if (!exists) {
        const itemWithCustomId = {
          ...item,
          customId: ++this._customSearchIdCounter,
        };
        this._itemsSearchToTrade.next([...currentItems, itemWithCustomId]);
        this.selectedSearchItemIds.add(item.defindex.toString());
      }
    }
  }
  onAddFavouriteItem(item: Item) {
    const currentItems = this._itemsFavourite.getValue();
    if (currentItems.length >= 3) {
      this.showMaxLimitMessage();
      return;
    } else {
      const exists = currentItems.some(existingItem =>
        this.deepEqual(existingItem, item)
      );
      console.log(exists);
      if (!exists) {
        const itemWithCustomId = {
          ...item,
          customId: ++this._customSearchIdCounter,
        };
        this._itemsFavourite.next([...currentItems, itemWithCustomId]);
        this.selectedFavouriteItemIds.add(item.defindex.toString());
        console.log(this._itemsFavourite.getValue());
        console.log(this.selectedFavouriteItemIds);
      }
    }
  }
  onOfferItem(item: Item) {
    const currentItems = this._itemsOffer.getValue();
    if (currentItems.length >= 10) {
      this.showMaxLimitMessage();
      return;
    } else {
      const exists = currentItems.some(existingItem =>
        this.deepEqual(existingItem, item)
      );

      if (!exists) {
        const itemWithCustomId = { ...item, customId: ++this._customIdCounter };
        this._itemsOffer.next([...currentItems, itemWithCustomId]);
        this.selectedOfferItemIds.add(item.id);
      }
    }
  }

  onAddDefaultItem(items: Item[]) {
    //should empty all the time, to do not let user select always 10 items on the item-edior multiselect component
    this._itemsForTrade.next([]);
    const currentItems = this._itemsForTrade.getValue();
    const itemsWithCustomId = items.map(i => {
      return { ...i, id: (this._customEditIdCounter++).toString() };
    });
    this._itemsForTrade.next([...currentItems, ...itemsWithCustomId]);
  }
  onAddEditDefaultItem(items: Item[]) {
    const currentItems = this._itemsEditForTrade.getValue();

    const itemsWithCustomId = items.map(i => {
      return { ...i, id: (this._customEditIdCounter++).toString() };
    });
    console.log(itemsWithCustomId);
    this._itemsEditForTrade.next([...currentItems, ...itemsWithCustomId]);
  }
  onModifyEditDefaultItem(item: Item) {
    const currentItems = this._itemsEditForTrade.getValue();
    const itemToModifyIdx = currentItems.findIndex((i) => i.id === item.id);
    if (itemToModifyIdx > -1) {
      currentItems[itemToModifyIdx] = {...item};
      this._itemsEditForTrade.next([...currentItems])
    }
  }
  onAddSearchDefaultItem(items: Item[]) {
    const currentItems = this._itemsSearchForTrade.getValue();
    const itemsWithCustomId = items.map(i => {
      return { ...i, id: (this._customEditIdCounter++).toString() };
    });
    this._itemsSearchForTrade.next([...currentItems, ...itemsWithCustomId]);
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
  onRemoveBaseEditItem(item: Item) {
    const currentItems = this._itemsEditForTrade.getValue();
    const newItems = currentItems.filter(i => i.id !== item.id);
    this._itemsEditForTrade.next(newItems);
  }
  onRemoveSearchItem(item: Item) {
    const currentItems = this._itemsSearchToTrade.getValue();
    const newItems = currentItems.filter(i => i.name !== item.name);
    this.selectedSearchItemIds.delete(item.defindex.toString());
    this._itemsSearchToTrade.next(newItems);
  }
  onRemoveBaseSearchItem(item: Item) {
    const currentItems = this._itemsSearchForTrade.getValue();
    const newItems = currentItems.filter(i => i.id !== item.id);
    this._itemsSearchForTrade.next(newItems);
  }
  onRemoveFavouriteItem(item: Item) {
    const currentItems = this._itemsFavourite.getValue();
    const newItems = currentItems.filter(i => i.id !== item.id);
    this._itemsFavourite.next(newItems);
  }
  onRemoveOfferItem(item: Item) {
    const currentItems = this._itemsOffer.getValue();
    const newItems = currentItems.filter(i => i.id !== item.id);
    this.selectedOfferItemIds.delete(item.id);
    this._itemsOffer.next(newItems);
  }
  onRemoveBaseItem(item: Item) {
    const currentItems = this._itemsForTrade.getValue();
    const newItems = currentItems.filter(i => i.id !== item.id);
    this.selectedItemIds.delete(item.id);
    this._itemsForTrade.next(newItems);
  }
  emptyFavouriteItems() {
    this.selectedFavouriteItemIds.clear();
    this._itemsFavourite.next([]);
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
  emptySearchItems() {
    this.selectedSearchItemIds.clear();
    this._itemsSearchForTrade.next([]);
    this._itemsSearchToTrade.next([]);
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
  isSearchItemSelected(item: Item): boolean {
    return this.selectedSearchItemIds.has(item.defindex.toString());
  }
  isFavouriteItemSelected(item: Item): boolean {
    return this.selectedFavouriteItemIds.has(item.defindex.toString());
  }
  showMaxLimitMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: ErrorMessage.MAX_LIMIT_EACH_CATEGORY,
    });
  }
}
