import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  afterNextRender,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { combineLatest, first, map, Observable } from 'rxjs';
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
import { ButtonModule } from 'primeng/button';

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
        ButtonModule
    ],
    providers: [HttpClient],
    templateUrl: './add-trade.component.html',
    styleUrl: './add-trade.component.scss'
})
export class AddTradeComponent implements OnInit {
  http = inject(HttpClient);
  filterText = '';
  tradeDescription = '';
  tradeForm: FormGroup = new FormGroup({
    inventory: new FormControl([]),
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
    this.itemSelectorService.fetchItems().subscribe((items) => {
      console.log(items)
      this.tradeForm.controls["inventory"].setValue(items);
    })
    // this.itemSelectorService.fetchAllItems().subscribe((items: any) => {
      
    // });
    // this.tradeForm.valueChanges.subscribe((change) => {
      
    // });

  }
  getItems (): Observable<any> {
    return this.http.get<any>("http://localhost:5268/items");
  }
  handleItemAddToTrade(item: any): void {
    // Get current items
    
  
    // Update form control
    this.tradeForm.controls["itemsToTrade"].patchValue(item, {emitEvent: false});
  
    // Re-chunk the items to maintain the layout
    
  
    console.log(this.tradeForm);
  }
  handleItemRemoveFromTrade(item: any): void {

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
