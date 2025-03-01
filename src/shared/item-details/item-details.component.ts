import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResizedImageComponent } from '../resized-image/resized-image.component';
import { CommonModule } from '@angular/common';
import { ModifiedItemData } from '../models/modifiedItem.model';
import { ItemExtrasService } from '../item-extras.service';

@Component({
    selector: 'item-details',
    imports: [ItemDetailsComponent, ResizedImageComponent, CommonModule],
    templateUrl: './item-details.component.html',
    styleUrl: './item-details.component.scss'
})
export class ItemDetailsComponent implements OnInit {
  @Input() itemData!: ModifiedItemData;
  isAllClass: boolean = false;
  paintColor: {paintName: string; paintColor: string} = {paintName: '', paintColor: ''};
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ModifiedItemData,
    private itemExtrasService: ItemExtrasService
  ) {}
  ngOnInit(): void {
    this.itemData = this.data;
    console.log(this.itemData);
    if (this.itemData.tags) {
      let classCounter = 0;
      this.itemData.tags.forEach((t) => {
        if (t.category === 'Class') {
          classCounter++;
        }
      });
      if (classCounter === 9) {
        this.isAllClass = true;
      }
    }
    
  }

  getImageUrl(): string {
    const itemsUrl =
      this.itemData.imageUrl ??
      this.itemData.icon_url ??
      this.itemData.image_url;
    if (!itemsUrl) {
      return '';
    }
    return itemsUrl.includes('http')
      ? itemsUrl
      : `https://steamcommunity-a.akamaihd.net/economy/image/${itemsUrl}`;
  }
  getEffectUrl(): string {
    let effectUrl = '';
    if (this.itemData.effect) {
      effectUrl = this.itemExtrasService.getItemEffectUrl(this.itemData.effect);
    }
    return effectUrl;
  }
}
