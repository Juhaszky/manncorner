import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ItemSelectorService } from '../item-selector.service';
import { ScrollingModule, ViewportRuler } from '@angular/cdk/scrolling';
import { ItemComponent } from '../item/item.component';
import { ModifiedItemData } from '../models/modifiedItem.model';
import { SortService } from '../sort.service';
import { ScrollerModule } from 'primeng/scroller';
import { SkeletonModule } from 'primeng/skeleton';
import { ItemContainerComponent } from '../item/item-container.component';
import { ItemSelectorFacade } from './item-selector.facade';

@Component({
  standalone: true,
  selector: 'item-selector',
  imports: [
    ScrollerModule,
    CommonModule,
    ScrollingModule,
    ItemComponent,
    SkeletonModule,
    ItemContainerComponent,
  ],
  templateUrl: './item-selector.component.html',
  styleUrl: './item-selector.component.scss',
})
export class ItemSelectorComponent implements OnInit, OnChanges {
  @Input() mode!: 'inventory' | 'toTrade' | 'allItems';
  @Input() filter = '';
  @Output() itemAdd = new EventEmitter<ModifiedItemData>();
  @Output() lazyLoadEmitter = new EventEmitter<{first: number, row: number}>();
  @Input() items: ModifiedItemData[][] | ModifiedItemData[]= [];
  filteredItems: ModifiedItemData[] = [];
  loading = false;
  pageSize = 21;
  constructor(
    private itemService: ItemSelectorService,
    private sortService: SortService,
    private viewportRuler: ViewportRuler,
    public itemSelectorFacade: ItemSelectorFacade
  ) {}

  ngOnInit(): void {
    console.log(this.items);
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
  }

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

  private handleSuccess(items: ModifiedItemData[]): void {
    //this.items = items;
    //this.chunkedItems = chunkItems(items, 7);
    //console.log(this.chunkedItems);
    // if (this.mode === 'inventory') {
    //   this.applyFilter();
    // }
  }

  trackByFn(index: number, item: any) {
    return item?.id || index; // Use unique ID if available
  }

  private handleError(err: string): void {
    this.loading = false;
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

  onLazyLoad(event: any) {
    console.log(this.mode);
    if (this.mode === "inventory") this.itemSelectorFacade.loadItemsLazy(event.first, event.last);
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

  onItemSelect(item: ModifiedItemData): void {
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
