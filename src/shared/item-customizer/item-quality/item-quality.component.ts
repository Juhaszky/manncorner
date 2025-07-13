import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Quality } from '../../models/quality.model';
import { ItemExtrasService } from '../../item-extras.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChipModule } from 'primeng/chip';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonModule } from 'primeng/selectbutton';


@Component({
  standalone: true,
    selector: 'item-quality',
    imports: [CommonModule, ReactiveFormsModule, ChipModule, ToggleButtonModule, FormsModule, SelectButtonModule],
    templateUrl: './item-quality.component.html',
    styleUrl: './item-quality.component.scss'
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
  
  onSelect(quality: {type: string; color: string}[]): void {
    console.log(quality);
    console.log(this.selectedQualities);
    const qualityIndex = this.selectedQualities.indexOf(quality[quality.length - 1].type);
    console.log(qualityIndex);
    if (qualityIndex >= 0) {
      this.selectedQualities.splice(qualityIndex, 1);
    } else {
      this.selectedQualities.push(quality[quality.length - 1].type);
    }
    console.log(this.qualityControl);
    console.log(this.selectedQualities);
    this.qualityControl.patchValue([...this.selectedQualities]);
    this.selectionChange.emit([...this.selectedQualities]);
  }
}
