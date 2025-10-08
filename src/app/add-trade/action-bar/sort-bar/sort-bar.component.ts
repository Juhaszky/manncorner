import { Component, inject, OnInit } from '@angular/core';
import { SortService } from '../../../../shared/sort.service';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { SortCriteria } from '../../../../shared/models/enums/sort.enum';
@Component({
  standalone: true,
    imports: [MenuModule],
    selector: 'sort-bar',
    templateUrl: './sort-bar.component.html',
    styleUrl: './sort-bar.component.scss'
})
export class SortBarComponent implements OnInit{
  sortService = inject(SortService);
  items: MenuItem[] = [];
  sort(by: SortCriteria) : void {
    this.sortService.setSortCriteria(by);
  }
  ngOnInit(): void {
    this.items = [
      { label: 'Quality', command: () => this.sort(SortCriteria.QUALITY) },
      { label: 'Name', command: () => this.sort(SortCriteria.NAME) }
    ];
  }
}
