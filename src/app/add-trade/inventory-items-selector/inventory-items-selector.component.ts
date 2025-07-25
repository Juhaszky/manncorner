import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ItemSelectorFacade } from '../../../shared/item-selector/item-selector.facade';
import { ItemContainerComponent } from '../../../shared/item/item-container.component';
import { fromEvent, map, take } from 'rxjs';
import { Item } from '../../../shared/models/item.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserProfileFacade } from '../../user-profile/user-profile.facade';

@Component({
  selector: 'app-inventory-items-selector',
  imports: [CommonModule, ItemContainerComponent, ProgressSpinnerModule],
  templateUrl: './inventory-items-selector.component.html',
  styleUrl: './inventory-items-selector.component.scss',
})
export class InventoryItemsSelectorComponent implements AfterViewInit, OnInit {
  @Input() mode!: 'inventory' | 'toTrade' | 'allItems';
  @Input() filter = '';
  @Output() itemAdd = new EventEmitter<Item>();
  @ViewChild('inventorySelector') inventorySelectorEl!: ElementRef;
  @Output() lazyLoadEmitter = new EventEmitter<{
    first: number;
    row: number;
  }>();
  @Input() items: Item[] = [];
  selectedItemIds = new Set<string>();
  disabled = false;
  constructor(
    public itemSelectorFacade: ItemSelectorFacade,
    private userDataFacade: UserProfileFacade
  ) {}
  ngOnInit(): void {
    this.itemSelectorFacade.itemsToTrade$.subscribe(selectedItems => {
      selectedItems.forEach(item => {
        if (item.id) {
          this.selectedItemIds.add(item.id);
        }
      });
    });
  }
  ngAfterViewInit(): void {
    this.userDataFacade.userData$.pipe(take(1)).subscribe(res => {
      if (!res.steamid) {
        return;
      }
      fromEvent<Event>(
        this.inventorySelectorEl.nativeElement,
        'scroll'
      ).subscribe((event: Event) => {
        if (this.filter && this.filter.trim() !== '') {
          return;
        }
        const target = event.target as HTMLElement;
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight;

        const threshold = 50;

        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

        if (distanceFromBottom <= threshold) {
          this.itemSelectorFacade.loadItemsLazy(
            this.itemSelectorFacade.itemsLength,
            50,
            res.steamid
          );
        }
      });
    });
  }
  onItemSelect(item: Item): void {
    this.itemAdd.emit(item);
    this.itemSelectorFacade.itemsToTrade$.pipe(
      map(
        itemsToTrade =>
          !!itemsToTrade &&
          itemsToTrade.some(selected => selected.id === item.id)
      )
    );
    this.selectedItemIds.add(item.id);
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
  isItemDisabled(item: Item): boolean {
    return this.itemSelectorFacade.isItemSelected(item);
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
