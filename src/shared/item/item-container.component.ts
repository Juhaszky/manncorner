import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ItemComponent } from './item.component';
import { ItemFacade } from './item.facade';
import { ModifiedItemData } from '../models/modifiedItem.model';

@Component({
  selector: 'app-item-container',
  imports: [ItemComponent],
  templateUrl: './item-container.component.html',
})
export class ItemContainerComponent implements OnChanges {
  @Input() item!: ModifiedItemData;
  @Input() mode = '';
  facade = inject(ItemFacade);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["item"] && this.item) {
      this.facade.checkItemExtras(this.item);
    }
  }
}
