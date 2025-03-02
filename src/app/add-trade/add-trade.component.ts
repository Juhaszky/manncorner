import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  afterNextRender,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { combineLatest, first, map } from 'rxjs';
import { ItemSelectorComponent } from '../../shared/item-selector/item-selector.component';
import { ItemSelectorService } from '../../shared/item-selector.service';
import { UserDataService } from '../../shared/user-data.service';
import { TradeService } from '../home/trade.service';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { AddTradeService } from './add-trade.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DescrpitionComponent } from '../../shared/descrpition/descrpition.component';
import { ModifiedItemData } from '../../shared/models/modifiedItem.model';
import { chunkItems } from '../common/utils';

@Component({
  standalone: true,
    selector: 'app-dashboard',
    imports: [
        CommonModule,
        ItemSelectorComponent,
        ActionBarComponent,
        FormsModule,
        DescrpitionComponent,
        ReactiveFormsModule
    ],
    providers: [HttpClient],
    templateUrl: './add-trade.component.html',
    styleUrl: './add-trade.component.scss'
})
export class AddTradeComponent implements OnInit {
  filterText: string = '';
  tradeDescription: string = '';
  tradeForm: FormGroup = new FormGroup({
    itemsToTrade: new FormControl([]),
    itemsForTrade: new FormControl([]),
    tradeDescription: new FormControl(''),
  });

  constructor(
    private tradeService: TradeService,
    private itemSelectorService: ItemSelectorService,
    private userDataService: UserDataService,
    private AddTradeService: AddTradeService,
    private cdRef: ChangeDetectorRef
  ) {
    afterNextRender(() => {
      this.AddTradeService.filterText$.subscribe((filterText) => {
        console.log('ran');
        this.filterText = filterText;
        //this.cdRef.detectChanges();
      });
    });
  }
  check(description: string): void {
    this.tradeDescription = description;
  }

  ngOnInit(): void {
    this.itemSelectorService.fetchAllItems().subscribe((items: any) => {
      this.itemSelectorService.updateState({ allItems: items });
    });
    this.tradeForm.valueChanges.subscribe((change) => {
      console.log(change);
    });

  }
  handleItemAddToTrade(item: any): void {
    console.log(item);
  
    // Get current items
    const updatedItems = [...this.tradeForm.controls["itemsToTrade"].value, item];
  
    // Update form control
    this.tradeForm.controls["itemsToTrade"].setValue(updatedItems);
  
    // Re-chunk the items to maintain the layout
    
  
    console.log(this.tradeForm);
  }
  onChunkItems(items: ModifiedItemData[]): ModifiedItemData[][] {
    return chunkItems(items, 7);
  }

  openSnackBar(error: any) {
    
  }

  makeTrade() {
    const itemsToTrade$ = this.itemSelectorService.getItemsToTrade().pipe(
      first(),
      map((items: any[]) => {
        return items.map((item) => ({
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
        return items.map((item) => ({
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
            owner: "Juhaszky",//this.userDataService.getUsername(),
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
