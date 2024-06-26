import { Component, inject, Input, OnInit } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TradeService } from '../trade.service';

@Component({
  selector: 'paginator',
  standalone: true,
  imports: [MatPaginatorModule, RouterModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent implements OnInit {
  @Input() tradeLength: number = 0;
  router = inject(Router);
  route = inject(ActivatedRoute);
  pageSize: number = 10;
  pageSizeOptions: number[] = [10];
  pageIndex = 0;
  tradeService = inject(TradeService);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      if (params.page) {
        this.pageIndex = params.page - 1;
      } else {
        this.navigateToDefaultParams();
      }
    });
  }
  handlePageEvnt(event: any) {
    const pageIdx = this.setPageIndex(event);
    this.router.navigate([], {
      queryParams: { page: pageIdx }, // Preserve other existing query params
    });
  }

  setPageIndex(event: any) {
    const { previousPageIndex, pageIndex } = event;
    if (previousPageIndex >= 0) {
      return pageIndex + 1;
    }
  }

  navigateToDefaultParams() {
    this.router.navigate([], {
      queryParams: { page: 1 },
    });
  }
}
