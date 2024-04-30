import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, Subscription, map, of, take } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ItemSelectorComponent } from '../../shared/item-selector/item-selector.component';
import { ItemSelectorService } from '../../shared/item-selector.service';
import { UserDataService } from '../../shared/user-data.service';

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
  ],
  providers: [HttpClient],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private sub: Subscription | undefined;
  inventoryLength: number = 0;
  inventoryItems: any = null;
  itemsFromInventory: any = [];
  durationInSeconds = 5;
  filteredItems!: Observable<any[]>;
  constructor(
    private _snackBar: MatSnackBar,
    private itemSelectorService: ItemSelectorService,
    private userDataService: UserDataService
  ) {}

  filterItems(event: any) {
    const filterValue = event.data;
    this.filteredItems = of(
      this.inventoryItems.filter((item: any) => {
        item.name.startsWith(filterValue);
      })
    );
  }

  ngOnInit(): void {
    const lastFetch = JSON.parse(localStorage.getItem('lastFetch') || '0');
    this.itemSelectorService.fetchAllItems().subscribe((items: any) => {
      this.itemSelectorService.getAllItems().next(items);
    });
    // this.itemSelectorService.getInventoryItems().subscribe((items: any) => {
    //   this.inventoryItems = items;
    // })
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  openSnackBar(error: any) {
    this._snackBar.open(error, 'X');
  }
  makeTrade() {
    const itemIdsToTrade = this.itemSelectorService
      .getItemsToTrade()
      .getValue()
      .map((item: any) => {
        return {
          name: item.name,
          descriptions: item.descriptions[0],
          tags: item.tags.find((item: any) => item.category === 'Quality'),
          imageUrl: item.icon_url,
        };
      });
    console.log(itemIdsToTrade);
    const itemIdsForTrade = this.itemSelectorService
      .getItemsForTrade()
      .getValue()
      .map((item: any) => {
        console.log(item);
        return {
          name: item.name,
          imageUrl: item.image_url,
          descriptions: item.descriptions,
        };
      });
    console.log(itemIdsForTrade);

    this.itemSelectorService
      .makeTrade({
        itemsFrom: itemIdsToTrade,
        itemsTo: itemIdsForTrade,
        postDate: new Date().toISOString(),
        owner: this.userDataService.getUsername(),
      })
      .subscribe((res) => {
        console.log(res);
      });
    this.emptySelectedItems();
  }
  private emptySelectedItems() {
    this.itemSelectorService.emptyItemForTrade();
    this.itemSelectorService.emptyItemsToTrade();
  }
}
