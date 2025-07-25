import { Component, inject, OnInit } from '@angular/core';
import { SortService } from '../../../../shared/sort.service';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
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
  sort(by: "quality" | "name") : void {
    this.sortService.setSortCriteria(by);
  }
  ngOnInit(): void {
    this.items = [
      { label: 'Quality', command: () => this.sort('quality') },
      { label: 'Name', command: () => this.sort('name') }
    ];
  }
}
