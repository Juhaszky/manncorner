import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ItemSelectorService } from '../item-selector.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ItemEditorComponent } from '../item-editor/item-editor.component';
import { Observable } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';

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
    dialogRef.afterClosed().subscribe((selectedItems: any) => {
      if (selectedItems) {
        selectedItems.map((item: any) => (item.name_color = '7D6D00'));
        const items = this.itemService.getItemsForTrade().getValue();
        this.itemService.getItemsForTrade().next([...items, ...selectedItems]);
      }
    });
  }
}
