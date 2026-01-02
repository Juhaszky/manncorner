
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { combineLatest, first, map, switchMap, take } from 'rxjs';
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
import { UserDataService } from '../../shared/user-data.service';
import { UserProfileService } from '../user-profile/user-profile.service';
import { MessageService } from 'primeng/api';
import { ToastMessage } from '../../shared/models/enums/error-message.enum';
import { TradesStateService } from '../../shared/trades-state.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
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
  userDataService = inject(UserDataService);
  addTradeService = inject(AddTradeService);
  tradeStateService = inject(TradesStateService)
  messageService = inject(MessageService);
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
    private sortService: SortService,
    private userService: UserProfileService
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
    combineLatest([
      this.itemSelectorFacade.itemsToTrade$,
      this.itemSelectorFacade.itemsForTrade$,
      this.userFacade.userData$.pipe(take(1)),
    ])
      .pipe(take(1))
      .subscribe(([itemsToTrade, itemsForTrade, userData]) => {
        if (itemsToTrade.length === 0 || itemsForTrade.length === 0) {
          return this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: ToastMessage.EACH_CATEGORY,
          });
        }
        const items: Item[] = [
          ...itemsToTrade.map(item => ({ ...item, isSelling: true })),
          ...itemsForTrade.map(item => ({
            ...item,
            isSelling: false,
            level: 1,
          })),
        ];

        const tradePayload = {
          avatarPath: userData.avatar,
          userId: userData.steamid,
          createdAt: new Date().toISOString(),
          status: 'open',
          description: this.tradeDescription,
          items: items,
          username: userData.personaname,
        };

        this.tradeService.postTrade(tradePayload).pipe(
          switchMap(createdTrade =>
            this.tradeStateService.trades$.pipe(
              take(1),
              map(trades => ({ trades, createdTrade }))
            )
          )
        ).subscribe({
          next: ({ trades, createdTrade }) => {
            this.emptySelectedItems();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: ToastMessage.ADD_TRADE_SUCCESS,
            });
            const newTrade = {
              ...createdTrade,
              bumpedAt: new Date(),
              itemsToSell: itemsToTrade,
              itemsToBuy: itemsForTrade,
            };
            this.tradeStateService.setTrades(
              [newTrade, ...trades],
              trades.length + 1
            );
          },
          error: err => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: ToastMessage.ADD_TRADE_FAIL,
            });
          },
        });
      });
  }

  private emptySelectedItems() {
    this.tradeDescription = '';
    this.itemSelectorFacade.emptyTradeItems();
  }
}
