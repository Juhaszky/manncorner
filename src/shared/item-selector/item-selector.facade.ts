import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModifiedItemData } from '../models/modifiedItem.model';
import { ItemSelectorService } from '../item-selector.service';
import { ItemEditorComponent } from '../item-editor/item-editor.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable({ providedIn: 'root' })
export class ItemSelectorFacade {
  private _items = new BehaviorSubject<ModifiedItemData[][]>([]);
  private _itemsToTrade = new BehaviorSubject<ModifiedItemData[]>([]);
  private _itemsForTrade = new BehaviorSubject<ModifiedItemData[]>([]);

  private loadedPages = new Set<string>();

  private dialogRef?: DynamicDialogRef;
  items$ = this._items.asObservable();
  itemsToTrade$ = this._itemsToTrade.asObservable();
  itemsForTrade$ = this._itemsForTrade.asObservable();

  constructor(
    private itemService: ItemSelectorService,
    private dialogService: DialogService
  ) {}

  loadItemsLazy(first: number, rows: number, chunkSize = 7): void {
    const pageKey = `${first}-${rows}`;
    if (this.loadedPages.has(pageKey)) return;
    this.loadedPages.add(pageKey);
    this.itemService.fetchItems(first, rows).subscribe({
      next: fetchedItems => {
        const chunked = this.chunkItemsIntoRows(fetchedItems, chunkSize);
        const currentItems = this._items.getValue();
        this._items.next([...currentItems, ...chunked]);
      },
      error: err => console.error('Lazy loading failed', err),
    });
  }

  private chunkItemsIntoRows(
    items: ModifiedItemData[],
    chunkSize: number
  ): ModifiedItemData[][] {
    const result: ModifiedItemData[][] = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      result.push(items.slice(i, i + chunkSize));
    }
    return result;
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
}
