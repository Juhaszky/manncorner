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
import { ItemDetailsDirective } from '../item-details/item-details.directive';
import { MatDialog } from '@angular/material/dialog';
import { ItemDetailsComponent } from '../item-details/item-details.component';
import { ItemCustomizerComponent } from '../item-customizer/item-customizer.component';

@Component({
  selector: 'item',
  standalone: true,
  imports: [
    MatTooltipModule,
    ResizedImageComponent,
    CommonModule,
    ItemDetailsDirective,
  ],

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

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.checkItemExtras();
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
    this.itemData.name = this.itemData.originalName;
    const dialogRef = this.dialog.open(ItemCustomizerComponent, {
      width: '90vw',
      height: '90vh',
      data: this.itemData,
    });
    dialogRef.afterClosed().subscribe((item: any) => {
      this.itemData.name = item.name.value;
      this.itemData.quality = item.quality.value;
    });
  }

  getItemBorderStyle(item: any): string {
    if (item?.name?.includes('Unusual')) {
      return 'unusual';
    } else if (item?.name?.includes('Strange')) {
      return 'strange';
    } else if (item?.name?.includes('Genuine')) {
      return 'genuine';
    } else if (item?.name?.includes('Haunted')) {
      return 'haunted';
    } else if (item?.name?.includes("Collector's")) {
      return 'collectors';
    } else if (item?.name?.includes('Vintage')) {
      return 'vintage';
    } else if (
      (item?.descriptions && item?.descriptions[0]?.value?.includes('Elite')) ||
      item?.descriptions?.value?.includes('Elite')
    ) {
      return 'elite';
    } else {
      return 'unique';
    }
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
}
