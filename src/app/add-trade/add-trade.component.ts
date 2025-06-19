import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { combineLatest, first, map } from 'rxjs';
import { ItemSelectorComponent } from '../../shared/item-selector/item-selector.component';
import { ItemSelectorService } from '../../shared/item-selector.service';
import { TradeService } from '../home/trade.service';
import { ActionBarComponent } from './action-bar/action-bar.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DescrpitionComponent } from '../../shared/descrpition/descrpition.component';
import { ButtonModule } from 'primeng/button';
import { ModifiedItemData } from '../../shared/models/modifiedItem.model';
import { ItemSelectorFacade } from '../../shared/item-selector/item-selector.facade';
import { DialogService } from 'primeng/dynamicdialog';
import { InventoryItemsSelectorComponent } from './inventory-items-selector/inventory-items-selector.component';

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
    InventoryItemsSelectorComponent
  ],
  providers: [HttpClient, DialogService],
  templateUrl: './add-trade.component.html',
  styleUrl: './add-trade.component.scss',
})
export class AddTradeComponent implements OnInit {
  http = inject(HttpClient);
  filterText = '';
  tradeDescription = '';
  inventoryItems: any[] = [];
  tradeForm: FormGroup = new FormGroup({
    inventory: new FormControl([]),
    itemsToTrade: new FormControl([]),
    itemsForTrade: new FormControl([]),
    tradeDescription: new FormControl(''),
  });

  constructor(
    private tradeService: TradeService,
    private itemSelectorService: ItemSelectorService,
    private cdRef: ChangeDetectorRef,
    private itemSelectorFacade: ItemSelectorFacade,
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
    this.itemSelectorFacade.items$.subscribe((items) => {
      this.inventoryItems = items;
    });
    this.itemSelectorFacade.itemsToTrade$.subscribe((items) => {
      console.log(items);
      this.tradeForm.controls["itemsToTrade"].setValue(items, { emitEvent: false })
    });
    this.tradeForm.valueChanges.subscribe((value) => {
      console.log(value);
    });
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
    items: ModifiedItemData[],
    chunkSize = 7
  ): ModifiedItemData[][] {
    const result = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      result.push(items.slice(i, i + chunkSize));
    }
    return result;
  }

  handleItemAddToTrade(item: ModifiedItemData): void {
    // Get current items
    console.log(item);
    console.log(...this.tradeForm.controls['itemsToTrade'].value);
    // Update form control
    this.tradeForm.controls['itemsToTrade'].patchValue([...this.tradeForm.controls['itemsToTrade'].value, item], {
      emitEvent: false,
    });

    // Re-chunk the items to maintain the layout

    console.log(this.tradeForm);
  }
  handleItemRemoveFromTrade(item: any): void { }

  openSnackBar(error: any) { }

  makeTrade() {
    const itemsToTrade$ = this.itemSelectorService.getItemsToTrade().pipe(
      first(),
      map((items: any[]) => {
        return items.map(item => ({
          name: item.name,
          descriptions: item.descriptions[0],
          tags: item.tags.find((tag: any) => tag.category === 'Quality'),
          imageUrl: item.icon_url,
        }));
      })
    );

    const itemsForTrade$ = this.itemSelectorService.getItemsForTrade().pipe(
      first(),
      map((items: any[]) => {
        console.log(items);
        return items.map(item => ({
          name: item.name,
          imageUrl: item.image_url,
          descriptions: item.descriptions,
        }));
      })
    );

    combineLatest([itemsToTrade$, itemsForTrade$]).subscribe(
      ([itemIdsToTrade, itemIdsForTrade]) => {
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
