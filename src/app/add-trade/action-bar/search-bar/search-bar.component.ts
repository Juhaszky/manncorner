import {
  afterNextRender,
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { AddTradeService } from '../../add-trade.service';


@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements AfterViewInit {
  @ViewChild('searchBar') searchBar!: ElementRef;
  addTradeService = inject(AddTradeService);
  filterText: string = '';

  constructor() {
    afterNextRender(() => {
      this.filterText = localStorage.getItem('filterText')?.toString() || '';
      this.searchBar.nativeElement.value = this.filterText;
      this.addTradeService.filterText$.next(this.filterText);
    });
  }

  filterItems(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filterText = input.value;
    localStorage.setItem('filterText', this.filterText);
    this.addTradeService.filterText$.next(this.filterText);
  }

  ngAfterViewInit(): void {
    if (this.searchBar) {
      this.searchBar.nativeElement.value = this.filterText;
    }
  }
}
