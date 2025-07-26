import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { combineLatest, first, map } from 'rxjs';
import { ItemSelectorService } from '../../shared/item-selector.service';
import { TradeService } from '../home/trade.service';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DescrpitionComponent } from '../../shared/descrpition/descrpition.component';
import { ButtonModule } from 'primeng/button';
import { ItemSelectorFacade } from '../../shared/item-selector/item-selector.facade';
import { DialogService } from 'primeng/dynamicdialog';
import { InventoryItemsSelectorComponent } from './inventory-items-selector/inventory-items-selector.component';
import { BuyItemPanelComponent } from './buy-item-panel/buy-item-panel.component';
import { Item } from '../../shared/models/item.model';
import { AddTradeService } from './add-trade.service';
import { UserProfileFacade } from '../user-profile/user-profile.facade';
import { SortService } from '../../shared/sort.service';
import { SellItemPanelComponent } from './sell-item-panel/sell-item-panel.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ActionBarComponent,
    FormsModule,
    DescrpitionComponent,
    ReactiveFormsModule,
    ButtonModule,
    InventoryItemsSelectorComponent,
    BuyItemPanelComponent,
    SellItemPanelComponent
  ],
  providers: [HttpClient, DialogService],
  templateUrl: './add-trade.component.html',
  styleUrl: './add-trade.component.scss',
})
export class AddTradeComponent implements OnInit {
  http = inject(HttpClient);
  userFacade = inject(UserProfileFacade);
  addTradeService = inject(AddTradeService);
  filterText = '';
  tradeDescription = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inventoryItems: Item[] = [];
  displayInventoryItems: Item[] = [];
  itemsToSell: Item[] = [];
  itemsToBuy: Item[] = [];

  constructor(
    private tradeService: TradeService,
    private itemSelectorService: ItemSelectorService,
    private cdRef: ChangeDetectorRef,
    private itemSelectorFacade: ItemSelectorFacade,
    private sortService: SortService
  ) {
    // afterNextRender(() => {
    //   this.AddTradeService.filterText$.subscribe(filterText => {
    //     console.log('ran');
    //     this.filterText = filterText;
    //     //this.cdRef.detectChanges();
    //   });
    // });
  }
  check(description: string): void {
    this.tradeDescription = description;
  }
  ngOnInit(): void {
    this.userFacade.userData$.pipe(first()).subscribe(res => {
      if (res?.steamid) {
        // Pass the steamId when loading items
        this.itemSelectorFacade.loadItemsLazy(0, 100, res.steamid);
      } else {
        console.error('No steamId found');
      }
    });
    combineLatest([
      this.itemSelectorFacade.items$,
      this.addTradeService.filterText$,
      this.sortService.sortCriteria$,
    ])
      .pipe(
        map(([items, filterText, sortCriteria]) => {
          this.filterText = filterText;
          const filtered = filterText
            ? items.filter(i =>
                i.fullName.toLowerCase().includes(filterText.toLowerCase())
              )
            : [...items];

          return this.sortService.sortItems(filtered, sortCriteria);
        })
      )
      .subscribe(filteredSorted => {
        this.displayInventoryItems = filteredSorted;
      });
    this.itemSelectorFacade.itemsToTrade$.subscribe(items => {
      this.itemsToSell = items;
    });
    this.itemSelectorFacade.itemsForTrade$.subscribe(items => {
      this.itemsToBuy = items;
    });
  }

  makeTrade() {
    //TODO handle subscription error on make trade
    // combineLatest([
    //   this.itemSelectorFacade.itemsToTrade$,
    //   this.itemSelectorFacade.itemsForTrade$,
    // ]).subscribe(([itemIdsToTrade, itemIdsForTrade]) => {
    //   console.log(itemIdsForTrade);
    //   console.log(itemIdsToTrade);
    //   if (itemIdsToTrade.length === 0 || itemIdsForTrade.length === 0) {
    //     return alert('You must select one item from each category!');
    //   }

    //   this.tradeService
    //     .postTrade({
    //       itemsFrom: itemIdsToTrade,
    //       itemsTo: itemIdsForTrade,
    //       postDate: new Date().toISOString(),
    //       owner: 'Juhaszky', //this.userDataService.getUsername(),
    //       description: this.tradeDescription,
    //     })
    //     .subscribe();

    //   this.emptySelectedItems();
    // });
  }

  private emptySelectedItems() {
    //this.html = '';
    this.itemSelectorService.emptyItemForTrade();
    this.itemSelectorService.emptyItemsToTrade();
  }
}
