import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { ItemSelectorFacade } from '../../../shared/item-selector/item-selector.facade';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { SortService } from '../../../shared/sort.service';
import { ModifiedItemData } from '../../../shared/models/modifiedItem.model';
import { DialogModule } from 'primeng/dialog';
import { ItemEditorComponent } from '../../../shared/item-editor/item-editor.component';
import { ItemContainerComponent } from '../../../shared/item/item-container.component';
import { StockTF2Item } from '../../../shared/models/stockItem.model';
import { CommonModule } from '@angular/common';
import { Item } from '../../../shared/models/item.model';

@Component({
  selector: 'app-buy-item-panel',
  imports: [DialogModule, ItemEditorComponent, ItemContainerComponent, CommonModule],
  templateUrl: './buy-item-panel.component.html',
  styleUrl: './buy-item-panel.component.scss',
})
export class BuyItemPanelComponent implements  OnInit ,AfterViewInit {
  visible = false;
  @Input() mode!: 'inventory' | 'toTrade' | 'allItems';
  @Input() filter = '';
  @Output() itemAdd = new EventEmitter<Item>();
  @Output() itemRemove = new EventEmitter<Item>();
  @ViewChild('inventorySelector') inventorySelectorEl!: ElementRef;
  @Output() lazyLoadEmitter = new EventEmitter<{
    first: number;
    row: number;
  }>();
  @Input() allItems: Item[] = [];
  constructor(
    private sortService: SortService,
    private viewportRuler: ViewportRuler,
    public itemSelectorFacade: ItemSelectorFacade
  ) {}
  ngOnInit(): void {
    this.itemSelectorFacade.itemsForTrade$.subscribe((res) => {
      console.log(res);
      this.allItems = res;
    })
  }

  ngAfterViewInit(): void {
    fromEvent(this.inventorySelectorEl.nativeElement, 'scroll').subscribe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (event: any) => {
        const target = event.target;
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight;

        const threshold = 50;

        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

        if (distanceFromBottom <= threshold) {
          console.log('Almost on bottom');
          this.itemSelectorFacade.loadItemsLazy(
            this.itemSelectorFacade.itemsLength,
            0
          );
        }
      }
    );
  }
   onDialogClose() {
    console.log("close ran");
    this.visible = false;
    console.log(this.visible);
  }
  

  //this.loadItems();
  // this.sortService.sortCriteria$.subscribe(criteria => {
  //   //this.items = this.sortService.sortItems(this.items, criteria);
  //   if (this.filteredItems.length > 0) {
  //     //this.itemService.updateFilteredItems(criteria)
  //     //this.filteredItems = this.sortService.sortItems(this.filteredItems, criteria);
  //     this.itemService.updateState({
  //       filteredInventoryItems: this.filteredItems,
  //     });
  //   }
  // });

  getItemSize(): number {
    const width = this.viewportRuler.getViewportSize().width;
    return width >= 640 ? 96 : 80; // Matches `sm:h-24` (96px) and `h-20` (80px)
  }

  private loadItems(): void {
    // let itemObservable: Observable<ModifiedItemData[]>;
    // switch (this.mode) {
    //   case 'inventory':
    //     this.loading = true;
    //     itemObservable = this.loadInventoryItems();
    //     break;
    //   case 'allItems':
    //     itemObservable = this.itemService.getItemsForTrade();
    //     break;
    //   default:
    //     itemObservable = this.itemService.getItemsToTrade();
    // }
    // itemObservable.subscribe({
    //   next: (items: ModifiedItemData[]) => this.handleSuccess(items),
    //   error: err => this.handleError(err),
    // });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleSuccess(items: ModifiedItemData[]): void {
    //this.items = items;
    //this.chunkedItems = chunkItems(items, 7);
    //console.log(this.chunkedItems);
    // if (this.mode === 'inventory') {
    //   this.applyFilter();
    // }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trackByFn(index: number, item: any) {
    return item?.id || index; // Use unique ID if available
  }

  private handleError(err: string): void {
    console.error('Failed to load items:', err);
  }

  // private loadInventoryItems() {
  //   return this.itemService.itemState$.pipe(
  //     first(),
  //     switchMap(state =>
  //       state.inventoryItems.length !== 0
  //         ? of(state.filteredInventoryItems)
  //         : this.itemService.fetchItems(0, 50)
  //     ),
  //     tap(() => (this.loading = false))
  //   );
  // }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['items']);
    //if (this.mode !== 'inventory') return;
    //this.applyFilter();
    //this.chunkedItems = this.chunkItems([...this.items], 6); // Ensure stable reference
  }

  applyFilter(): void {
    // this.itemService.updateFilteredItems(this.filter);
    // this.itemService.itemState$.subscribe(state => {
    //   this.filter = state.filterText;
    //   this.filteredItems = state.filteredInventoryItems.filter(
    //     item => item.selected !== false
    //   );
    // });
  }

  onItemSelect(item: Item): void {
    this.itemAdd.emit(item);
    // console.log(idx);
    // if (this.mode === 'inventory') {
    //   let selectedItem: ModifiedItemData;
    //   if (this.filter === '') {
    //     this.items[idx].selected = true;
    //     selectedItem = this.items[idx];
    //   } else {
    //     console.log(idx);
    //     this.filteredItems[idx].selected = true;
    //     selectedItem = this.filteredItems[idx];
    //   }
    //   this.itemService.moveItemToTrade(idx);
    //   this.applyFilter();
    // }
  }

  onRemoveItem(idx: number) {
    console.log(idx);
    // this.itemService.itemState$.subscribe(state => {
    //   this.filter = state.filterText;
    // });
    // if (this.mode === 'toTrade') {
    //   console.log(this.filter);
    //   if (this.filter) {
    //     console.log('ran');
    //     this.itemService.moveItemToFilteredInventory(idx);
    //     this.itemService.itemState$.subscribe(s =>
    //       console.log(s.filteredInventoryItems)
    //     );
    //   } else {
    //     this.itemService.moveItemToInventory(idx);
    //   }
    // } else {
    //   this.itemService.removeItemFrom(idx);
    // }
    // this.applyFilter();
  }

  onOpenItemEditor() {
    this.visible = true;
    // let dialogRef = this.dialog.open(ItemEditorComponent, {
    //   height: '90vh',
    //   width: '95vw',
    // });
    // dialogRef.afterClosed().subscribe((selectedItems: ModifiedItemData[]) => {
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
    // });
  }
}
