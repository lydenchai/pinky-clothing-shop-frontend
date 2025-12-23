// @ts-ignore
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Chart, registerables } from 'chart.js';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { MatIconModule } from '@angular/material/icon';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-analytic',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule],
  templateUrl: './analytic.html',
  styleUrls: ['./analytic.scss'],
})
export class Analytic implements OnInit, AfterViewInit {
  private eventChartInit = false;
  ngAfterViewInit() {
    this.eventChartInit = true;
    // Try to render chart if data is already loaded
    if (this.events.length) {
      setTimeout(() => this.renderEventChart(), 0);
    }
  }
  events: any[] = [];
  summary: any = null;
  error: string | null = null;
  chart: Chart | null = null;
  salesChart: Chart | null = null;

  constructor(private analyticService: AnalyticsService) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.fetchSummary();
    this.fetchEvents();
  }

  logTestEvent() {
    this.analyticService.logEvent('test_event', { foo: 'bar' }).subscribe({
      next: () => {
        this.refresh();
      },
      error: (err) => {
        alert('Failed to log test event: ' + (err?.error?.message || err));
      },
    });
  }

  fetchSummary() {
    (this.analyticService as any).getSummary().subscribe({
      next: (res: any) => {
        this.summary = res.data;
        this.renderSalesChart();
      },
    });
  }

  fetchEvents() {
    (this.analyticService as any).getEvents().subscribe({
      next: (events: any[]) => {
        this.events = events;
        // Only render if view is initialized
        if (this.eventChartInit) {
          setTimeout(() => this.renderEventChart(), 0);
        }
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Failed to load analytics.';
      },
    });
  }

  renderSalesChart() {
    if (!this.summary?.salesByDay?.length) return;
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (!ctx) return;
    // Format date as dd-MM-yyyy
    const labels = this.summary.salesByDay.map((d: any) => {
      const date = new Date(d.date);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    });
    const data = this.summary.salesByDay.map((d: any) => d.sales);
    if (this.salesChart) this.salesChart.destroy();
    this.salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Sales',
            data,
            fill: true,
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            borderColor: '#1976d2',
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: true } },
      },
    });
  }

  renderEventChart() {
    if (!this.events.length) return;
    const ctx = document.getElementById('eventTypeChart') as HTMLCanvasElement;
    if (!ctx) return;
    const typeCounts: Record<string, number> = {};
    this.events.forEach((e) => {
      typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
    });

    // Sort event types by count descending
    const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
    const labels = sortedTypes.map(([type]) => type);
    const values = sortedTypes.map(([, count]) => count);
    // Generate distinct colors
    const colorPalette = [
      '#1976d2',
      '#388e3c',
      '#fbc02d',
      '#d32f2f',
      '#7b1fa2',
      '#0288d1',
      '#c2185b',
      '#ffa000',
      '#388e3c',
      '#455a64',
    ];
    const backgroundColor = labels.map(
      (_, i) => colorPalette[i % colorPalette.length] + '80'
    );
    const borderColor = labels.map(
      (_, i) => colorPalette[i % colorPalette.length]
    );
    const data = {
      labels,
      datasets: [
        {
          label: 'Event Count',
          data: values,
          backgroundColor,
          borderColor,
          borderWidth: 1,
        },
      ],
    };
    if (this.chart) this.chart.destroy();
    this.chart = new Chart(ctx, {
      type: 'bar',
      data,
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
          datalabels: {
            anchor: 'end',
            align: 'end',
            color: '#333',
            font: { weight: 'bold' },
            formatter: (value: any) => value,
            display: true,
          },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
      plugins: [ChartDataLabels],
    });
  }
}
