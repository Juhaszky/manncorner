import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'item-list-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-list-view.component.html',
  styleUrl: './item-list-view.component.scss'
})
export class ItemListViewComponent {
  @Input() selectedItems: any;
  
  removeSelectedItem(i: number) {
    this.selectedItems.splice(i, 1);
  }
}
