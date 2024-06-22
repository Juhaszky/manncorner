import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  filterText$: Subject<string> = new Subject<string>();
  constructor() {}
}
