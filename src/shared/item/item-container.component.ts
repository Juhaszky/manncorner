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
import { TradeServiceFacade } from '../../app/add-trade/trade-service.facade';
import { ItemSelectorFacade } from '../item-selector/item-selector.facade';
import { Item } from '../models/item.model';
import { ItemService } from './item.service';
import { ContextMenuService } from '../../app/context-menu.service';
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
  @Output() selectEmitter: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() removeEmitter: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() customizeEmitter: EventEmitter<Item> = new EventEmitter<Item>();
  facade = inject(ItemFacade);
  itemService = inject(ItemService);
  itemSelectorFacade = inject(ItemSelectorFacade);
  tradeFacade = inject(TradeServiceFacade);
  contextMenuService = inject(ContextMenuService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.item) {
      this.facade.checkItemExtras(this.item);
    }
  }
  handleMobileTouch(e: any) {
    this.itemService.setShowItemDetails();
  }
}
