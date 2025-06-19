import { Injectable } from '@angular/core';
import { ModifiedItemData } from '../models/modifiedItem.model';
import { ItemExtrasService } from '../item-extras.service';
import { ItemSelectorService } from '../item-selector.service';
import { Router } from '@angular/router';
import { getItemBorderStyle } from '../../app/common/utils';

@Injectable({ providedIn: 'root' })
export class ItemFacade {
  constructor(
    private itemExtrasService: ItemExtrasService,
    private itemService: ItemSelectorService,
    private router: Router
  ) {}

  getImageUrl(item: ModifiedItemData): string {
    const itemsUrl = item.imageUrl ?? item.icon_Url_Large;
    if (!itemsUrl) {
      return '';
    }
    return itemsUrl
      ? itemsUrl.startsWith('http')
        ? itemsUrl
        : `https://steamcommunity-a.akamaihd.net/economy/image/${itemsUrl}`
      : '';
  }

  initializeEffectUrl(item: ModifiedItemData): string {
    if (item.effect) {
      const url = this.itemExtrasService.getItemEffectUrl(item.effect);
      return url;
    }
    return '';
  }

  onItemSelect(mode: string) {
    if (
      !['inventory', 'allItem'].includes(mode) &&
      !this.router.url.includes('home')
    ) {
      this.openItemDetails();
    }
  }
  onRemoveItem(item: ModifiedItemData) {

  }

  openItemDetails() {
    return null;
  }

  handleCustomizeItem(item: ModifiedItemData) {
    this.resetItemName(item);
  }

  resetItemName(item: ModifiedItemData): void {
    if (item.originalName) {
      item.name = item.originalName;
    }
  }

  getBorderStyle(item: ModifiedItemData): string {
    return getItemBorderStyle(item);
  }

  checkItemExtras(item: ModifiedItemData) {
    if (item.descriptions && item.descriptions.length > 0) {
      const descriptions = item.descriptions;
      descriptions.forEach(desc => {
        if (desc.value.includes('Halloween')) {
          item.spell = desc.value;
        } else if (desc.value.includes('Killstreaker')) {
          if (item.killstreaker) {
            item.killstreaker.killstreaker = desc.value;
          }
        } else if (desc.value.includes('Sheen')) {
          if (item.killstreaker) {
            item.killstreaker.sheen = desc.value;
          }
        }
      });
    }
  }
}