
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ItemSelectorFacade } from '../../../shared/item-selector/item-selector.facade';
import { ItemContainerComponent } from '../../../shared/item/item-container.component';
import {
  fromEvent,
  map,
  take,
  combineLatest,
  first,
  BehaviorSubject,
  switchMap,
  catchError,
  of,
  debounceTime,
} from 'rxjs';
import { Item } from '../../../shared/models/item.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserProfileFacade } from '../../user-profile/user-profile.facade';
import { AddTradeService } from '../add-trade.service';
import { SortService } from '../../../shared/sort.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Component({
  standalone: true,
  selector: 'app-inventory-items-selector',
  imports: [ItemContainerComponent, ProgressSpinnerModule],
  templateUrl: './inventory-items-selector.component.html',
  styleUrl: './inventory-items-selector.component.scss',
})
export class InventoryItemsSelectorComponent implements AfterViewInit, OnInit {
  @Input() mode!: 'inventory' | 'toTrade' | 'allItems' | 'offer';
  @Input() filter = '';
  @Output() itemAdd = new EventEmitter<Item>();
  @ViewChild('inventorySelector') inventorySelectorEl!: ElementRef;
  @Output() lazyLoadEmitter = new EventEmitter<{
    first: number;
    row: number;
  }>();
  filterText$: BehaviorSubject<string> = new BehaviorSubject<string>(
    localStorage.getItem('filterText') || ''
  );
  http = inject(HttpClient);
  items: Item[] = [];
  allItems: Item[] = [];
  selectedItemIds = new Set<string>();
  disabled = false;
  constructor(
    public itemSelectorFacade: ItemSelectorFacade,
    private addTradeService: AddTradeService,
    private sortService: SortService,
    private userDataFacade: UserProfileFacade
  ) {}
  ngOnInit(): void {
    this.userDataFacade.userData$.pipe(first()).subscribe(res => {
      if (res?.steamid) {
        this.itemSelectorFacade.loadItemsLazy(0, 100, res.steamid);
      } else {
        console.error('No steamId found');
      }
    });
    this.itemSelectorFacade.itemsToTrade$.subscribe(selectedItems => {
      selectedItems.forEach(item => {
        if (item.id) {
          this.selectedItemIds.add(item.id);
        }
      });
    });
    this.itemSelectorFacade.items$.subscribe(items => {
      this.items = items;
    });
    combineLatest([
      this.addTradeService.filterText$,
      this.sortService.sortCriteria$,
      this.userDataFacade.userData$,
    ])
      .pipe(
        debounceTime(500),
        switchMap(([filterText, sortCriteria, userData]) => {
          const trimmed = filterText.trim();
          if (trimmed.length === 0) {
            return this.itemSelectorFacade.items$.pipe(
              map(items => this.sortService.sortItems(items, sortCriteria))
            );
          }
          return this.http
            .get<
              Item[]
            >(`${environment.API_URL}/items/search?searchString=${filterText}&userId=${userData.steamid}`)
            .pipe(
              catchError(() => of([])),
              map(items => this.sortService.sortItems(items, sortCriteria))
            );
        })
      )
      .subscribe(filteredSorted => {
        this.items = filteredSorted;
      });
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
        if (this.filter && this.filter.trim() !== '') {
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
  onItemSelect(item: Item): void {
    this.itemAdd.emit(item);
    this.itemSelectorFacade.itemsToTrade$.pipe(
      map(
        itemsToTrade =>
          !!itemsToTrade &&
          itemsToTrade.some(selected => selected.id === item.id)
      )
    );
    this.selectedItemIds.add(item.id);
  }
  isItemDisabled(item: Item): boolean {
    return this.itemSelectorFacade.isItemSelected(item);
  }
  handleSelectEmitter(item: Item) {
    this.itemSelectorFacade.onAddItem(item);

    // this.itemSelectorFacade.onOfferItem(item);
  }
  trackByFn(index: number, item: Item) {
    return item?.defindex || index;
  }
}
