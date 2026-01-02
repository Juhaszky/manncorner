import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './item-editor.component.html',
  styleUrl: './item-editor.component.scss',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ItemListViewComponent,
    AutoCompleteModule,
    ButtonModule,
    MultiSelectModule
],
})
export class ItemEditorComponent implements OnInit, OnChanges {
  http = inject(HttpClient);
  facade = inject(ItemSelectorFacade);
  @Input() options: Item[] = [];
  @Output() confirmSelecion = new EventEmitter();
  @Output() filterSearch = new EventEmitter();
  @Output() closeDialog = new EventEmitter();

  selectedItems: Item[] = [];
  filteredOptions: Item[] = [];

  constructor(private itemSelectorFacade: ItemSelectorFacade, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // this.itemSelectorFacade.itemsForTrade$
    //   .pipe(take(1))
    //   .subscribe(savedItems => {
    //     this.selectedItems = savedItems
    //       .map(savedItem =>
    //         this.filteredOptions.find(
    //           opt => opt.defindex === savedItem.defindex
    //         )
    //       )
    //       .filter(item => item !== undefined) as Item[];
    //   });
    // this.filteredOptions = this.options;
  }
  onHandleFilter(event: { originalEvent: Event; filter: string }) {
    this.filterSearch.emit(event.filter);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['selectedItems']) {
      console.log(changes);
      this.cdr.markForCheck();
    }
    if (changes['options']) {
      this.filteredOptions = this.options ?? [];
      
    }
  }

  onConfirmSelection() {
    this.confirmSelecion.emit(this.selectedItems);
    this.closeDialog.emit(null);
  }
  onClose() {
    this.closeDialog.emit(null);
  }
}
