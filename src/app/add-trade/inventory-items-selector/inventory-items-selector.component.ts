import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ItemSelectorFacade } from '../../../shared/item-selector/item-selector.facade';
import { ItemContainerComponent } from '../../../shared/item/item-container.component';
import { fromEvent } from 'rxjs';
import { Item } from '../../../shared/models/item.model';

@Component({
  selector: 'app-inventory-items-selector',
  imports: [CommonModule, ItemContainerComponent],
  templateUrl: './inventory-items-selector.component.html',
  styleUrl: './inventory-items-selector.component.scss'
})
export class InventoryItemsSelectorComponent implements AfterViewInit {
  @Input() mode!: 'inventory' | 'toTrade' | 'allItems';
  @Input() filter = '';
  @Output() itemAdd = new EventEmitter<Item>();
  @ViewChild('inventorySelector') inventorySelectorEl!: ElementRef;
  @Output() lazyLoadEmitter = new EventEmitter<{ first: number, row: number }>();
  @Input() items: Item[] = [];
  selectedItemIds = new Set<number>();

  constructor(public itemSelectorFacade: ItemSelectorFacade) { }
  ngAfterViewInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fromEvent(this.inventorySelectorEl.nativeElement, "scroll").subscribe((event: any) => {
      const target = event.target;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;

      const threshold = 50;

      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceFromBottom <= threshold) {
        console.log("Almost on bottom");
        this.itemSelectorFacade.loadItemsLazy(this.itemSelectorFacade.itemsLength, 40);
      }

    })
  }
  onItemSelect(item: Item): void {
    this.itemAdd.emit(item);
    this.selectedItemIds.add(item.defindex);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
}
