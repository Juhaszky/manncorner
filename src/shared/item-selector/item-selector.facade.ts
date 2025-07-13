import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModifiedItemData } from '../models/modifiedItem.model';
import { ItemSelectorService } from '../item-selector.service';
import { ItemEditorComponent } from '../item-editor/item-editor.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Item } from '../models/item.model';

@Injectable({ providedIn: 'root' })
export class ItemSelectorFacade {
  private _items = new BehaviorSubject<Item[]>([]);
  private _itemsToTrade = new BehaviorSubject<Item[]>([]);
  private _itemsForTrade = new BehaviorSubject<Item[]>([]);

  private loadedPages = new Set<string>();

  private dialogRef?: DynamicDialogRef;
  items$ = this._items.asObservable();
  itemsLength = 0;
  itemsToTrade$ = this._itemsToTrade.asObservable();
  itemsForTrade$ = this._itemsForTrade.asObservable();
  private _customIdCounter = 0;
  constructor(
    private itemService: ItemSelectorService,
    private dialogService: DialogService
  ) {}
  private deepEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
  loadItemsLazy(first: number, rows: number): void {
    const pageKey = `${first}-${rows}`;
    if (this.loadedPages.has(pageKey)) return;
    this.loadedPages.add(pageKey);
    this.itemService.fetchItems(first, rows).subscribe({
      next: fetchedItems => {
        const currentItems = this._items.getValue();
        this._items.next([...currentItems, ...fetchedItems]);
        this.itemsLength = this._items.getValue().length;
      },
      error: err => console.error('Lazy loading failed', err),
    });
  }
  loadAllItems() {
    this.itemService.fetchAllItems().subscribe(items => {
      this._itemsForTrade.next(items);
    });
  }
  onOpenItemEditor() {
    this.dialogRef = this.dialogService.open(ItemEditorComponent, {
      header: 'Select a Product',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
    });

    this.dialogRef?.onClose.subscribe((selectedItems: Item[]) => {
      //   if (selectedItems) {
      //     this.itemService.itemState$
      //       .pipe(
      //         first(),
      //         map((state) => state.forTradeItems)
      //       )
      //       .subscribe((forTradeItems) => {
      //         const updatedItems = [...forTradeItems, ...selectedItems];
      //         this.itemService.updateState({ forTradeItems: updatedItems });
      //       });
      //   }
    });
  }

  resetItems(): void {
    this._items.next([]);
  }
  onAddItem(item: Item) {
    const currentItems = this._itemsToTrade.getValue();
    const exists = currentItems.some(existingItem =>
      this.deepEqual(existingItem, item)
    );

    if (!exists) {
      const itemWithCustomId = { ...item, customId: ++this._customIdCounter };
      this._itemsToTrade.next([...currentItems, itemWithCustomId]);
      console.log('added', this._itemsToTrade.getValue());
    }
  }
  onAddDefaultItem(items: Item[]) {
    this._itemsForTrade.next(items);
    console.log("added", this._itemsForTrade.value);
  }
  onRemoveItem(item: Item) {
    const currentItems = this._itemsToTrade.getValue();
    console.log("current items", currentItems);
    const newItems = currentItems.filter((i) => i.defindex !== item.defindex);
    console.log("newItems", newItems);
    this._itemsToTrade.next(newItems);
  }
}
