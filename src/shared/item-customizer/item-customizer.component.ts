import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { ItemDetailsComponent } from '../item-details/item-details.component';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-item-customizer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatChipsModule,
    CommonModule,
    MatExpansionModule,
  ],
  templateUrl: './item-customizer.component.html',
  styleUrl: './item-customizer.component.scss',
})
export class ItemCustomizerComponent implements OnInit {
  @Input() details: any;

  itemFormGroup: FormGroup = new FormGroup({
    name: new FormControl(''),
    quality: new FormControl([]),
    killstreak: new FormControl(null),
    craftable: new FormControl(true),
  });

  qualities: any = [
    { type: 'Normal', color: '' },
    { type: 'Unique', color: '' },
    { type: 'Vintage', color: '' },
    { type: 'Genuine', color: '' },
    { type: 'Strange', color: '' },
    { type: 'Unusual', color: '' },
    { type: 'Haunted', color: '' },
    { type: "Collector's", color: '' },
  ];

  killstreaks: any = [{ killstreak: '' }];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { name: string },
    public dialogRef: MatDialogRef<ItemDetailsComponent>
  ) {}

  ngOnInit(): void {
    this.details = this.data;
    if (this.details) {
      this.itemFormGroup.patchValue({
        name: this.details.name,
        quality: this.details.qualities || [],
      });
    }
  }

  initDefaultValues(quality: string) {
    return this.itemFormGroup.controls['quality'].value.includes(quality);
  }

  onSubmit() {
    const itemName = this.itemFormGroup.controls['name'].value;
    this.itemFormGroup.controls['name'].patchValue(
      this.itemFormGroup.controls['quality'].value.join(' ') + ' ' + itemName
    );
    this.dialogRef.close(this.itemFormGroup.controls);
  }

  getQualityClass(qualityType: string): string {
    const classMap: { [key: string]: string } = {
      Normal: 'normal',
      Unique: 'unique',
      Vintage: 'vintage',
      Genuine: 'genuine',
      Strange: 'strange',
      Unusual: 'unusual',
      Haunted: 'haunted',
      "Collector's": 'collectors',
    };
    return classMap[qualityType] || '';
  }
}
