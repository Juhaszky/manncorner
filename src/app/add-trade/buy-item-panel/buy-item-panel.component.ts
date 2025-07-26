import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ItemSelectorFacade } from '../../../shared/item-selector/item-selector.facade';
import { DialogModule } from 'primeng/dialog';
import { ItemEditorComponent } from '../../../shared/item-editor/item-editor.component';
import { ItemContainerComponent } from '../../../shared/item/item-container.component';
import { CommonModule } from '@angular/common';
import { Item } from '../../../shared/models/item.model';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClient } from '@angular/common/http';
import { ItemCustomizerComponent } from '../../../shared/item-customizer/item-customizer.component';

@Component({
  selector: 'app-buy-item-panel',
  standalone: true,
  imports: [
    DialogModule,
    ItemEditorComponent,
    ItemCustomizerComponent,
    ItemContainerComponent,
    CommonModule,
    TooltipModule
  ],
  templateUrl: './buy-item-panel.component.html',
  styleUrl: './buy-item-panel.component.scss',
})
export class BuyItemPanelComponent implements OnInit {
  @Output() itemAdd = new EventEmitter<Item>();
  @Output() itemRemove = new EventEmitter<Item>();
  allItems: Item[] = [];
  selectedItems: Item[] = [];
  customizableItem!: Item;
  http = inject(HttpClient);
  visible = false;
  editorVisible = false;
  customizeVisible = false;

  constructor(public itemSelectorFacade: ItemSelectorFacade) {}

  ngOnInit(): void {
    this.loadItems();
    this.itemSelectorFacade.itemsForTrade$.subscribe((res) => {
      this.selectedItems = res;
    });
  }
  loadItems(): void {
    this.http
      .get<Item[]>(`http://localhost:3000/api/items`)
      .subscribe((res: Item[]) => {
        this.allItems = res;
      });
  }

  onDialogClose() {
    this.editorVisible = false;
    this.visible = false;
  }

  trackByFn(index: number, item: Item) {
    return item?.id || index;
  }

  onOpenItemEditor() {
    this.editorVisible = true;
    this.visible = true;
  }
  onRemoveItem(item: Item) {
    this.itemSelectorFacade.onRemoveBaseItem(item);
    
  }
  onCustomizeItem(item: Item) {
    this.customizableItem = item;
    this.customizeVisible = true;
    this.visible = true;
  }
}
