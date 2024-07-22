import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { ItemDetailsComponent } from '../item-details/item-details.component';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { StockItem } from '../models/stockItem.model';
import { Killstreak } from '../models/killstreak.model';
import { ItemQualityComponent } from './item-quality/item-quality.component';

@Component({
  selector: 'item-customizer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatChipsModule,
    CommonModule,
    MatExpansionModule,
    ItemQualityComponent,
  ],
  templateUrl: './item-customizer.component.html',
  styleUrl: './item-customizer.component.scss',
})
export class ItemCustomizerComponent implements OnInit {
  @Input() details!: StockItem;

  itemFormGroup: FormGroup = new FormGroup({
    name: new FormControl(''),
    quality: new FormControl([]),
    killstreak: new FormControl(null),
    craftable: new FormControl(true),
  });

  killstreaks: Killstreak[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: StockItem,
    public dialogRef: MatDialogRef<ItemDetailsComponent>
  ) {}

  ngOnInit(): void {
    this.details = this.data;
    this.details.name = this.details.originalName ?? this.details.name;
    this.itemFormGroup.patchValue({
      name: this.details.name,
      quality: this.details.quality || [],
    });
  }

  initDefaultValues(quality: string) {
    return this.itemFormGroup.controls['quality'].value.includes(quality);
  }

  onSubmit(): void {
    const itemName = this.itemFormGroup.controls['name'].value;
    const qualityValues =
      this.itemFormGroup.controls['quality'].value.join(' ');

    if (!itemName.includes(qualityValues)) {
      this.itemFormGroup.controls['name'].patchValue(
        `${qualityValues} ${itemName}`
      );
    }

    this.dialogRef.close(this.itemFormGroup.controls);
  }

  onSelect(quality: string) {
    const qualityControl = this.itemFormGroup.controls['quality'];
    const currentValues = qualityControl.value;

    if (currentValues.includes(quality)) {
      qualityControl.setValue(
        currentValues.filter((q: string) => q !== quality)
      );
    } else {
      qualityControl.setValue([...currentValues, quality]);
    }
  }

  onQualitySelectionChange(event: any): void {
    this.itemFormGroup.controls['quality'].patchValue(event);
  }
}
