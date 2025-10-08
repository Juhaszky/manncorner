import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SellItemPanelComponent } from '../add-trade/sell-item-panel/sell-item-panel.component';
import { BuyItemPanelComponent } from '../add-trade/buy-item-panel/buy-item-panel.component';
import { ButtonModule } from 'primeng/button';
import { ActionBarComponent } from '../add-trade/action-bar/action-bar.component';
import { InventoryItemsSelectorComponent } from '../add-trade/inventory-items-selector/inventory-items-selector.component';
import { DescrpitionComponent } from '../../shared/descrpition/descrpition.component';
import {
  catchError,
  combineLatest,
  debounceTime,
  first,
  fromEvent,
  map,
  of,
  Subject,
  switchMap,
  take,
} from 'rxjs';
import { Item } from '../../shared/models/item.model';
import { ActivatedRoute } from '@angular/router';
import { TradeService } from '../home/trade.service';
import { Comment } from '../../shared/models/comment.model';
import { ItemContainerComponent } from '../../shared/item/item-container.component';
import { CommonModule } from '@angular/common';
import { ItemSelectorFacade } from '../../shared/item-selector/item-selector.facade';
import { DialogModule } from 'primeng/dialog';
import { ItemEditorComponent } from '../../shared/item-editor/item-editor.component';
import { ItemCustomizerComponent } from '../../shared/item-customizer/item-customizer.component';
import { UserProfileFacade } from '../user-profile/user-profile.facade';
import { AddTradeService } from '../add-trade/add-trade.service';
import { SortService } from '../../shared/sort.service';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { EditTradeService } from './edit-trade.service';
import { ErrorMessage } from '../../shared/models/enums/error-message.enum';

@Component({
  selector: 'app-edit-trade',
  imports: [
    SellItemPanelComponent,
    BuyItemPanelComponent,
    ButtonModule,
    ActionBarComponent,
    InventoryItemsSelectorComponent,
    DescrpitionComponent,
    ItemContainerComponent,
    CommonModule,
    DialogModule,
    ItemEditorComponent,
    ItemCustomizerComponent,
  ],
  templateUrl: './edit-trade.component.html',
  styleUrl: './edit-trade.component.scss',
})
export class EditTradeComponent implements OnInit, AfterViewInit {
  filterText = '';
  tradeId = '';
  private filterSubject = new Subject<string>();
  selectedItemIds = new Set<string>();
  route = inject(ActivatedRoute);
  tradeService = inject(TradeService);
  itemSelectorFacade = inject(ItemSelectorFacade);
  userDataFacade = inject(UserProfileFacade);
  addTradeService = inject(AddTradeService);
  editTradeService = inject(EditTradeService);
  sortService = inject(SortService);
  messageService = inject(MessageService);
  http = inject(HttpClient);
  @ViewChild('inventorySelector') inventorySelectorEl!: ElementRef;
  tradeData:
    | {
        itemsFrom: Item[];
        itemsTo: Item[];
        id: string;
        username: string;
        description: string;
        comments: Comment[];
      }
    | undefined;
  allItems: Item[] = [];
  inventoryItems: Item[] = [];
  itemsFrom: Item[] = [];
  selectedItems: Item[] = [];
  customizableItem!: Item;
  visible = false;
  editorVisible = false;
  customizeVisible = false;
  ngOnInit(): void {
    this.loadItems();
    this.filterSubject.pipe(debounceTime(100)).subscribe(filterText => {
        this.loadItems(filterText);
      });
    this.itemSelectorFacade.itemsEditForTrade$.subscribe(res => {
      this.selectedItems = res;
    });
    this.userDataFacade.userData$.pipe(first()).subscribe(res => {
      if (res?.steamid) {
        this.itemSelectorFacade.loadItemsLazy(0, 100, res.steamid);
      } else {
        console.error('No steamId found');
      }
    });

    this.itemSelectorFacade.itemsEditToTrade$.subscribe(itemsFrom => {
      this.itemsFrom = itemsFrom;
      itemsFrom.forEach(item => {
        if (item.id) {
          this.selectedItemIds.add(item.id);
        }
      });
    });
    combineLatest([
      this.editTradeService.filterText$,
      this.sortService.sortCriteria$,
    ])
      .pipe(
        debounceTime(500),
        switchMap(([filterText, sortCriteria]) => {
          const trimmed = filterText.trim();
          if (trimmed.length === 0) {
            return this.itemSelectorFacade.items$.pipe(
              map(items => this.sortService.sortItems(items, sortCriteria))
            );
          }
          return this.http
            .get<
              Item[]
            >(`${environment.API_URL}/items/search?searchString=${filterText}&userId=76561198027857565`)
            .pipe(
              catchError(() => of([])),
              map(items => this.sortService.sortItems(items, sortCriteria))
            );
        })
      )
      .subscribe(filteredSorted => {
        this.inventoryItems = filteredSorted;
      });
    this.tradeId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.tradeId) {
      this.tradeService
        .getTradeById(this.tradeId)
        .pipe(
          switchMap(trade => {
            const itemsForSale = trade.items.filter((i: Item) => i.isSelling);
            const itemsToBuy = trade.items.filter((i: Item) => !i.isSelling);
            const tradeData = {
              itemsFrom: itemsForSale,
              itemsTo: itemsToBuy,
              id: trade.id,
              username: trade.username,
              description: trade.description,
              comments: trade.comments,
            };
            return of(tradeData);
          }),
          catchError(err => {
            console.log(err);
            return [];
          })
        )
        .subscribe(data => {
          if (data) {
            this.itemSelectorFacade.emptyEditTradeItems();
            this.tradeData = data;
            this.tradeData.itemsFrom.forEach(i =>
              this.itemSelectorFacade.onAddEditItem(i)
            );
            this.itemSelectorFacade.onAddEditDefaultItem(
              this.tradeData.itemsTo
            );
            console.log(this.tradeData);
            //this.description = this.tradeData.description;
          }
        });
    }
  }
  loadItems(searchTerm?: string): void {
    const params = searchTerm
      ? `?searchterm=${encodeURIComponent(searchTerm)}`
      : '';
    this.http
      .get<Item[]>(`${environment.MICROSERVICE_URL}/api/items${params}`)
      .subscribe((res: Item[]) => {
        this.allItems = res;
      });
  }
  handleFilterSearch(searchTerm: string) {
    this.filterSubject.next(searchTerm);
  }
  ngAfterViewInit(): void {
    this.userDataFacade.userData$.pipe(take(1)).subscribe(res => {
      if (!res.steamid) {
        return;
      }
      fromEvent<Event>(
        this.inventorySelectorEl.nativeElement,
        'scroll'
      ).subscribe((event: Event) => {
        if (this.filterText && this.filterText.trim() !== '') {
          return;
        }
        const target = event.target as HTMLElement;
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight;

        const threshold = 50;

        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

        if (distanceFromBottom <= threshold) {
          this.itemSelectorFacade.loadItemsLazy(
            this.itemSelectorFacade.itemsLength,
            50,
            res.steamid
          );
        }
      });
    });
  }
  updateTrade() {
    combineLatest([
      this.itemSelectorFacade.itemsEditToTrade$,
      this.itemSelectorFacade.itemsEditForTrade$,
      this.userDataFacade.userData$.pipe(take(1)),
    ])
      .pipe(take(1))
      .subscribe(([itemsToTrade, itemsForTrade, userData]) => {
        if (itemsToTrade.length === 0 || itemsForTrade.length === 0) {
          return this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: ErrorMessage.EACH_CATEGORY,
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
          id: this.tradeData?.id ?? '',
          userId: userData.steamid,
          createdAt: new Date().toISOString(),
          avatarPath: userData.avatar,
          status: 'open',
          description: this.tradeData?.description ?? '',
          items: items,
          username: userData.personaname,
        };

        this.tradeService.updateTrade(tradePayload).subscribe({
          next: () => {
            //this.emptySelectedItems();
            //this.itemSelectorFacade.emptyEditTradeItems();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: ErrorMessage.EDIT_TRADE_SUCCESS,
            });
          },
          error: err => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: ErrorMessage.EDIT_TRADE_FAIL,
            });
          },
        });
      });
  }
  onOpenItemEditor() {
    this.editorVisible = true;
    this.visible = true;
  }
  onDialogClose() {
    this.editorVisible = false;
    this.visible = false;
  }
  onItemSelect(item: Item): void {
    this.itemSelectorFacade.itemsEditToTrade$.pipe(
      map(
        itemsToTrade =>
          !!itemsToTrade &&
          itemsToTrade.some(selected => selected.id === item.id)
      )
    );
    this.selectedItemIds.add(item.id);
  }
  isItemDisabled(item: Item): boolean {
    return this.itemSelectorFacade.isEditItemSelected(item);
  }

  trackByFn(index: number, item: Item) {
    return item?.id || index;
  }
  onRemoveItem(item: Item) {
    console.log('ran');
    this.itemSelectorFacade.onRemoveBaseEditItem(item);
  }
  onCustomizeItem(item: Item) {
    console.log(this.customizeVisible);
    this.customizableItem = item;
    this.customizeVisible = true;
    this.visible = true;
  }
  closeOnModification() {
    this.visible = false;
  }
}
