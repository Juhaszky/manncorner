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
import { getImgUrlString, getKillstreakString, getQualityString } from '../../app/common/utils';
import { ButtonModule } from 'primeng/button';
import { KillstreakTier, Spell } from '../models/enums/item-customization.enum';
import { ItemSpellsComponent } from './item-spells/item-spells.component';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

export interface ItemFormGroup {
  name: FormControl<string>;
  quality: FormControl<number>;
  effect: FormControl<number>;
  craftable: FormControl<boolean>;
  imgUrl: FormControl<string>;
  isAustralium: FormControl<boolean>;
}
export interface KillstreakFormGroup {
  killstreak: FormControl<KillstreakTier>;
  sheen: FormControl<string>;
  killstreaker: FormControl<string>;
}
export interface SpellFormGroup {
  spell: FormControl<Spell[]>;
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
    ItemSpellsComponent,
    ToggleSwitchModule,
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
    isAustralium: new FormControl(false, { nonNullable: true }),
  });

  killstreakFormGroup = new FormGroup<KillstreakFormGroup>({
    killstreak: new FormControl(KillstreakTier.None, { nonNullable: true }),
    sheen: new FormControl('', { nonNullable: true }),
    killstreaker: new FormControl('', { nonNullable: true }),
  });
  spellFormGroup = new FormGroup<SpellFormGroup>({
    spell: new FormControl([], { nonNullable: true }),
  });

  effectUrl = '';

  http = inject(HttpClient);

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.details) {
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
      name: details.name,
      quality: details.quality,
      effect: details.effect,
      imgUrl: details.img,
      isAustralium: details.isAustralium,
    });

    this.killstreakFormGroup.patchValue({
      killstreak: details.killstreak ?? KillstreakTier.None,
      sheen: details.sheen ?? '',
      killstreaker: details.killstreaker ?? '',
    });
  }

  onSubmit(): void {
    const baseName = this.details.name;

    let fullName = baseName;

    const effectId = this.itemFormGroup.controls['effect'].value;
    const selectedEffect = this.effectFormGroup.controls['effects'].value.find(
      e => e.value === effectId
    );

     if (selectedEffect?.label) {
      fullName = `${selectedEffect.label} ${fullName}`;
    }

    const isAustralium = this.itemFormGroup.controls['isAustralium'].value;
    if (isAustralium) {
      fullName = `Australium ${fullName}`;
    }

    const killstreak = this.killstreakFormGroup.controls['killstreak'].value;
    if (killstreak !== KillstreakTier.None) {
      fullName = `${this.returnKillstreakString(killstreak)} ${fullName}`;
    }

    const quality = this.itemFormGroup.controls['quality'].value;
    if (quality > -1) {
      fullName = `${this.returnQualityString(quality)} ${fullName}`;
    }

    const updatedItem: Item = {
      ...this.details,
      name: this.details.name,
      fullName,
      quality,
      effect: effectId,
      isAustralium,
      killstreak,
      sheen: this.killstreakFormGroup.controls['sheen'].value,
      killstreaker: this.killstreakFormGroup.controls['killstreaker'].value,
      spells: this.spellFormGroup.controls['spell'].value,
    };
    this.itemModified.emit(updatedItem);
  }

  returnQualityString(quality: number | null) {
    return getQualityString(quality ?? -1);
  }
  returnAustraliumString(isAustralium: boolean) {
    return isAustralium ? 'Australium ' : '';
  }
  returnKillstreakString(killstreakValue: number) {
    return getKillstreakString(killstreakValue);
  }
  getDisplayedImageUrl(url: string, name: string, isAustralium: boolean) {
    return getImgUrlString(url, name, isAustralium);
  }
}
