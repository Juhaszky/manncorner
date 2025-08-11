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
import { ButtonModule } from 'primeng/button';
import { KillstreakTier } from '../models/enums/item-customization.enum';

export interface ItemFormGroup {
  name: FormControl<string>;
  quality: FormControl<number>;
  effect: FormControl<number>;
  craftable: FormControl<boolean>;
  imgUrl: FormControl<string>;
}
export interface KillstreakFormGroup {
  killstreak: FormControl<KillstreakTier>;
  sheen: FormControl<string>;
  killstreaker: FormControl<string>;
}
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
    ButtonModule,
  ],
  templateUrl: './item-customizer.component.html',
  styleUrl: './item-customizer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCustomizerComponent implements OnInit, OnChanges {
  @Input() details!: Item;
  @Input() showDialog = false;
  @Output() itemModified = new EventEmitter<Item>();

  effectFormGroup = new FormGroup<{
    effects: FormControl<{ value: number; label: string }[]>;
  }>({
    effects: new FormControl([{ value: 1, label: '' }], { nonNullable: true }),
  });

  itemFormGroup = new FormGroup<ItemFormGroup>({
    name: new FormControl('', { nonNullable: true }),
    quality: new FormControl(-1, { nonNullable: true }),
    effect: new FormControl(-1, { nonNullable: true }),
    craftable: new FormControl(true, { nonNullable: true }),
    imgUrl: new FormControl('', { nonNullable: true }),
  });

  killstreakFormGroup = new FormGroup<KillstreakFormGroup>({
    killstreak: new FormControl(KillstreakTier.None, { nonNullable: true }),
    sheen: new FormControl('', { nonNullable: true }),
    killstreaker: new FormControl('', { nonNullable: true }),
  });

  effectUrl = '';

  http = inject(HttpClient);

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.details) {
      this.details.name = this.details?.fullName ?? this.details?.name;
      this.itemFormGroup.patchValue({
        name: this.details.name,
        quality: this.details.quality,
        effect: this.details.effect,
        imgUrl: this.details.img,
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['details'] && changes['details'].currentValue) {
      this.patchForms(changes['details'].currentValue);
    }
  }

  private patchForms(details: Item): void {
    this.itemFormGroup.patchValue({
      name: details.fullName ?? details.name,
      quality: details.quality,
      effect: details.effect,
      imgUrl: details.img,
    });

    this.killstreakFormGroup.patchValue({
      killstreak: details.killstreak ?? KillstreakTier.None,
      sheen: details.sheen ?? '',
      killstreaker: details.killstreaker ?? '',
    });
  }

  onSubmit(): void {
    this.details.effect = this.itemFormGroup.controls['effect'].value;
    this.details.quality = this.itemFormGroup.controls['quality'].value;
    this.details.killstreak =
      this.killstreakFormGroup.controls['killstreak'].value;
    this.details.sheen = this.killstreakFormGroup.controls['sheen'].value;
    this.details.killstreaker =
      this.killstreakFormGroup.controls['killstreaker'].value;
    const selectedEffect = this.effectFormGroup.controls['effects'].value.find(
      effectRecord =>
        effectRecord.value === this.itemFormGroup.controls['effect'].value
    );
    if (selectedEffect) {
      this.details.fullName = `${selectedEffect.label} ${this.details.name}`;
    } else {
      this.details.fullName = this.details.name;
    }
    this.itemModified.emit(this.details);
  }

  returnQualityString(quality: number | null) {
    return getQualityString(quality ?? -1);
  }
}
