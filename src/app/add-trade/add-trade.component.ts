import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  afterNextRender,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, combineLatest, first, map } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ItemSelectorComponent } from '../../shared/item-selector/item-selector.component';
import { ItemSelectorService } from '../../shared/item-selector.service';
import { UserDataService } from '../../shared/user-data.service';
import { MatButtonModule } from '@angular/material/button';
import { TradeService } from '../home/trade.service';
import { MatInputModule } from '@angular/material/input';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { AddTradeService } from './add-trade.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatTooltipModule,
    CommonModule,
    HttpClientModule,
    MatSnackBarModule,
    MatListModule,
    MatAutocompleteModule,
    ItemSelectorComponent,
    MatButtonModule,
    MatInputModule,
    ActionBarComponent,
  ],
  providers: [HttpClient],
  templateUrl: './add-trade.component.html',
  styleUrl: './add-trade.component.scss',
})
export class AddTradeComponent implements OnInit {
  inventoryItems: any = null;
  filteredItems: Observable<any[]> = new Observable();
  filterText: string = '';

  constructor(
    private _snackBar: MatSnackBar,
    private tradeService: TradeService,
    private itemSelectorService: ItemSelectorService,
    private userDataService: UserDataService,
    private AddTradeService: AddTradeService,
    private cdRef: ChangeDetectorRef
  ) {
    afterNextRender(() => {
      this.AddTradeService.filterText$.subscribe((filterText) => {
        this.filterText = filterText;
        this.cdRef.detectChanges();
      });
    });
  }

  ngOnInit(): void {
    this.itemSelectorService.fetchAllItems().subscribe((items: any) => {
      this.itemSelectorService.updateState({ allItems: items });
    });
  }

  openSnackBar(error: any) {
    this._snackBar.open(error, 'X');
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
            owner: this.userDataService.getUsername(),
          })
          .subscribe();

        this.emptySelectedItems();
      }
    );
  }

  private emptySelectedItems() {
    this.itemSelectorService.emptyItemForTrade();
    this.itemSelectorService.emptyItemsToTrade();
  }
}
