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
import { debounceTime, Subject } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-buy-item-panel',
  standalone: true,
  imports: [
    DialogModule,
    ItemEditorComponent,
    ItemCustomizerComponent,
    ItemContainerComponent,
    CommonModule,
    TooltipModule,
  ],
  templateUrl: './buy-item-panel.component.html',
  styleUrl: './buy-item-panel.component.scss',
})
export class BuyItemPanelComponent implements OnInit {
  @Output() itemAdd = new EventEmitter<Item>();
  @Output() itemRemove = new EventEmitter<Item>();
  private filterSubject = new Subject<string>();
  allItems: Item[] = [];
  selectedItems: Item[] = [];
  customizableItem!: Item;
  http = inject(HttpClient);
  visible = false;
  editorVisible = false;
  customizeVisible = false;

  constructor(public itemSelectorFacade: ItemSelectorFacade) {}

  ngOnInit(): void {
    this.filterSubject.pipe(debounceTime(100)).subscribe(filterText => {
      this.loadItems(filterText);
    });
    this.loadItems();
    this.itemSelectorFacade.itemsForTrade$.subscribe(res => {
      this.selectedItems = res;
    });
  }
  loadItems(searchTerm?: string): void {
    const params = searchTerm
      ? `?searchterm=${encodeURIComponent(searchTerm)}`
      : '';
    this.http
      .get<Item[]>(`${environment.MICROSERVICE_URL}/api/items${params}`)
      .subscribe((res: Item[]) => {
        this.allItems = res;
      });
  }
  handleFilterSearch(searchTerm: string) {
    this.filterSubject.next(searchTerm);
  }

  onDialogClose() {
    this.editorVisible = false;
    this.visible = false;
  }

  trackByFn(index: number, item: Item) {
    return item?.defindex || index;
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
  closeOnModification() {
    this.visible = false;
  }
}
