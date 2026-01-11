import { Component, inject, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Item } from '../models/item.model';
import { ResizedImageComponent } from '../resized-image/resized-image.component';
import { getKillstreakString, getQualityString } from '../../app/common/utils';
import { ItemFacade } from '../item/item.facade';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-mobile-item-details',
  imports: [ResizedImageComponent, ButtonModule],
  providers: [],
  templateUrl: './mobile-item-details.component.html',
  styleUrl: './mobile-item-details.component.scss',
})
export class MobileItemDetailsComponent implements OnInit {
  dialogService = inject(DialogService);
  item!: Item;
  showHistoryBtn = false;
  facade = inject(ItemFacade);
  getQualityString = getQualityString;
  getkillStreakString = getKillstreakString;
  dialogConfig = inject(DynamicDialogConfig);
  ngOnInit(): void {
    this.item = this.dialogConfig.data.item;
    this.showHistoryBtn = this.dialogConfig.data.showHistoryBtn ?? false;
  }
  openBackpackTfLink() {
    this.facade.openBackpackTfLink(this.item);
  }
  openBackpackTfHistory() {
    window.open(`https://backpack.tf/item/${this.item.id}`, '_blank');
  }
}
