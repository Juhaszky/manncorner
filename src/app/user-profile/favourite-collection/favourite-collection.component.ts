import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActionBarComponent } from '../../add-trade/action-bar/action-bar.component';

import { ItemContainerComponent } from '../../../shared/item/item-container.component';
import { Item } from '../../../shared/models/item.model';
import { UserProfileFacade } from '../user-profile.facade';
import {
  take,
  fromEvent,
  finalize,
  map,
  debounceTime,
  switchMap,
  Observable,
  catchError,
  combineLatest,
  of,
  shareReplay,
  startWith,
  tap,
  Subject,
} from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ItemSelectorFacade } from '../../../shared/item-selector/item-selector.facade';
import { ProgressSpinner } from 'primeng/progressspinner';
import { SearchTradeService } from '../../search-trade/search-trade.service';
import { SortService } from '../../../shared/sort.service';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ItemEditorComponent } from '../../../shared/item-editor/item-editor.component';
import { ItemCustomizerComponent } from '../../../shared/item-customizer/item-customizer.component';

@Component({
  selector: 'app-favourite-collection',
  imports: [
    ItemContainerComponent,
    ActionBarComponent,
    ProgressSpinner,
    Button,
    DialogModule,
    ItemEditorComponent,
    ItemCustomizerComponent
],
  templateUrl: './favourite-collection.component.html',
  styleUrl: './favourite-collection.component.scss',
})
export class FavouriteCollectionComponent implements OnInit, AfterViewInit {
  @ViewChild('inventorySelector') inventorySelectorEl!: ElementRef;
  filterText = '';

  private filterSubject = new Subject<string>();
  selectedItemIds = new Set<string>();
  userDataFacade = inject(UserProfileFacade);

  itemSelectorFacade = inject(ItemSelectorFacade);

  searchTradeService = inject(SearchTradeService);
    sortService = inject(SortService);

  http = inject(HttpClient);
  customizableItem!: Item;
  allItems: Item[] = [];
  itemsFrom: Item[] = [];
  baseInventoryItems: Item[] = [];
  
  selectedItems: Item[] = [];
  visible = false;
  editorVisible = false;
  customizeVisible = false;
  offset = 0;
  limit = 25;
  isLoading = false;
  
  hasMoreItems = true;
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

    this.itemSelectorFacade.itemsFavourite$.subscribe(res => {
      console.log(res);
      this.selectedItems = res;
    });
  }
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
  loadItems(searchTerm?: string): Observable<Item[]> {
    const params = searchTerm
      ? `?searchterm=${encodeURIComponent(searchTerm)}`
      : '';
    return this.http.get<Item[]>(
      `${environment.MICROSERVICE_URL}/api/items${params}`
    );
  }
  trackByFn(index: number, item: Item) {
    return item?.defindex || index;
  }
  isItemDisabled(item: Item): boolean {
    return this.itemSelectorFacade.isFavouriteItemSelected(item);
  }
  onItemSelect(item: Item): void {
    this.itemSelectorFacade.itemsFavourite$.pipe(
      map(
        itemsToTrade =>
          !!itemsToTrade &&
          itemsToTrade.some(selected => selected.id === item.id)
      )
    );
    console.log(this.selectedItemIds);
    this.selectedItemIds.add(item.id);
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
  setFavouriteItems() {
    this.userDataFacade.saveFavouriteItems();
  }
  closeOnModification(item: Item) {
    const selectedIndex = this.selectedItems.findIndex((i) => i.id === this.customizableItem.id) ;
    if (selectedIndex !== null && selectedIndex >= 0) {
      this.selectedItems[selectedIndex] = { ...item };
    }
    this.visible = false;
  }
  onDialogClose() {
    this.editorVisible = false;
    this.visible = false;
  }
  handleFilterSearch(searchTerm: string) {
    this.filterText = searchTerm;
    this.filterSubject.next(searchTerm);
  }
  onCustomizeItem(item: Item) {
    this.customizableItem = item;
    this.customizeVisible = true;
    this.visible = true;
    console.log(this.visible);
  }

}
