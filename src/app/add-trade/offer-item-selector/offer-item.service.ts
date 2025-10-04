import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OfferItemService {
  filterText$: BehaviorSubject<string> = new BehaviorSubject<string>(
    localStorage.getItem('offerFilterText') || ''
  );

  setFilterText(val: string) {
    localStorage.setItem('offerFilterText', val);
    this.filterText$.next(val);
  }
}
