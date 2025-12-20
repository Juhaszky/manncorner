import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ItemCustomizerComponent } from '../../item-customizer/item-customizer.component';
import { DialogModule } from 'primeng/dialog';
import { Item } from '../../models/item.model';
import { getImgUrlString, getQualityString } from '../../../app/common/utils';
import { ItemFacade } from '../../item/item.facade';
import { ItemSelectorFacade } from '../../item-selector/item-selector.facade';

@Component({
  standalone: true,
  selector: 'item-list-view',
  imports: [CommonModule, DialogModule, ItemCustomizerComponent],
  templateUrl: './item-list-view.component.html',
  styleUrl: './item-list-view.component.scss',
})
export class ItemListViewComponent implements OnInit {
  @Input() selectedItems: Item[] = [];
  qualityToDisplay = '';
  selectedIndex = -1;
  visible = false;
  itemSelectorFacade = inject(ItemSelectorFacade);
  itemFacade = inject(ItemFacade);
  getImgUrlString = getImgUrlString;
  ngOnInit(): void {
    this.itemSelectorFacade.itemsEditForTrade$.subscribe((items) => {
      this.selectedItems = items;
    })
  }
  removeSelectedItem(i: number) {
    this.selectedItems.splice(i, 1);
  }
  getQualityString(quality: number) {
    return getQualityString(quality);
  }

  customizeSelectedItem(i: number) {
    this.selectedIndex = i;
    this.visible = true;
    if (i >= 0 && i < this.selectedItems.length) {
      const itemCopy = { ...this.selectedItems[i] };
      this.selectedItems[i] = itemCopy;
    }
  }

  onItemModified(item: Item) {
    this.itemSelectorFacade.onModifyEditDefaultItem(item);
    if (this.selectedIndex !== null && this.selectedIndex >= 0) {
      this.selectedItems[this.selectedIndex] = { ...item };
    }
    this.visible = false;
  }

  onHide(event: any) {
    console.log(event);
  }
}
