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
import { StockItem } from '../models/stockItem.model';
import { ItemComponent } from '../item/item.component';


@Component({
  selector: 'item-selector',
  standalone: true,
  imports: [
    MatTooltipModule,
    CommonModule,
    MatProgressSpinnerModule,
    ScrollingModule,
    ItemComponent
  ],
  templateUrl: './item-selector.component.html',
  styleUrl: './item-selector.component.scss',
})
export class ItemSelectorComponent implements OnInit, OnChanges {
  @Input() mode!: 'inventory' | 'toTrade' | 'allItems';
  @Input() filter: string = '';

  items: any[] = [];
  filteredItems: any[] = [];
  loading = false;
  borderStyle: 'unusual' | 'strange' | 'vintage' | 'elite' | 'unique' =
    'unique';

  constructor(
    private itemService: ItemSelectorService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  private loadItems(): void {
    let itemObservable: Observable<any>;
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
      next: (items: any[]) => this.handleSuccess(items),
      error: (err) => this.handleError(err),
    });
  }

  private handleSuccess(items: any[]): void {
    this.items = items;
    if (this.mode === 'inventory') {
      this.applyFilter();
    }
  }

  private handleError(err: any): void {
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
    if (this.mode !== 'inventory') return;
    this.applyFilter();
  }

  applyFilter(): void {
    console.log(this.filter);
    this.itemService.updateFilteredItems(this.filter);
    this.itemService.itemState$.subscribe((state) => {
      this.filteredItems = state.filteredInventoryItems.filter(
        (item) => item.selected !== false
      );
    });
  }

  onItemSelect(idx: number): void {
    if (this.mode === 'inventory') {
      let selectedItem: any;
      if (this.filter === '') {
        this.items[idx].selected = true;
        selectedItem = this.items[idx];
      } else {
        console.log(idx);
        this.filteredItems[idx].selected = true;
        selectedItem = this.filteredItems[idx];
      }
      this.itemService.moveItemToTrade(idx);
    } else {
      this.itemService.moveItemToInventory(idx);
    }

    this.applyFilter();
  }

  onOpenItemEditor() {
    let dialogRef = this.dialog.open(ItemEditorComponent, {
      height: '90vh',
      width: '95vw',
    });

    dialogRef.afterClosed().subscribe((selectedItems: StockItem[]) => {
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
  
  getItemBorderStyle(item: any): string {
    if (item?.market_name?.includes('Unusual')) {
      return 'unusual';
    } else if (item?.market_name?.includes('Strange')) {
      return 'strange';
    } else if (item?.market_name?.includes('Vintage')) {
      return 'vintage';
    } else if (
      item?.descriptions &&
      item?.descriptions[0].value?.includes('Elite')
    ) {
      return 'elite';
    } else {
      return 'unique';
    }
  }
  trackByIdx(index: number, item: any): number {
    return index;
  }
}
