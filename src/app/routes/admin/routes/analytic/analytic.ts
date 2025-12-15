import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Chart, registerables } from 'chart.js';
import { AnalyticsService } from '../../../../services/analytics.service';
import { AnalyticsEvent } from '../../../../types/analytic';

Chart.register(...registerables);

@Component({
  selector: 'app-analytic',
  standalone: true,
  imports: [CommonModule, DatePipe, TranslateModule],
  templateUrl: './analytic.html',
  styleUrls: ['./analytic.scss'],
})
export class Analytic implements OnInit {
  events: AnalyticsEvent[] = [];
  loading = false;
  error: string | null = null;
  chart: Chart | null = null;

  constructor(private analyticService: AnalyticsService) {}

  ngOnInit() {
    this.fetchEvents();
  }

  fetchEvents() {
    this.loading = true;
    this.analyticService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
        this.renderChart();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load analytics.';
        this.loading = false;
      },
    });
  }

  renderChart() {
    if (!this.events.length) return;
    const ctx = document.getElementById('eventTypeChart') as HTMLCanvasElement;
    if (!ctx) return;
    const typeCounts: Record<string, number> = {};
    this.events.forEach((e) => {
      typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
    });
    const data = {
      labels: Object.keys(typeCounts),
      datasets: [
        {
          label: 'Event Count',
          data: Object.values(typeCounts),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
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
        plugins: { legend: { display: false } },
      },
    });
  }
}
