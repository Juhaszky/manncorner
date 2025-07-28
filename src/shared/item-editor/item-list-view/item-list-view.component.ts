import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ItemCustomizerComponent } from '../../item-customizer/item-customizer.component';
import { DialogModule } from 'primeng/dialog';
import { Item } from '../../models/item.model';
import { getQualityString } from '../../../app/common/utils';

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
  ngOnInit(): void {
    console.log(this.selectedItems);
  }
  removeSelectedItem(i: number) {
    this.selectedItems.splice(i, 1);
  }
  getQualityString(quality: number) {
    return getQualityString(quality);
  }
  customizeSelectedItem(i: number) {
    this.selectedIndex = i;

    console.log(this.selectedItems);
    console.log(i);
    console.log(this.selectedItems[i]);
    this.visible = true;
    if (i >= 0 && i < this.selectedItems.length) {
    const itemCopy = { ...this.selectedItems[i] };
    this.selectedItems[i] = itemCopy;
  }
  }

  onItemModified(item: Item) {
    if (this.selectedIndex !== null && this.selectedIndex >= 0) {
      this.selectedItems[this.selectedIndex] = { ...item };
    }
    this.visible = false;
    console.log(this.visible);
  }

  onHide(event: any) {
    console.log(event);
  }
}
