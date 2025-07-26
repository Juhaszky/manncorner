import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ItemSelectorService } from '../item-selector.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItemListViewComponent } from './item-list-view/item-list-view.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
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
    CommonModule,
    ItemListViewComponent,
    AutoCompleteModule,
    ButtonModule,
    MultiSelectModule,
  ],
})
export class ItemEditorComponent implements OnInit, OnChanges {
  http = inject(HttpClient);
  facade = inject(ItemSelectorFacade);
  @Input() options: Item[] = [];
  @Output() confirmSelecion = new EventEmitter();
  @Output() closeDialog = new EventEmitter();

  myControl = new FormControl<Item[]>([]);
  filteredOptions: Item[] = [];

  constructor(
    private itemService: ItemSelectorService,
    private itemSelectorFacade: ItemSelectorFacade
  ) {}

  ngOnInit(): void {
    this.itemSelectorFacade.itemsForTrade$.subscribe((items) => {
      this.myControl.setValue(items);
    })
    this.filteredOptions = this.options;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.filteredOptions = this.options ?? [];
    }
  }
  filter(query: string): void {
    const lower = query?.toLowerCase() || '';
    this.filteredOptions = this.options.filter((o: Item) =>
      o.name.toLowerCase().includes(lower)
    );
  }

  onConfirmSelection() {
    this.facade.onAddDefaultItem(this.myControl.value ?? []);
    this.closeDialog.emit(null);
  }
  onClose() {
    this.closeDialog.emit(null);
  }
}
