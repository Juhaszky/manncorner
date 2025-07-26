import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
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
        AccordionModule
        
    ],
    templateUrl: './item-customizer.component.html',
    styleUrl: './item-customizer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCustomizerComponent implements OnInit {
  @Input() details!: Item;
  @Input() showDialog = false;

  itemFormGroup: FormGroup = new FormGroup({
    name: new FormControl(''),
    quality: new FormControl([]),
    effect: new FormControl(''),
    
    craftable: new FormControl(true),
  });

  isUnusual = false;
  effectUrl = '';
  isEffectAccordionExpanded = false;

  http = inject(HttpClient);
  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log(this.details);
    
    this.setIsUnusual();
    if (this.details) {

    
    this.details.name = this.details?.fullName ?? this.details?.name;
    this.itemFormGroup.patchValue({
      name: this.details.name,
      quality: this.details.quality || [],
      effect: this.details.effect || '',
      
    });
    }
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
    return ''
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
    // this.dialogRef.close(this.itemFormGroup.controls);
  }

  onQualitySelectionChange(event: any): void {
    console.log(event);
    this.itemFormGroup.controls['quality'].patchValue(event);
    this.setIsUnusual();
    this.cdr.markForCheck();
  }

  onEffectSelectionChange(event: any) {
    console.log(event);
    if (this.effectUrl.includes(event)) {
      this.setEffectUrl(-1);
      this.itemFormGroup.controls['effect'].patchValue('');
    } else {
      this.setEffectUrl(event);
      this.itemFormGroup.controls['effect'].patchValue(event);
    }
  }

  onKillstreakSelectionChange(event: any) {
    this.itemFormGroup.controls['killstreaker'].patchValue(event);
  }

  private setIsUnusual() {
    const qualities = this.itemFormGroup.controls['quality'].value;
    console.log(qualities);
    if (qualities.includes('Unusual')) {
      this.isUnusual = true;
    } else {
      this.isUnusual = false;
      this.itemFormGroup.controls['effect'].patchValue('');
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
