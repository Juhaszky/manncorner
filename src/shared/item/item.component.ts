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
import { ItemForm } from '../models/itemForm.model';
import { TooltipModule } from 'primeng/tooltip';
import { Item } from '../models/item.model';

@Component({
  standalone: true,
  selector: 'app-item',
  imports: [
    ResizedImageComponent,
    CommonModule,
    RouterModule,
    TooltipModule
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent {
  @Input() itemData!: Item;
  @Input() itemImgUrl = '';
  @Input() disabled = false;
  @Input() mode = '';
  @Output() customizeEmitter = new EventEmitter();
  @Output() removeEmitter = new EventEmitter();
  @Output() detailsEmitter = new EventEmitter();
  @Output() selectEmitter = new EventEmitter();
  canModify = false;
  showActions = false;
  @Input() borderStyle = '';
  @Input() effectUrl = '';
  
  @HostListener('mouseenter') onMouseEnter() {
    this.canModify = this.mode === 'allItems';
    this.showActions = this.mode !== 'inventory' && this.mode !== '';
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.showActions = false;
    this.canModify = false;
  }
  onItemSelect() {
    this.selectEmitter.emit();
  }

  onCustomizeItem(event: Event) {
    event.stopPropagation();
    this.customizeEmitter.emit();
    if (this.mode === 'inventory') return;

    this.openItemCustomizer();
  }

  onRemoveItem(): void {
    console.log(this.itemData);
    this.removeEmitter.emit(this.itemData);
  }

  private openItemDetails(): void {
    this.detailsEmitter.emit();
    //TODO handle dialog
    // this.dialog.open(ItemDetailsComponent, {
    //   width: '90vw',
    //   height: '90vh',
    //   data: this.itemData,
    // });
  }

  //TODO handle refreshing item after customize
  private updateItemData(item: ItemForm): void {
    // this.itemData.name = item.name?.value;
    // this.itemData.quality = item.quality?.value;
    // this.itemData.effect = item.effect?.value;
    // this.itemData.killstreaker = item.killstreaker?.value;
    // if (item.killstreaker?.value) {
    //   const killstreaker = item.killstreaker?.value;
    //   this.itemData.killstreaker.killstreak = killstreaker.killstreak;
    //   this.itemData.killstreaker.sheen = killstreaker.sheen;
    // }
  }

  //TODO handle dialog
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
}
