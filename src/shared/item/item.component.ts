import { Component, Input, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResizedImageComponent } from '../resized-image/resized-image.component';

@Component({
  selector: 'item',
  standalone: true,
  imports: [MatTooltipModule, ResizedImageComponent],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit {
  @Input() itemData: any;


  ngOnInit(): void {
      console.log(this.itemData);
  }

  getItemBorderStyle(item: any): string {
    if (item?.name?.includes('Unusual')) {
      return 'unusual';
    } else if (item?.name?.includes('Strange')) {
      return 'strange';
    } else if (item?.name?.includes('Vintage')) {
      return 'vintage';
    } else if (
      (item?.descriptions && item?.descriptions[0]?.value?.includes('Elite')) ||
      item?.descriptions?.value?.includes('Elite')
    ) {
      return 'elite';
    } else {
      return 'unique';
    }
  }

  getImageUrl(): string {
    const itemsUrl = this.itemData.imageUrl ?? this.itemData.icon_url ?? this.itemData.image_url;
    if(!itemsUrl) {
      return '';
    }
    return itemsUrl.includes('http') ? itemsUrl : `https://steamcommunity-a.akamaihd.net/economy/image/${itemsUrl}`;
  }
}
