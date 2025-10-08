import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  ViewChild,
  Output,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import {
  combineLatest,
  map,
  take,
  fromEvent,
  first,
  debounceTime,
  switchMap,
  catchError,
  of,
} from 'rxjs';
import { ItemSelectorFacade } from '../../../shared/item-selector/item-selector.facade';
import { Item } from '../../../shared/models/item.model';
import { SortService } from '../../../shared/sort.service';
import { UserProfileFacade } from '../../user-profile/user-profile.facade';
import { CommonModule } from '@angular/common';
import { ItemContainerComponent } from '../../../shared/item/item-container.component';
import { ProgressSpinner } from 'primeng/progressspinner';
import { OfferItemService } from './offer-item.service';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-offer-item-selector',
  imports: [CommonModule, ItemContainerComponent, ProgressSpinner],
  templateUrl: './offer-item-selector.component.html',
  styleUrl: './offer-item-selector.component.scss',
})
export class OfferItemSelectorComponent implements OnInit, AfterViewInit {
  @Input() mode!: 'inventory' | 'toTrade' | 'allItems' | 'offer';
  @Input() filter = '';
  @Output() itemAdd = new EventEmitter<Item>();
  @ViewChild('inventorySelector') inventorySelectorEl!: ElementRef;
  @Output() lazyLoadEmitter = new EventEmitter<{
    first: number;
    row: number;
  }>();
  items: Item[] = [];
  selectedItemIds = new Set<string>();
  disabled = false;
  constructor(
    public itemSelectorFacade: ItemSelectorFacade,
    private offerItemService: OfferItemService,
    private sortService: SortService,
    private userDataFacade: UserProfileFacade,
    private http: HttpClient
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
    this.itemSelectorFacade.items$.subscribe(i => (this.items = i));
    combineLatest([
      this.offerItemService.filterText$,
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
    return this.itemSelectorFacade.isOfferItemSelected(item);
  }
  handleSelectEmitter(item: Item) {
    if (this.mode === 'inventory') {
      this.itemSelectorFacade.onAddItem(item);
    } else if (this.mode === 'offer') {
      this.itemSelectorFacade.onOfferItem(item);
    }
  }
}
