import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { StrangeItemStatWithItemDto } from '../../../../shared/models/strangeItemStatHistory.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-bar',
  imports: [ListboxModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent implements OnInit, OnChanges {
  @Input() statWihItemsHistories: StrangeItemStatWithItemDto[] = [];
  @Output() selectEmitter = new EventEmitter<
    { name: string; img: string; code: string }[]
  >();
  cdr = inject(ChangeDetectorRef);
  selectedItems: { name: string; img: string; code: string }[] = [];
  MAX_SELECTION = 15;
  items: { name: string; code: string }[] = [];
  ngOnInit(): void {
    this.items = this.statWihItemsHistories.map(h => ({
      name: h.item.name,
      img: h.item.img,
      code: h.item.id,
    }));
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['statWihItemsHistories'] && this.statWihItemsHistories) {
      this.items = [...this.getUniqueItems(this.statWihItemsHistories)];
      this.cdr.detectChanges();
    }
  }
  handleSelectionChange(event: any) {
    if (event.value.length > this.MAX_SELECTION) {
      this.selectedItems = event.value.slice(0, this.MAX_SELECTION);
      this.selectEmitter.emit(this.selectedItems);
    } else {
      const selections = event.value as {
        name: string;
        img: string;
        code: string;
      }[];
      this.selectedItems = selections;
    }
    this.selectEmitter.emit(this.selectedItems);
  }
  private getUniqueItems(
    items: StrangeItemStatWithItemDto[]
  ): { name: string; code: string }[] {
    const map = new Map<string, { name: string; img: string; code: string }>();
    for (const item of items) {
      const id = item.item.id;
      if (!map.has(id)) {
        map.set(id, { name: item.item.name, img: item.item.img, code: id });
      }
    }
    return Array.from(map.values());
  }
}
