
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DescrpitionComponent } from '../../shared/descrpition/descrpition.component';
import { ItemCustomizerComponent } from '../../shared/item-customizer/item-customizer.component';
import { ItemEditorComponent } from '../../shared/item-editor/item-editor.component';
import { ItemContainerComponent } from '../../shared/item/item-container.component';
import { ActionBarComponent } from '../add-trade/action-bar/action-bar.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ItemSelectorFacade } from '../../shared/item-selector/item-selector.facade';
import { SortService } from '../../shared/sort.service';
import { AddTradeService } from '../add-trade/add-trade.service';
import { TradeService } from '../home/trade.service';
import { UserProfileFacade } from '../user-profile/user-profile.facade';
import { Item } from '../../shared/models/item.model';
import {
  catchError,
  combineLatest,
  debounceTime,
  finalize,
  fromEvent,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { environment } from '../../environments/environment.development';
import { TradeResult } from '../../shared/models/trade.model';
import { SearchTradeResultsService } from '../search-trade-results/search-trade-results.service';
import { SearchTradeService } from './search-trade.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-search',
  imports: [
    ButtonModule,
    ActionBarComponent,
    DescrpitionComponent,
    ItemContainerComponent,
    DialogModule,
    ItemEditorComponent,
    ItemCustomizerComponent,
    ProgressSpinnerModule
],
  templateUrl: './search-trade.component.html',
  styleUrl: './search-trade.component.scss',
})
export class SearchTradeComponent implements OnInit, AfterViewInit {
  filterText = '';
  tradeId = '';
  private filterSubject = new Subject<string>();
  @ViewChild('inventorySelector') inventorySelectorEl!: ElementRef;
  selectedItemIds = new Set<string>();
  route = inject(ActivatedRoute);
  tradeService = inject(TradeService);
  itemSelectorFacade = inject(ItemSelectorFacade);
  userDataFacade = inject(UserProfileFacade);
  addTradeService = inject(AddTradeService);
  searchTradeService = inject(SearchTradeService);
  sortService = inject(SortService);
  messageService = inject(MessageService);
  http = inject(HttpClient);
  router = inject(Router);
  searchTradeResultService = inject(SearchTradeResultsService);

  allItems: Item[] = [];
  itemsFrom: Item[] = [];
  baseInventoryItems: Item[] = [];
  selectedItems: Item[] = [];
  customizableItem!: Item;
  visible = false;
  editorVisible = false;
  customizeVisible = false;
  offset = 0;
  limit = 25;
  isLoading = false;
  hasMoreItems = true;
  ngAfterViewInit(): void {
    this.userDataFacade.userData$.pipe(take(1)).subscribe(res => {
      if (!res.steamid) return;

      fromEvent<Event>(
        this.inventorySelectorEl.nativeElement,
        'scroll'
      ).subscribe(event => {
        const target = event.target as HTMLElement;
        const distanceFromBottom =
          target.scrollHeight - (target.scrollTop + target.clientHeight);
        const threshold = 50;

        if (
          distanceFromBottom <= threshold &&
          !this.isLoading &&
          this.hasMoreItems &&
          (!this.filterText || this.filterText.trim() === '')
        ) {
          this.loadMoreItems();
        }
      });
    });
  }
  loadMoreItems() {
    if (this.isLoading || !this.hasMoreItems) return;
    this.isLoading = true;

    this.userDataFacade.userData$.pipe(take(1)).subscribe(res => {
      if (!res.steamid) {
        this.isLoading = false;
        return;
      }
      let params = `?offset=${this.offset}&limit=${this.limit}`;
      if (this.filterText.trim()) {
        params += `&searchterm=${encodeURIComponent(this.filterText)}`;
      }

      this.http
        .get<Item[]>(`${environment.MICROSERVICE_URL}/api/items${params}`)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(
          items => {
            if (!items || items.length < this.limit) {
              this.hasMoreItems = false;
            }
            this.allItems = [...this.allItems, ...items];
            this.baseInventoryItems = this.allItems;
            this.offset += items.length;
          },
          () => {
            this.hasMoreItems = false;
          }
        );
    });
  }
  ngOnInit(): void {
    const initialLoad$ = this.loadItems().pipe(
      catchError(() => of([])),
      shareReplay(1)
    );

    initialLoad$.subscribe(items => {
      this.baseInventoryItems = items;
      this.allItems = items;
    });

    combineLatest([
      this.searchTradeService.filterText$.pipe(startWith('')),
      this.sortService.sortCriteria$.pipe(startWith(null)),
    ])
      .pipe(
        debounceTime(500),
        tap(([filterText]) => {
          this.filterText = filterText;
        }),
        switchMap(([filterText, sortCriteria]) =>
          this.loadItems(filterText).pipe(
            catchError(() => of([])),
            map(items => {
              if (sortCriteria) {
                return this.sortService.sortItems(items, sortCriteria);
              } else {
                return items;
              }
            })
          )
        )
      )
      .subscribe(items => {
        this.baseInventoryItems = items;
      });

    this.filterSubject
      .pipe(
        debounceTime(100),
        switchMap(filterText =>
          this.loadItems(filterText).pipe(catchError(() => of([])))
        )
      )
      .subscribe(items => {
        this.allItems = items;
      });

    this.itemSelectorFacade.itemsSearchToTrade$.subscribe(items => {
      this.itemsFrom = items;
    });

    this.itemSelectorFacade.itemsSearchForTrade$.subscribe(res => {
      this.selectedItems = res;
    });
  }

  loadItems(searchTerm?: string): Observable<Item[]> {
    const params = searchTerm
      ? `?searchterm=${encodeURIComponent(searchTerm)}`
      : '';
    return this.http.get<Item[]>(
      `${environment.MICROSERVICE_URL}/api/items${params}`
    );
  }

  handleFilterSearch(searchTerm: string) {
    this.filterText = searchTerm;
    this.filterSubject.next(searchTerm);
  }

  searchTrade() {
    combineLatest([
      this.itemSelectorFacade.itemsSearchToTrade$,
      this.itemSelectorFacade.itemsSearchForTrade$,
      this.userDataFacade.userData$.pipe(take(1)),
    ])
      .pipe(take(1))
      .subscribe(([itemsToTrade, itemsForTrade]) => {
        const items: Item[] = [
          ...itemsToTrade.map(item => ({ ...item, isSelling: true })),
          ...itemsForTrade.map(item => ({
            ...item,
            isSelling: false,
            level: 1,
          })),
        ];
        this.searchTradeResultService.searchItems = items;

        this.http
          .post<TradeResult>(
            `${environment.API_URL}/api/Trade/search?page=1&pageSize=10`,
            items
          )
          .subscribe(res => {
            this.searchTradeResultService.setResults(res);
            this.itemSelectorFacade.emptySearchItems();
            this.router.navigate(['/results']);
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
    this.itemSelectorFacade.itemsSearchToTrade$.pipe(
      map(
        itemsToTrade =>
          !!itemsToTrade &&
          itemsToTrade.some(selected => selected.id === item.id)
      )
    );
    this.selectedItemIds.add(item.id);
  }
  isItemDisabled(item: Item): boolean {
    return this.itemSelectorFacade.isSearchItemSelected(item);
  }

  trackByFn(index: number, item: Item) {
    return item.defindex ? `${item?.defindex}_${index}` : index;
  }
  onRemoveItem(item: Item) {
    this.itemSelectorFacade.onRemoveEditItem(item);
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
