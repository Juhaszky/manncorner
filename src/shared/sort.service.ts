import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from './models/item.model';
import { SortCriteria } from './models/enums/sort.enum';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  private sortCriteriaSubject = new BehaviorSubject<SortCriteria>(SortCriteria.QUALITY);
  sortCriteria$ = this.sortCriteriaSubject.asObservable();
  setSortCriteria(criteria: SortCriteria) {
    this.sortCriteriaSubject.next(criteria);
  }
  getCurrentSortCriteria(): SortCriteria {
    return this.sortCriteriaSubject.value;
  }
  sortItems(items: Item[], criteria: SortCriteria): Item[] {
    if (criteria === SortCriteria.NAME) {
      return items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === SortCriteria.QUALITY) {
      return items.sort((a, b) => a.quality - b.quality);
    }

    return items;
  }
}
