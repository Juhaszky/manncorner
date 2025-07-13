import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { combineLatest, first, map } from 'rxjs';
import { ItemSelectorComponent } from '../../shared/item-selector/item-selector.component';
import { ItemSelectorService } from '../../shared/item-selector.service';
import { TradeService } from '../home/trade.service';
import { ActionBarComponent } from './action-bar/action-bar.component';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DescrpitionComponent } from '../../shared/descrpition/descrpition.component';
import { ButtonModule } from 'primeng/button';
import { ItemSelectorFacade } from '../../shared/item-selector/item-selector.facade';
import { DialogService } from 'primeng/dynamicdialog';
import { InventoryItemsSelectorComponent } from './inventory-items-selector/inventory-items-selector.component';
import { BuyItemPanelComponent } from './buy-item-panel/buy-item-panel.component';
import { Item } from '../../shared/models/item.model';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ItemSelectorComponent,
    ActionBarComponent,
    FormsModule,
    DescrpitionComponent,
    ReactiveFormsModule,
    ButtonModule,
    InventoryItemsSelectorComponent,
    BuyItemPanelComponent
  ],
  providers: [HttpClient, DialogService],
  templateUrl: './add-trade.component.html',
  styleUrl: './add-trade.component.scss',
})
export class AddTradeComponent implements OnInit {
  http = inject(HttpClient);
  filterText = '';
  tradeDescription = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inventoryItems: Item[] = [];
  itemsToSell: Item[] = [];
  itemsToBuy: Item[] = [];

  constructor(
    private tradeService: TradeService,
    private itemSelectorService: ItemSelectorService,
    private cdRef: ChangeDetectorRef,
    private itemSelectorFacade: ItemSelectorFacade
  ) {
    // afterNextRender(() => {
    //   this.AddTradeService.filterText$.subscribe(filterText => {
    //     console.log('ran');
    //     this.filterText = filterText;
    //     //this.cdRef.detectChanges();
    //   });
    // });
  }
  check(description: string): void {
    this.tradeDescription = description;
  }

  ngOnInit(): void {
    this.itemSelectorFacade.loadItemsLazy(0, 42);
    this.itemSelectorFacade.items$.subscribe(items => {
      this.inventoryItems = items;
    });
    this.itemSelectorFacade.itemsToTrade$.subscribe(items => {
      this.itemsToSell = items;
    });
    this.itemSelectorFacade.itemsForTrade$.subscribe(items => {
      console.log(items);
      this.itemsToBuy = items;
    });
    // this.tradeForm.valueChanges.subscribe((value) => {
    //   console.log(value);
    // });
    // this.itemSelectorService.fetchItems(0, 20).subscribe(items => {
    //   console.log(items);
    //   this.tradeForm.controls['inventory'].setValue(items);
    //   const chunked = this.chunkItemsIntoRows(items, 7);
    //   this.itemSelectorFacade.items$.
    //   this.inventoryItems = [...this.inventoryItems, ...chunked];
    //   console.log(this.inventoryItems);
    // });
    // this.itemSelectorService.fetchAllItems().subscribe((items: any) => {

    // });
    // this.tradeForm.valueChanges.subscribe((change) => {

    // });
  }
  chunkItemsIntoRows(
    items: Item[],
    chunkSize = 7
  ): Item[][] {
    const result = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      result.push(items.slice(i, i + chunkSize));
    }
    return result;
  }

  handleItemAddToTrade(item: Item): void {
    // Get current items
    console.log(item);
    //console.log(...this.tradeForm.controls['itemsToTrade'].value);
    // Update form control
    // this.tradeForm.controls['itemsToTrade'].patchValue([...this.tradeForm.controls['itemsToTrade'].value, item], {
    //   emitEvent: false,
    // });

    // Re-chunk the items to maintain the layout

    //console.log(this.tradeForm);
  }

  makeTrade() {

    combineLatest([this.itemSelectorFacade.itemsToTrade$, this.itemSelectorFacade.itemsForTrade$]).subscribe(
      ([itemIdsToTrade, itemIdsForTrade]) => {
        console.log(itemIdsForTrade);
        console.log(itemIdsToTrade);
        if (itemIdsToTrade.length === 0 || itemIdsForTrade.length === 0) {
          return alert('You must select one item from each category!');
        }

        this.tradeService
          .postTrade({
            itemsFrom: itemIdsToTrade,
            itemsTo: itemIdsForTrade,
            postDate: new Date().toISOString(),
            owner: 'Juhaszky', //this.userDataService.getUsername(),
            description: this.tradeDescription,
          })
          .subscribe();

        this.emptySelectedItems();
      }
    );
  }

  private emptySelectedItems() {
    //this.html = '';
    this.itemSelectorService.emptyItemForTrade();
    this.itemSelectorService.emptyItemsToTrade();
  }
}
