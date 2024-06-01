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
import { first, map, Observable, take } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { StockItem } from '../models/stockItem.model';

@Component({
  selector: 'item-selector',
  standalone: true,
  imports: [
    MatTooltipModule,
    CommonModule,
    MatProgressSpinnerModule,
    ScrollingModule,
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
    this.loading = true;
    let itemObservable: Observable<any>;
    switch (this.mode) {
      case 'inventory':
        itemObservable = this.itemService.itemState$.pipe(
          first(),
          map((state) =>
            state.inventoryItems.length !== 0
              ? state.inventoryItems
              : this.itemService.fetchItems()
          )
        );
        break;
      case 'allItems':
        itemObservable = this.itemService.getItemsForTrade();
        break;
      default:
        itemObservable = this.itemService.getItemsToTrade();
    }
    itemObservable.subscribe({
      next: (items: any[]) => {
        this.loading = false;
        this.items = items;
        this.applyFilter();
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to load items:', err);
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mode !== 'inventory') return;
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredItems =
      this.filter.length > 0
        ? this.items.filter((item) =>
            item.name.toLowerCase().includes(this.filter.toLowerCase())
          )
        : this.items;
  }

  onItemSelect(idx: number): void {
    switch (this.mode) {
      case 'inventory':
        this.itemService.moveItemToTrade(idx);
        break;
      default:
        this.itemService.moveItemToInventory(idx);
        break;
    }
  }
  onOpenItemEditor() {
    let dialogRef = this.dialog.open(ItemEditorComponent, {
      height: '75vh',
      width: '75vw',
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
}
