import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ItemComponent } from './item.component';
import { ItemFacade } from './item.facade';
import { ItemSelectorFacade } from '../item-selector/item-selector.facade';
import { Item } from '../models/item.model';
import { ItemService } from './item.service';
import { ContextMenuService } from '../../app/context-menu.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MobileItemDetailsComponent } from '../mobile-item-details/mobile-item-details.component';
@Component({
  selector: 'app-item-container',
  imports: [ItemComponent],
  templateUrl: './item-container.component.html',
})
export class ItemContainerComponent implements OnChanges {
  @Input() item!: Item;

  @Input() disabled = false;
  @Input() canDelete = false;
  @Input() canModify = false;
  @Input() showQuantity = false;
  @Input() showDialog = false;
  @Output() selectEmitter: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() removeEmitter: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() customizeEmitter: EventEmitter<Item> = new EventEmitter<Item>();
  facade = inject(ItemFacade);
  itemService = inject(ItemService);
  itemSelectorFacade = inject(ItemSelectorFacade);
  contextMenuService = inject(ContextMenuService);
  dialogService = inject(DialogService);
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.item) {
      this.facade.checkItemExtras(this.item);
    }
  }
  handleMobileTouch(e: any) {
    if(!this.showDialog) return;
    this.selectEmitter.emit(this.item)
    this.dialogService.open(MobileItemDetailsComponent, {
      data: { item: this.item },
      header: 'Item Details',
      width: '90%',
      closable: true
    })
    this.itemService.setShowItemDetails();
  }
}
