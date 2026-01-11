import { Injectable } from '@angular/core';
import { ItemExtrasService } from '../item-extras.service';
import { ItemSelectorService } from '../item-selector.service';
import { Router } from '@angular/router';
import { getItemBorderStyle, getQualityString } from '../../app/common/utils';
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
  onRemoveItem(item: Item) {}

  openItemDetails() {
    return null;
  }

  getBorderStyle(item: Item): string {
    return getItemBorderStyle(item);
  }

  checkItemExtras(item: Item) {}

  openBackpackTfHistory(item: Item) {
    window.open(`https://backpack.tf/item/${item.id}`, '_blank');
  }

  openBackpackTfLink(item: Item) {
    const baseUrl = 'https://backpack.tf/stats/';
    let urlParams = '';
    const qualityParam = `${getQualityString(item.quality)}`;
    urlParams += qualityParam;

    let nameParam = item.name;

    const isAustralium = item.fullName.includes('Australium');
    if (isAustralium) {
      nameParam = item.fullName.split(' ').slice(1).join(' ');
      const australiumParam = '/Australium ' + nameParam;
      urlParams += australiumParam;
    } else {
      urlParams += `/${nameParam}`;
    }

    urlParams += '/Tradable/Craftable';
    //Unusual
    if (item.quality === 5) {
      const effectParam = item.effect;
      urlParams += `/${effectParam}`;
    }
    //const isSpecialized = item.sheen;
    //if ()
    const encodedUrl = encodeURI(baseUrl + urlParams);

    window.open(encodedUrl, '_blank');
  }
}
