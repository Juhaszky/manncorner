import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { AddTradeService } from '../../add-trade.service';
import { take } from 'rxjs';
import { SearchTradeService } from '../../../search-trade/search-trade.service';
import { OfferItemService } from '../../offer-item-selector/offer-item.service';
import { EditTradeService } from '../../../edit-trade/edit-trade.service';

@Component({
  standalone: true,
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements AfterViewInit {
  @Input() type: 'add-trade' | 'search-trade' | 'edit-trade' | 'offer-item' = 'add-trade';
  @ViewChild('searchBar') searchBar!: ElementRef;
  addTradeService = inject(AddTradeService);
  searchTradeService = inject(SearchTradeService);
  offerItemService = inject(OfferItemService);
  editTradeService = inject(EditTradeService);
  filterText = '';

  filterItems(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.type === "add-trade") {
      this.addTradeService.setFilterText(input.value);

    } else if (this.type === "search-trade") {
      this.searchTradeService.setFilterText(input.value);
    } else if (this.type === "offer-item") {
      this.offerItemService.setFilterText(input.value);
    } else if (this.type === "edit-trade") {
      this.editTradeService.setFilterText(input.value);
    }
  }

  ngAfterViewInit(): void {
    if (this.searchBar) {
      if (this.type === 'add-trade') {
        this.addTradeService.filterText$.pipe(take(1)).subscribe(value => {
          this.filterText = value;
          this.searchBar.nativeElement.value = value;
        });
      } else if (this.type === 'search-trade') {
        this.searchTradeService.filterText$.pipe(take(1)).subscribe(value => {
          this.filterText = value;
          this.searchBar.nativeElement.value = value;
        });
      }
    }
  }
}
