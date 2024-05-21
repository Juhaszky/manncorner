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
  pageIndex = 1;
  tradeService = inject(TradeService);

  ngOnInit(): void {
    this.navigateToDefaultParams();
  }
  handlePageEvnt(event: any) {
    const pageIdx = this.setPageIndex(event);
    console.log(pageIdx);
    this.router.navigate([], {
      queryParams: { page: pageIdx, pageSize: this.pageSize },
    });
  }

  setPageIndex(event: any) {
    const { previousPageIndex, pageIndex } = event;
    if (previousPageIndex) {
      if (previousPageIndex < pageIndex) {
        return pageIndex + 1;
      } else {
        return pageIndex > 1 ? pageIndex - 1 : 1;
      }
    }
  }

  navigateToDefaultParams() {
    this.router.navigate([], {
      queryParams: { page: 1, pageSize: 10 },
    });
  }
}
