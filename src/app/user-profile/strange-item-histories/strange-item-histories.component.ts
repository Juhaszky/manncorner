import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { SideBarComponent } from './side-bar/side-bar.component';
import {
  StrangeItemStatHistory,
  StrangeItemStatWithItemDto,
} from '../../../shared/models/strangeItemStatHistory.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { map } from 'rxjs';
import { HistoryChartComponent } from './history-chart/history-chart.component';

@Component({
  selector: 'app-strange-item-histories',
  imports: [
    SideBarComponent,
    ReactiveFormsModule,
    FormsModule,
    HistoryChartComponent
],
  templateUrl: './strange-item-histories.component.html',
  styleUrl: './strange-item-histories.component.scss',
})
export class StrangeItemHistoriesComponent implements OnInit {
  http = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);
  data: StrangeItemStatWithItemDto[] = [];
  historyMap: Map<
    string,
    { stat: StrangeItemStatHistory; itemData: { name: string; id: string } }
  > = new Map<
    string,
    { stat: StrangeItemStatHistory; itemData: { name: string; id: string } }
  >();
  datePipe = new DatePipe('hu-HU');
  chartData = {};
  ngOnInit(): void {
    this.http
      .get<StrangeItemStatWithItemDto[]>(
        `${environment.API_URL}/api/StrangeItemStatHistory/histories`
      )
      .pipe(
        map(res => {
          res.sort((a, b) => a.item.name.localeCompare(b.item.name));
          res.forEach(stat =>
            this.historyMap.set(stat.item.id, {
              stat: stat.stat,
              itemData: { name: stat.item.name, id: stat.item.id },
            })
          );

          return res;
        })
      )
      .subscribe(res => {
        this.data = [...res];
        this.cdr.detectChanges();
      });
  }
  handleSelection(
    selectedItems: { name: string; img: string; code: string }[]
  ) {
    const selectedStats = selectedItems
      .map(item => this.historyMap.get(item.code))
      .filter(stat => stat !== undefined);

    if (!selectedStats || selectedStats.length === 0) {
      this.chartData = {};
      return;
    }

    const allDatesSet = new Set<string>();
    selectedStats.forEach(statItem => {
      statItem.stat.counters.forEach((c: any) => allDatesSet.add(c.changeDate));
    });
    const labels = Array.from(allDatesSet)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map(d => new Date(d).toLocaleDateString());

    const datasets = selectedStats.map(statItem => {
      const dateToCounter = new Map<string, number>();
      statItem.stat.counters.forEach((c: any) => {
        const date = new Date(c.changeDate);
        const formatted = `${date.getFullYear()}. ${('0' + (date.getMonth() + 1)).slice(-2)}. ${('0' + date.getDate()).slice(-2)}.`;
        dateToCounter.set(formatted, c.value);
      });
      const data = labels.map(labelDateStr => {
        const date = new Date(labelDateStr);
        const formatted = `${date.getFullYear()}. ${('0' + (date.getMonth() + 1)).slice(-2)}. ${('0' + date.getDate()).slice(-2)}.`;
        if (formatted) {
          return dateToCounter.get(formatted) ?? 0;
        }
        return 0;
      });
      return {
        label: statItem.itemData.name,
        data,
        fill: false,
        borderColor: this.generateColorFor(statItem.itemData.id),
        tension: 0.4,
      };
    });
    this.chartData = { labels, datasets };
  }
  generateColorFor(id: string): string {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
    const index = Math.abs(this.hashString(id)) % colors.length;
    return colors[index];
  }

  hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}
