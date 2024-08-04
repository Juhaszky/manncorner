import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResizedImageComponent } from '../resized-image/resized-image.component';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ItemDetailsComponent } from '../item-details/item-details.component';
import { ItemCustomizerComponent } from '../item-customizer/item-customizer.component';
import { getItemBorderStyle } from '../../app/common/utils';

@Component({
  selector: 'item',
  standalone: true,
  imports: [MatTooltipModule, ResizedImageComponent, CommonModule],

  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
})
export class ItemComponent implements OnInit {
  @Input() itemData: any;
  @Input() mode: string = '';
  @Output() removeEmitter = new EventEmitter();
  @HostListener('mouseenter') onMouseEnter() {
    if (this.mode === 'allItems') {
      this.canModify = true;
    }
    if (this.mode !== 'inventory' && this.mode !== '') {
      this.showActions = true;
    }
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.showActions = false;
    this.canModify = false;
  }
  canModify: boolean = false;
  showActions: boolean = false;
  borderStyle: string = '';
  effectUrl: string = '';

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.itemData.effect) {
      this.effectUrl = `/assets/images/effects/${this.itemData.effect}.webp`;
    }
    this.checkItemExtras();
    this.borderStyle = getItemBorderStyle(this.itemData);
  }

  onItemSelect() {
    if (this.mode === 'inventory' || this.mode === 'allItem') return;
    this.dialog.open(ItemDetailsComponent, {
      width: '90vw',
      height: '90vh',
      data: this.itemData,
    });
  }

  onCustomizeItem(event: any) {
    event.stopPropagation();

    if (this.mode === 'inventory') return;
    if (this.itemData.originalName) {
      this.itemData.name = this.itemData.originalName;
    }
    const dialogRef = this.dialog.open(ItemCustomizerComponent, {
      width: '90vw',
      height: '90vh',
      data: this.itemData,
    });
    dialogRef.afterClosed().subscribe((item: any) => {
      if (item) {
        this.itemData.name = item.name?.value;
        this.itemData.quality = item.quality?.value;
        this.itemData.effect = item.effect?.value;
        this.itemData.killstreaker = item.killstreaker?.value;
        this.itemData.killstreak = item.killstreak?.value;
        this.itemData.sheen = item.sheen?.value;
        this.updteBorderStyle();
      }
    });
  }

  onRemoveItem(): void {
    this.removeEmitter.emit(this.itemData);
  }

  getImageUrl(): string {
    const itemsUrl =
      this.itemData.imageUrl ??
      this.itemData.icon_url ??
      this.itemData.image_url;
    if (!itemsUrl) {
      return '';
    }
    return itemsUrl
      ? itemsUrl.startsWith('http')
        ? itemsUrl
        : `https://steamcommunity-a.akamaihd.net/economy/image/${itemsUrl}`
      : '';
  }

  private checkItemExtras() {
    if (this.itemData.descriptions && this.itemData.descriptions.length > 0) {
      const descriptions = this.itemData.descriptions;
      descriptions.forEach((desc: any) => {
        if (desc.value.includes('Halloween')) {
          this.itemData.spell = desc.value;
        } else if (desc.value.includes('Killstreaker')) {
          this.itemData.killstreaker = desc.value;
        } else if (desc.value.includes('Sheen')) {
          this.itemData.sheen = desc.value;
        }
      });
    }
  }
  private updteBorderStyle(): void {
    this.borderStyle = getItemBorderStyle(this.itemData);
  }
}
