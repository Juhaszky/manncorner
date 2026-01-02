import { isPlatformBrowser } from '@angular/common';
import { Component, inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-history-chart',
  imports: [ChartModule],
  templateUrl: './history-chart.component.html',
  styleUrl: './history-chart.component.scss',
})
export class HistoryChartComponent implements OnInit {
  options: any;
  @Input() data: any;
  platformId = inject(PLATFORM_ID);
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--p-text-muted-color'
      );
      const surfaceBorder = documentStyle.getPropertyValue(
        '--p-content-border-color'
      );

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
        },
      };
    }
  }
}
