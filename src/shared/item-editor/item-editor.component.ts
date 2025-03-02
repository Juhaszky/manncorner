import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ItemSelectorService } from '../item-selector.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ItemListViewComponent } from './item-list-view/item-list-view.component';
import { first } from 'rxjs';
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
    ]
})
export class ItemEditorComponent implements OnInit {
  tooltip = '';
  left = 0;
  top = 0;
  selectedItems: any[] = [];
  selected!: any;
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  filteredOptions!: any[];
  constructor(
    private itemService: ItemSelectorService
  ) {}
  myControl = new FormControl('');
  options: any;
  ngOnInit(): void {
    this.itemService.itemState$
      .pipe(first())
      .subscribe((state) => (this.options = state.allItems));
    //this.options = this.itemService.getAllItems().getValue();
    console.log(this.options);
    this.filteredOptions = this.options.slice();
  }
  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.options.filter((o: any) =>
      o.name.toLowerCase().includes(filterValue)
    );
  }
  onSelect(event: any) {
    if (event.source.value) {
      const itemCopy = {...event.source.value}
        this.selectedItems.push(itemCopy);
    }

    this.myControl.setValue('');
  }
  onClose() {
    
  }
}
