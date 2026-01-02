
import { Component, inject, OnInit } from '@angular/core';
import { ItemContainerComponent } from '../../../shared/item/item-container.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Item } from '../../../shared/models/item.model';
import { ItemSelectorFacade } from '../../../shared/item-selector/item-selector.facade';
import { UserProfileFacade } from '../../user-profile/user-profile.facade';
import { first } from 'rxjs';

@Component({
  selector: 'app-sell-item-panel',
  imports: [ItemContainerComponent, ProgressSpinnerModule],
  templateUrl: './sell-item-panel.component.html',
  styleUrl: './sell-item-panel.component.scss',
})
export class SellItemPanelComponent implements OnInit {
  items: Item[] = [];
  userFacade = inject(UserProfileFacade);
  constructor(public itemSelectorFacade: ItemSelectorFacade) {}
  ngOnInit(): void {
    this.userFacade.userData$.pipe(first()).subscribe(res => {
      if (res?.steamid) {
        this.itemSelectorFacade.loadItemsLazy(0, 100, res.steamid);
      } else {
        console.error('No steamId found');
      }
    });
    
    this.itemSelectorFacade.itemsToTrade$.subscribe(items => {
      this.items = items;
    });
  }
}
