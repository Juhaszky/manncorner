import { Component, OnInit } from '@angular/core';
import { ItemContainerComponent } from '../../../shared/item/item-container.component';
import { ItemSelectorFacade } from '../../../shared/item-selector/item-selector.facade';
import { Item } from '../../../shared/models/item.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offer-item-panel',
  imports: [ItemContainerComponent, CommonModule],
  templateUrl: './offer-item-panel.component.html',
  styleUrl: './offer-item-panel.component.scss'
})
export class OfferItemPanelComponent implements OnInit {
  items: Item[] = [];
  constructor(public itemSelectorFacade: ItemSelectorFacade) {
    
  }
  ngOnInit(): void {
    this.itemSelectorFacade.itemsOfferTrade$.subscribe((i) => this.items = i);
  }
}
