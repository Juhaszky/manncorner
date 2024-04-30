import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ItemSelectorService } from '../item-selector.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ItemEditorComponent } from '../item-editor/item-editor.component';
import { Observable } from 'rxjs';
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
    let itemObservable: Observable<any>;

    switch (this.mode) {
      case 'inventory':
        this.loading = true;
        itemObservable = this.itemService.fetchItems();
        break;
      case 'allItems':
        this.loading = true;
        itemObservable = this.itemService.getItemsForTrade();
        break;
      default:
        this.loading = true;
        itemObservable = this.itemService.getItemsToTrade();
    }

    itemObservable.subscribe((items: any) => {
      this.loading = false;
      this.items = items;
    });
  }

  onItemSelect(idx: number) {
    console.log(idx);
    switch (this.mode) {
      case 'allItems':
        this.itemService.removeItemFrom(idx);
        break;
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
        console.log(selectedItems);
        const items = this.itemService.getItemsForTrade().getValue();
        this.itemService.getItemsForTrade().next([...items, ...selectedItems]);
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
