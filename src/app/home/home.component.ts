import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostDatePipe } from './post-date.pipe';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TradeService } from './trade.service';
import { ItemContainerComponent } from '../../shared/item/item-container.component';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserDataService } from '../../shared/user-data.service';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { DescrpitionComponent } from '../../shared/descrpition/descrpition.component';
import { displayableTrade } from '../../shared/models/displayableTrade.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { TradesStateService } from '../../shared/trades-state.service';


@Component({
  standalone: true,
  selector: 'app-home',
  imports: [
    CommonModule,
    PostDatePipe,
    PaginatorModule,
    ProgressSpinnerModule,
    TooltipModule,
    ItemContainerComponent,
    CardModule,
    AvatarModule,
    DescrpitionComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  page = 1;
  first = 0;

  rows = 10;
  allPage = 0;
  trades: displayableTrade[] = [];
  loading = false;
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  tradeService = inject(TradeService);
  userService = inject(UserDataService);
  canBump = false;
  trades$ = inject(TradesStateService).trades$;

  ngOnInit(): void {
    //TODO fix page param in url
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.page = params['page'] ? +params['page'] : 1;
      this.first = (this.page - 1) * this.rows;
    });
  }

  selectTrade(tradeId: string): void {
    this.router.navigate(['/trade', tradeId]);
  }
  onBump(tradeId: string, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const userId = this.userService.getUserId();
    console.log(userId);
    if (userId) {
      this.tradeService.bumpTrade(userId, tradeId).subscribe(res => {
        console.log(res);
      });
    }
  }
  trackByFn(index: number, trade: displayableTrade): number {
    return +trade.id;
  }
}
