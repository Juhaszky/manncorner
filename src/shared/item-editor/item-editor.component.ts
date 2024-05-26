import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ItemSelectorService } from '../item-selector.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ItemListViewComponent } from './item-list-view/item-list-view.component';
import { MatIconModule } from '@angular/material/icon';
import { first, tap } from 'rxjs';
import { ItemState } from '../models/itemState.model';

@Component({
  selector: 'app-item-editor',
  standalone: true,
  templateUrl: './item-editor.component.html',
  styleUrl: './item-editor.component.scss',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatDialogClose,
    MatDialogActions,
    CommonModule,
    MatSelectModule,
    MatButtonModule,
    ItemListViewComponent,
    MatIconModule,
  ],
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
    private itemService: ItemSelectorService,
    public dialogRef: MatDialogRef<ItemEditorComponent>
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
    this.myControl.setValue('');
    this.selectedItems.push(event.source.value);
  }
  onClose() {
    this.dialogRef.close();
  }
}
