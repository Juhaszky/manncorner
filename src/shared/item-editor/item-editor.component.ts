import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ItemSelectorService } from '../item-selector.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ItemListViewComponent } from './item-list-view/item-list-view.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { StockTF2Item } from '../models/stockItem.model';
import { MultiSelectModule } from 'primeng/multiselect';
import { ItemSelectorFacade } from '../item-selector/item-selector.facade';
import { Item } from '../models/item.model';
@Component({
  standalone: true,
  selector: 'app-item-editor',
  templateUrl: './item-editor.component.html',
  styleUrl: './item-editor.component.scss',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    CommonModule,
    ItemListViewComponent,
    AutoCompleteModule,
    ButtonModule,
    MultiSelectModule,
  ],
})
export class ItemEditorComponent implements OnInit {
  tooltip = '';
  left = 0;
  top = 0;
  http = inject(HttpClient);
  facade = inject(ItemSelectorFacade);
  @Input() options: Item[] = [];
  @Output() lazyLoad = new EventEmitter<{
    query: string;
  }>();
  @Output() confirmSelecion = new EventEmitter();
  @Output() closeDialog = new EventEmitter();
  selectedItems: Item[] = [];

  myControl = new FormControl<Item[]>([]);
  filteredOptions: Item[] = [];

  constructor(private itemService: ItemSelectorService) {}

  ngOnInit(): void {
    console.log('ran');
    console.trace();
    this.myControl.valueChanges.subscribe((items: Item[] | null) => {
      console.log(items);
      if (items) {
        this.selectedItems = items;
      }
    });
    this.loadItemsLazy('');
  }
  loadItemsLazy(queryString: string): void {
    this.http
      .get<Item[]>(`http://localhost:3000/api/items?searchTerm=${queryString}`)
      .subscribe((res: Item[]) => {
        this.filteredOptions = res;
      });
  }

  filter(query: string): void {
    const lower = query?.toLowerCase() || '';
    this.filteredOptions = this.options.filter((o: any) =>
      o.name.toLowerCase().includes(lower)
    );
  }

  onConfirmSelection() {
    this.facade.onAddDefaultItem(this.selectedItems);
    this.closeDialog.emit(null);
    this.clearSelection();
  }
  clearSelection() {
    this.myControl.setValue([]);
    this.selectedItems = [];
  }

  onClose(): void {}
}
