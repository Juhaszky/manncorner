import { Injectable } from '@angular/core';
import { ItemExtrasService } from '../item-extras.service';
import { ItemSelectorService } from '../item-selector.service';
import { Router } from '@angular/router';
import { getItemBorderStyle } from '../../app/common/utils';
import { Item } from '../models/item.model';

@Injectable({ providedIn: 'root' })
export class ItemFacade {
  constructor(
    private itemExtrasService: ItemExtrasService,
    private itemService: ItemSelectorService,
    private router: Router
  ) {}


  onItemSelect(mode: string) {
    if (
      !['inventory', 'allItem'].includes(mode) &&
      !this.router.url.includes('home')
    ) {
      this.openItemDetails();
    }
  }
  onRemoveItem(item: Item) {

  }

  openItemDetails() {
    return null;
  }

  getBorderStyle(item: Item): string {
    return getItemBorderStyle(item);
  }

  checkItemExtras(item: Item) {
    
  }
}