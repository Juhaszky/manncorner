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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItemQualityComponent } from './item-quality/item-quality.component';
import { ItemEffectsComponent } from './item-effects/item-effects.component';
import { ResizedImageComponent } from '../resized-image/resized-image.component';
import { ItemKillstreakerSelectorComponent } from './item-killstreaker-selector/item-killstreaker-selector.component';
import { AccordionModule } from 'primeng/accordion';
import { HttpClient } from '@angular/common/http';
import { Item } from '../models/item.model';
import { getQualityString } from '../../app/common/utils';

@Component({
  standalone: true,
  selector: 'item-customizer',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ItemQualityComponent,
    ItemEffectsComponent,
    ResizedImageComponent,
    ItemKillstreakerSelectorComponent,
    AccordionModule,
  ],
  templateUrl: './item-customizer.component.html',
  styleUrl: './item-customizer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCustomizerComponent implements OnInit, OnChanges {
  @Input() details!: Item;
  @Input() showDialog = false;
  @Output() itemModified = new EventEmitter<Item>();

  itemFormGroup = new FormGroup<{
    name: FormControl<string>;
    quality: FormControl<number>;
    effect: FormControl<number>;
    craftable: FormControl<boolean>;
  }>({
    name: new FormControl('', { nonNullable: true }),
    quality: new FormControl(-1, { nonNullable: true }),
    effect: new FormControl(-1, { nonNullable: true }),
    craftable: new FormControl(true, { nonNullable: true }),
  });

  isUnusual = false;
  effectUrl = '';
  qualityToDisplay = '';
  isEffectAccordionExpanded = false;

  http = inject(HttpClient);
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log(this.details);

    this.setIsUnusual();
    if (this.details) {
      this.details.name = this.details?.fullName ?? this.details?.name;
      this.itemFormGroup.patchValue({
        name: this.details.name,
        quality: this.details.quality,
        effect: this.details.effect,
      });
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  getImageUrl(): string {
    if (this.details) {
      console.log(this.details);
      const itemsUrl = this.details.img;
      if (!itemsUrl) {
        return '';
      }
      return itemsUrl
        ? itemsUrl.startsWith('http')
          ? itemsUrl
          : `https://steamcommunity-a.akamaihd.net/economy/image/${itemsUrl}`
        : '';
    }
    return '';
  }

  onSubmit(): void {
    const itemName = this.itemFormGroup.controls['name'].value;
    const qualityValues = this.itemFormGroup.controls['quality'].value;

    this.itemFormGroup.controls['name'].patchValue(
      `${qualityValues} ${itemName}`
    );
    this.details.effect = this.itemFormGroup.controls['effect'].value;
    this.details.quality = this.itemFormGroup.controls['quality'].value;
    console.log(this.details);
    this.itemModified.emit(this.details);
    // this.dialogRef.close(this.itemFormGroup.controls);
  }

  onQualitySelectionChange(quality: number): void {
    this.itemFormGroup.controls['quality'].patchValue(quality);
    this.qualityToDisplay = getQualityString(quality);

    if (quality === 5) {
      this.isUnusual = true;
    } else {
      this.isUnusual = false;
    }
  }
  returnQualityString(quality: number | null) {
    return getQualityString(quality ?? -1);
  }

  onEffectSelectionChange(event: any) {
    console.log(event);
    if (this.effectUrl.includes(event)) {
      this.setEffectUrl(-1);
      this.itemFormGroup.controls['effect'].patchValue(-1);
    } else {
      this.setEffectUrl(event);
      this.itemFormGroup.controls['effect'].patchValue(event);
    }
  }

  onKillstreakSelectionChange(event: any) {
    //this.itemFormGroup.controls['killstreaker'].patchValue(event);
  }

  private setIsUnusual() {
    const quality = this.itemFormGroup.controls['quality'].value;
    if (quality === 5) {
      this.isUnusual = true;
    } else {
      this.isUnusual = false;
      this.itemFormGroup.controls['effect'].patchValue(-1);
      this.setEffectUrl(-1);
    }
    this.cdr.markForCheck();
  }

  private setEffectUrl(effect: number) {
    if (effect !== -1) {
      this.effectUrl = `/assets/images/effects/${effect}.png`;
    }
  }
}
