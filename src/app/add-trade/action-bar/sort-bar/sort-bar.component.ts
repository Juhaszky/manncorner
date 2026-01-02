import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { SortService } from '../../../../shared/sort.service';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { SortCriteria } from '../../../../shared/models/enums/sort.enum';
import { Popover, PopoverModule } from 'primeng/popover';
import { Checkbox } from 'primeng/checkbox';

import { ItemExtrasService } from '../../../../shared/item-extras.service';

@Component({
  standalone: true,
  imports: [MenuModule, PopoverModule, Checkbox],
  selector: 'sort-bar',
  templateUrl: './sort-bar.component.html',
  styleUrl: './sort-bar.component.scss',
})
export class SortBarComponent implements OnInit {
  sortService = inject(SortService);
  itemExtrasService = inject(ItemExtrasService);
  @ViewChild('overlay') overlayPanel!: Popover;
  items: MenuItem[] = [];
  qualityOptions: { label: string; value: number; checked: boolean }[] = [];
  sort(by: SortCriteria): void {
    this.sortService.setSortCriteria(by);
  }
  ngOnInit(): void {
    const qualities = this.itemExtrasService.getAllQualities();
    this.qualityOptions = Object.entries(qualities).map(([key, value]) => ({
      label: key,
      value,
      checked: false,
    }));
  }
  qualitySubmenuVisible = false;
  classSubmenuVisible = false;

  classOptions = [
    { label: 'Scout', checked: false },
    { label: 'Soldier', checked: false },
    { label: 'Pyro', checked: false },
    { label: 'Demmoman', checked: false },
    { label: 'Heavy', checked: false },
    { label: 'Engineer', checked: false },
    { label: 'Medic', checked: false },
    { label: 'Sniper', checked: false },
    { label: 'Spy', checked: false },
  ];

  sortOptions = [
    { label: 'Quality', value: SortCriteria.QUALITY, checked: false },
    { label: 'Name', value: SortCriteria.NAME, checked: false },
  ];
  toggleOverlay(event: Event) {
    this.overlayPanel.toggle(event);
  }

  onQualityChange(option: { label: string; checked: boolean }, event: any) {
    option.checked = event.checked;
  }

  onClassChange(option: { label: string; checked: boolean }, event: any) {
    option.checked = event.checked;
  }
  onSortChange(option: { label: string; checked: boolean }, event: any) {
    option.checked = event.checked;
    const selectedValues = this.sortOptions
      .filter(o => o.checked)
      .map(o => o.value);
    this.sortService.setSortCriteria(selectedValues[0]);
  }
}
