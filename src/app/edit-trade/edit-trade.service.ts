import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditTradeService {
  filterText$: BehaviorSubject<string> = new BehaviorSubject<string>(
    localStorage.getItem('editFilterText') || ''
  );

  setFilterText(val: string) {
    localStorage.setItem('editFilterText', val);
    this.filterText$.next(val);
  }
}
