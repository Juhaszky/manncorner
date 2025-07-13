import { Component, Inject, Input, OnInit } from '@angular/core';
import { ResizedImageComponent } from '../resized-image/resized-image.component';
import { CommonModule } from '@angular/common';
import { ModifiedItemData } from '../models/modifiedItem.model';
import { ItemExtrasService } from '../item-extras.service';
import { Item } from '../models/item.model';

@Component({
  standalone: true,
    selector: 'item-details',
    imports: [ItemDetailsComponent, ResizedImageComponent, CommonModule],
    templateUrl: './item-details.component.html',
    styleUrl: './item-details.component.scss'
})
export class ItemDetailsComponent implements OnInit {
  @Input() itemData!: Item;
  isAllClass = false;
  paintColor: {paintName: string; paintColor: string} = {paintName: '', paintColor: ''};
  constructor(
    private itemExtrasService: ItemExtrasService
  ) {}
  ngOnInit(): void {
    console.log(this.itemData);
    // if (this.itemData.tags) {
    //   let classCounter = 0;
    //   this.itemData.tags.forEach((t) => {
    //     if (t.category === 'Class') {
    //       classCounter++;
    //     }
    //   });
    //   if (classCounter === 9) {
    //     this.isAllClass = true;
    //   }
    // }
    
  }

  getImageUrl(): string {
    console.log(this.itemData);
    const itemsUrl =
      this.itemData.img
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
      //effectUrl = this.itemExtrasService.getItemEffectUrl(this.itemData.effect);
    }
    return effectUrl;
  }
}
