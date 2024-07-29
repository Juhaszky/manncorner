import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { Quality } from '../../models/quality.model';
import { ItemExtrasService } from '../../item-extras.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'item-quality',
  standalone: true,
  imports: [MatChipsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './item-quality.component.html',
  styleUrl: './item-quality.component.scss',
})
export class ItemQualityComponent implements OnInit {
  @Input() qualityControl!: AbstractControl;
  @Output() selectionChange = new EventEmitter<string[]>();
  qualities: Quality[] = [];
  selectedQualities: string[] = [];
  constructor(private itemExtrasService: ItemExtrasService) {}

  ngOnInit(): void {
    this.initDefaultValues(this.qualityControl.value);
    this.qualities = this.itemExtrasService.getAllQualities();
  }

  getQualityClass(qualityType: string): string {
    return this.itemExtrasService.getClassByQuality(qualityType);
  }
  initDefaultValues(quality: string): void {
    //this.selectedQualities = this.qualityControl.value;
    return this.qualityControl?.value.includes(quality);
  }
  
  onSelect(quality: string): void {
    const qualityIndex = this.selectedQualities.indexOf(quality);
    if (qualityIndex >= 0) {
      this.selectedQualities.splice(qualityIndex, 1);
    } else {
      this.selectedQualities.push(quality);
    }
    this.qualityControl.patchValue([...this.selectedQualities]);
    this.selectionChange.emit([...this.selectedQualities]);
  }
}
