import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
export class ItemSelectorComponent implements OnInit {
  @Input() mode!: 'inventory' | 'toTrade' | 'allItems';
  items: any[] = [];
  allItems: any[] = [];
  loading = false;
  borderStyle: 'unusual' | 'strange' | 'vintage' | 'elite' | 'unique' =
    'unique';

  constructor(
    private itemService: ItemSelectorService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    let itemObservable: Observable<any> = new Observable();

    switch (this.mode) {
      case 'inventory':
        this.loading = true;
        this.itemService.itemState$.pipe(first()).subscribe((state) => {
          console.log(state);
          if (state.inventoryItems.length !== 0) {
            this.items = state.inventoryItems;
          } else {
            itemObservable = this.itemService.fetchItems();
          }
        })
        break;
      case 'allItems':
        this.loading = true;
        itemObservable = this.itemService.getItemsForTrade();
        break;
      default:
        this.loading = true;
        itemObservable = this.itemService.getItemsToTrade();
    }

    itemObservable.subscribe({
      next: (items: any[]) => {
        this.loading = false;
        this.items = items;
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to load items:', err);
      },
    });
  }

  onItemSelect(idx: number) {
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
