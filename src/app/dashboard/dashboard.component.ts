import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, Subscription, map, of } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ItemSelectorComponent } from '../../shared/item-selector/item-selector.component';
import { ItemSelectorService } from '../../shared/item-selector.service';

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
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private itemSelectorService: ItemSelectorService
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
    this.itemSelectorService.getInventoryItems().subscribe((items: any) => {
      this.inventoryItems = items;
    })
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
  fetchData(): Observable<any> {
    return this.http.get<Observable<any>>('http://localhost:3000/alma').pipe(
      map((data: any) => {
        this.inventoryLength = data.total_inventory_count;
        this.cdr.detectChanges();
        return data.descriptions;
      })
    );
  }
  
  openSnackBar(error: any) {
    this._snackBar.open(error, 'X');
  }
}
