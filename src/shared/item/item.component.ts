import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { ResizedImageComponent } from '../resized-image/resized-image.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { Item } from '../models/item.model';
import { showQuantity } from '../../app/common/utils';

@Component({
  standalone: true,
  selector: 'app-item',
  imports: [ResizedImageComponent, CommonModule, RouterModule, TooltipModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
})
export class ItemComponent {
  @Input() itemData!: Item;

  @Output() customizeEmitter = new EventEmitter<void>();
  @Output() removeEmitter = new EventEmitter<Item>();
  @Output() detailsEmitter = new EventEmitter<Item>();
  @Output() selectEmitter = new EventEmitter<Item>();
  @Input() disabled = false;
  @Input() canModify = false;
  @Input() canDelete = false;
  @Input() showQuantity = false;
  @Input() borderStyle = '';
  @Input() effectUrl!: string | null;
  showActions = false;
  showQuantityFn = showQuantity;

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
}
