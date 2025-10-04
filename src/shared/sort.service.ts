import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from './models/item.model';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  private sortCriteriaSubject = new BehaviorSubject<'quality' | 'name'>(
    'quality'
  );
  sortCriteria$ = this.sortCriteriaSubject.asObservable();
  setSortCriteria(criteria: 'quality' | 'name') {
    this.sortCriteriaSubject.next(criteria);
  }
  getCurrentSortCriteria(): 'quality' | 'name' {
    return this.sortCriteriaSubject.value;
  }
  sortItems(items: Item[], criteria: 'quality' | 'name'): Item[] {
    if (criteria === 'name') {
      return items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === 'quality') {
      return items.sort((a, b) => a.quality - b.quality);
    }

    return items;
  }
}
