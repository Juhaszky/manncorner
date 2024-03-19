import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ItemSelectorService } from '../item-selector.service';

@Component({
  selector: 'item-selector',
  standalone: true,
  imports: [MatTooltipModule, CommonModule],
  templateUrl: './item-selector.component.html',
  styleUrl: './item-selector.component.scss',
})
export class ItemSelectorComponent implements OnInit, AfterViewInit {
  @Input() mode!: 'inventory' | 'toTrade';
  items: any[] = [];

  constructor(private itemService: ItemSelectorService) {}

  ngOnInit(): void {
    if (this.mode === 'inventory') {
      this.itemService
        .fetchItems()
        .subscribe((items: any) => (this.items = items));
    } else {
      this.itemService
        .getItemsToTrade()
        .subscribe((items: any) => (this.items = items));
    }
  }
  ngAfterViewInit(): void {
    //this.mouseDown$ = fromEvent(this.item.nativeElement, 'mousedown');
  }

  onItemSelect(idx: number) {
    if (this.mode === 'inventory') {
      this.itemService.moveItemToTrade(idx);
    } else {
      this.itemService.moveItemToInventory(idx);
    }
  }
}
