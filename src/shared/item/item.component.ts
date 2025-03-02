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
import { ItemDetailsComponent } from '../item-details/item-details.component';
import { ItemCustomizerComponent } from '../item-customizer/item-customizer.component';
import { getItemBorderStyle } from '../../app/common/utils';
import { Router, RouterModule } from '@angular/router';
import { ItemForm } from '../models/itemForm.model';
import { ModifiedItemData } from '../models/modifiedItem.model';
import { ItemExtrasService } from '../item-extras.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    standalone: true,
    selector: 'item',
    imports: [
        ResizedImageComponent,
        CommonModule,
        RouterModule,
        TooltipModule
    ],
    templateUrl: './item.component.html',
    styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit {
  @Input() itemData!: ModifiedItemData;
  @Input() mode: string = '';
  @Output() removeEmitter = new EventEmitter();
  canModify: boolean = false;
  showActions: boolean = false;
  borderStyle: string = '';
  effectUrl: string = '';
  @HostListener('mouseenter') onMouseEnter() {
    this.canModify = this.mode === 'allItems';
    this.showActions = this.mode !== 'inventory' && this.mode !== '';
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.showActions = false;
    this.canModify = false;
  }

  constructor( private router: Router, private itemExtrasService: ItemExtrasService) {}

  ngOnInit(): void {
    this.initializeEffectUrl();
    this.checkItemExtras();
    this.updateBorderStyle();
  }

  onItemSelect() {
    if (this.shouldOpenDetails()) {
      this.openItemDetails();
    }
  }

  onCustomizeItem(event: Event) {
    event.stopPropagation();

    if (this.mode === 'inventory') return;
    this.resetItemName();
    1;
    this.openItemCustomizer();
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
      descriptions.forEach((desc) => {
        if (desc.value.includes('Halloween')) {
          this.itemData.spell = desc.value;
        } else if (desc.value.includes('Killstreaker')) {
          if (this.itemData.killstreaker) {
            this.itemData.killstreaker.killstreaker = desc.value;
          }
        } else if (desc.value.includes('Sheen')) {
          if (this.itemData.killstreaker) {
            this.itemData.killstreaker.sheen = desc.value;
          }
        }
      });
    }
  }

  private resetItemName(): void {
    if (this.itemData.originalName) {
      this.itemData.name = this.itemData.originalName;
    }
  }

  private updateBorderStyle(): void {
    this.borderStyle = getItemBorderStyle(this.itemData);
  }

  private shouldOpenDetails(): boolean {
    return (
      !['inventory', 'allItem'].includes(this.mode) &&
      !this.router.url.includes('home')
    );
  }
  private openItemDetails(): void {
    // this.dialog.open(ItemDetailsComponent, {
    //   width: '90vw',
    //   height: '90vh',
    //   data: this.itemData,
    // });
  }
  private updateItemData(item: ItemForm): void {
    this.itemData.name = item.name?.value;
    this.itemData.quality = item.quality?.value;
    this.itemData.effect = item.effect?.value;
    this.itemData.killstreaker = item.killstreaker?.value;
    if (item.killstreaker?.value) {
      const killstreaker = item.killstreaker?.value;
      this.itemData.killstreaker.killstreak = killstreaker.killstreak;
      this.itemData.killstreaker.sheen = killstreaker.sheen;
    }
  }

  private openItemCustomizer(): void {
    // const dialogRef = this.dialog.open(ItemCustomizerComponent, {
    //   width: '90vw',
    //   height: '90vh',
    //   data: this.itemData,
    // });

    // dialogRef.afterClosed().subscribe((item: ItemForm) => {
    //   if (item) {
    //     this.updateItemData(item);
    //     this.updateBorderStyle();
    //   }
    // });
  }

  private initializeEffectUrl(): void {
    if (this.itemData.effect) {
      const url = this.itemExtrasService.getItemEffectUrl(this.itemData.effect);
      this.effectUrl = url;
    }
  }
}
