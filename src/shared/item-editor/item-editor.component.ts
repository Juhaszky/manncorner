import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemSelectorService } from '../item-selector.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ItemListViewComponent } from './item-list-view/item-list-view.component';
import { first } from 'rxjs';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';

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
  ],
})
export class ItemEditorComponent implements OnInit {
  tooltip = '';
  left = 0;
  top = 0;
  @Input() options: any[] = [];
  @Output() lazyLoad = new EventEmitter<{
    query: string;
  }>();
  selectedItems: any[] = [];
  selected!: any;

  myControl = new FormControl('');
  filteredOptions: any[] = [];

  constructor(private itemService: ItemSelectorService) {}

  ngOnInit(): void {
    this.myControl.valueChanges.subscribe(value => this.filter(value ?? ''));
  }
  loadItemsLazy(event: { query: string }): void {
    this.lazyLoad.emit({
      query: event.query,
    });
  }
  onLazyLoadResponse(items: any[]) {
    this.filteredOptions = items;
  }
  filter(query: string): void {
    const lower = query?.toLowerCase() || '';
    this.filteredOptions = this.options.filter((o: any) =>
      o.name.toLowerCase().includes(lower)
    );
  }

  onSelect(item: any): void {
    this.selectedItems.push(item);
    console.log('Selected item:', item);

  }

  onClose(): void {
  }
}
