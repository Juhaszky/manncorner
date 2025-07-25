import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { AddTradeService } from '../../add-trade.service';
import { take } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements AfterViewInit {
  @ViewChild('searchBar') searchBar!: ElementRef;
  addTradeService = inject(AddTradeService);
  filterText = '';

  filterItems(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.addTradeService.setFilterText(input.value);
  }

  ngAfterViewInit(): void {
    if (this.searchBar) {
      this.searchBar.nativeElement.value = this.filterText;
      this.addTradeService.filterText$.pipe(take(1)).subscribe(value => {
        this.filterText = value;
        this.searchBar.nativeElement.value = value;
      });
    }
  }
}
