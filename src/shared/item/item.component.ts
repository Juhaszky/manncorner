import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ResizedImageComponent } from '../resized-image/resized-image.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { Item } from '../models/item.model';
import { showQuantity } from '../../app/common/utils';
import { ContextMenuModule } from 'primeng/contextmenu';

@Component({
  standalone: true,
  selector: 'app-item',
  imports: [
    ResizedImageComponent,
    CommonModule,
    RouterModule,
    TooltipModule,
    ContextMenuModule,
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
})
export class ItemComponent implements OnInit {
  @Input() itemData!: Item;

  @Output() customizeEmitter = new EventEmitter<void>();
  @Output() removeEmitter = new EventEmitter<Item>();
  @Output() detailsEmitter = new EventEmitter<Item>();
  @Output() selectEmitter = new EventEmitter<Item>();
  @Output() touchEmitter = new EventEmitter<Item>();
  @Output() backpacktfEmitter: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() contextMenuEmitter: EventEmitter<{ item: Item, event: MouseEvent }> = new EventEmitter<{ item: Item, event: MouseEvent }>();

  @Input() disabled = false;
  @Input() canModify = false;
  @Input() canDelete = false;
  @Input() showQuantity = false;
  @Input() borderStyle = '';
  @Input() effectUrl!: string | null;
  showActions = false;
  showQuantityFn = showQuantity;

  ngOnInit(): void {
    if (this.showQuantity && this.canModify) {
      this.itemData.quantity = this.itemData.quantity ?? 1;
    }
  }

  onQuantityChange(event: any) {
    const quantity = parseInt(event.target.value, 10) || 1;
    this.itemData.quantity = quantity;
  }
  @HostListener('mouseenter') onMouseEnter() {
    this.showActions = this.canDelete || this.canModify;
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.showActions = false;
  }

  onItemSelect() {
    if (!this.disabled) {
      this.selectEmitter.emit();
    }
  }
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuEmitter.emit({ item: this.itemData, event });
  }
}
