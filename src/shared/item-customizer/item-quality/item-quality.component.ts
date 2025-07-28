import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QualityMap } from '../../models/quality.model';
import { ItemExtrasService } from '../../item-extras.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChipModule } from 'primeng/chip';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  standalone: true,
  selector: 'item-quality',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChipModule,
    ToggleButtonModule,
    FormsModule,
    SelectButtonModule,
  ],
  templateUrl: './item-quality.component.html',
  styleUrl: './item-quality.component.scss',
})
export class ItemQualityComponent implements OnInit {
  @Input() qualityControl!: FormControl<number>;
  @Output() selectionChange = new EventEmitter<number>();
  qualities: QualityMap = {};
  qualityOptions: { type: string; value: number }[] = [];
  selectedQualities: string[] = [];
  constructor(private itemExtrasService: ItemExtrasService) {}

  ngOnInit(): void {
    this.qualities = this.itemExtrasService.getAllQualities();
    this.qualityOptions = Object.entries(this.qualities).map(
      ([key, value]) => ({
        type: key,
        value: value,
      })
    );
  }

  getQualityClass(qualityType: string): string {
    return this.itemExtrasService.getClassByQuality(qualityType);
  }

  onSelect(quality: { type: string; value: number }): void {
    if (quality) {
      this.qualityControl.patchValue(quality.value);
      this.selectionChange.emit(quality.value);
    } else {
      this.qualityControl.patchValue(-1);
      this.selectionChange.emit(-1);
    }
  }
}
