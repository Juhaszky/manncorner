import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModifiedItemData } from '../models/modifiedItem.model';
import { ItemSelectorService } from '../item-selector.service';
import { ItemEditorComponent } from '../item-editor/item-editor.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';


@Injectable({ providedIn: 'root' })
export class ItemSelectorFacade {
  private _items = new BehaviorSubject<ModifiedItemData[]>([]);
  private _itemsToTrade = new BehaviorSubject<ModifiedItemData[]>([]);
  private _itemsForTrade = new BehaviorSubject<ModifiedItemData[]>([]);

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
    this.itemService.fetchAllItems().subscribe((items) => {
      this._itemsForTrade.next(items);
    })
  }
  onOpenItemEditor() {
    this.dialogRef = this.dialogService.open(ItemEditorComponent, {
      header: 'Select a Product',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
    });

    this.dialogRef?.onClose.subscribe((selectedItems: ModifiedItemData[]) => {
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
  onAddItem(item: ModifiedItemData) {
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
  onRemoveItem(item: ModifiedItemData) {
    this._itemsToTrade.next(
      this._itemsToTrade.getValue().filter(i => i.idx !== item.idx)
    );
  }
}
