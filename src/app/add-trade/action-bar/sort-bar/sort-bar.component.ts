import { Component, inject } from '@angular/core';
import { SortService } from '../../../../shared/sort.service';

@Component({
  standalone: true,
    selector: 'sort-bar',
    templateUrl: './sort-bar.component.html',
    styleUrl: './sort-bar.component.scss'
})
export class SortBarComponent {
  sortService = inject(SortService);
  sort(by: "quality" | "name") : void {
    this.sortService.setSortCriteria(by);
  }
}
