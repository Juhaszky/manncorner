import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResizedImageComponent } from '../resized-image/resized-image.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'item-details',
  standalone: true,
  imports: [ItemDetailsComponent, ResizedImageComponent, CommonModule],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.scss',
})
export class ItemDetailsComponent implements OnInit {
  @Input() itemData: any;

  constructor(@Inject(MAT_DIALOG_DATA) private data: { name: string }) {}
  ngOnInit(): void {
    this.itemData = this.data;
    console.log(this.itemData);
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
}
