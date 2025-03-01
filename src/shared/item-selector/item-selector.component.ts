import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ItemSelectorService } from '../item-selector.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ItemEditorComponent } from '../item-editor/item-editor.component';
import { first, map, Observable, of, switchMap, tap } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ItemComponent } from '../item/item.component';
import { ModifiedItemData } from '../models/modifiedItem.model';
import { SortService } from '../sort.service';

@Component({
    selector: 'item-selector',
    imports: [
        MatTooltipModule,
        CommonModule,
        MatProgressSpinnerModule,
        ScrollingModule,
        ItemComponent,
    ],
    templateUrl: './item-selector.component.html',
    styleUrl: './item-selector.component.scss'
})
export class ItemSelectorComponent implements OnInit, OnChanges {
  @Input() mode!: 'inventory' | 'toTrade' | 'allItems';
  @Input() filter: string = '';

  items: ModifiedItemData[] = [];
  filteredItems: ModifiedItemData[] = [];
  loading = false;
  borderStyle: 'unusual' | 'strange' | 'vintage' | 'elite' | 'unique' =
    'unique';

  constructor(
    private itemService: ItemSelectorService,
    private sortService: SortService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadItems();
    this.sortService.sortCriteria$.subscribe((criteria) => {
      //this.items = this.sortService.sortItems(this.items, criteria);
      if (this.filteredItems.length > 0) {
        
        //this.itemService.updateFilteredItems(criteria)
        //this.filteredItems = this.sortService.sortItems(this.filteredItems, criteria);
        this.itemService.updateState({filteredInventoryItems: this.filteredItems})
      }
    });
  }

  private loadItems(): void {
    let itemObservable: Observable<ModifiedItemData[]>;
    switch (this.mode) {
      case 'inventory':
        this.loading = true;
        itemObservable = this.loadInventoryItems();
        break;
      case 'allItems':
        itemObservable = this.itemService.getItemsForTrade();
        break;
      default:
        itemObservable = this.itemService.getItemsToTrade();
    }

    itemObservable.subscribe({
      next: (items: ModifiedItemData[]) => this.handleSuccess(items),
      error: (err) => this.handleError(err),
    });
  }

  private handleSuccess(items: ModifiedItemData[]): void {
    this.items = items;
    if (this.mode === 'inventory') {
      this.applyFilter();
    }
  }

  private handleError(err: string): void {
    this.loading = false;
    console.error('Failed to load items:', err);
  }

  private loadInventoryItems() {
    return this.itemService.itemState$.pipe(
      first(),
      switchMap((state) =>
        state.inventoryItems.length !== 0
          ? of(state.filteredInventoryItems)
          : this.itemService.fetchItems()
      ),
      tap(() => (this.loading = false))
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (this.mode !== 'inventory') return;
    this.applyFilter();
  }

  applyFilter(): void {
      this.itemService.updateFilteredItems(this.filter);
    this.itemService.itemState$.subscribe((state) => {
      this.filter = state.filterText;
      this.filteredItems = state.filteredInventoryItems.filter(
        (item) => item.selected !== false
      );
      
    });
  }

  onItemSelect(idx: number): void {
    if (this.mode === 'inventory') {
      let selectedItem: ModifiedItemData;
      if (this.filter === '') {
        this.items[idx].selected = true;
        selectedItem = this.items[idx];
      } else {
        console.log(idx);
        this.filteredItems[idx].selected = true;
        selectedItem = this.filteredItems[idx];
      }
      this.itemService.moveItemToTrade(idx);
      this.applyFilter();
    }
  }

  onRemoveItem(idx: number) {
    this.itemService.itemState$.subscribe((state) => {
      this.filter = state.filterText;
    })
    if (this.mode === 'toTrade') {
      console.log(this.filter);
      if (this.filter) {
        console.log('ran');
        this.itemService.moveItemToFilteredInventory(idx);
        this.itemService.itemState$.subscribe((s) => console.log(s.filteredInventoryItems));
      } else {
        this.itemService.moveItemToInventory(idx);
      }
    } else {
      this.itemService.removeItemFrom(idx);
    }
    this.applyFilter();
  }

  onOpenItemEditor() {
    let dialogRef = this.dialog.open(ItemEditorComponent, {
      height: '90vh',
      width: '95vw',
    });

    dialogRef.afterClosed().subscribe((selectedItems: ModifiedItemData[]) => {
      if (selectedItems) {
        this.itemService.itemState$
          .pipe(
            first(),
            map((state) => state.forTradeItems)
          )
          .subscribe((forTradeItems) => {
            const updatedItems = [...forTradeItems, ...selectedItems];
            this.itemService.updateState({ forTradeItems: updatedItems });
          });
      }
    });
  }
}
