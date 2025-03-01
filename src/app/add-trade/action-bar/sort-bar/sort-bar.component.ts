import { Component, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { SortService } from '../../../../shared/sort.service';

@Component({
    selector: 'sort-bar',
    imports: [MatMenuModule],
    templateUrl: './sort-bar.component.html',
    styleUrl: './sort-bar.component.scss'
})
export class SortBarComponent {
  sortService = inject(SortService);
  sort(by: "quality" | "name") : void {
    this.sortService.setSortCriteria(by);
  }
}
