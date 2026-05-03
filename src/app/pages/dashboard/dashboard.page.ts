import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit, AfterViewInit {
  @ViewChild('salesChart') salesChartRef!: ElementRef;
  @ViewChild('productsChart') productsChartRef!: ElementRef;

  stats?: DashboardStats;
  loading = true;
  salesChart?: Chart;
  productsChart?: Chart;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadStats();
  }

  ngAfterViewInit() {
    // We'll initialize charts once data is loaded
  }

  loadStats(event?: any) {
    if (!event) this.loading = true;
    
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        setTimeout(() => this.initCharts(), 100);
        if (event) event.target.complete();
      },
      error: (err) => {
        console.error('Error loading dashboard stats', err);
        this.loading = false;
        if (event) event.target.complete();
      }
    });
  }

  handleRefresh(event: any) {
    this.loadStats(event);
  }

  initCharts() {
    if (!this.stats || !this.salesChartRef) return;

    if (this.salesChart) this.salesChart.destroy();
    if (this.productsChart) this.productsChart.destroy();

    // Sales History Chart (Line)
    this.salesChart = new Chart(this.salesChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.stats.salesHistory.map(s => s.label),
        datasets: [{
          label: 'Ventes (USD)',
          data: this.stats.salesHistory.map(s => s.value),
          borderColor: '#3880ff',
          backgroundColor: 'rgba(56, 128, 255, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    // Top Products Chart (Doughnut)
    this.productsChart = new Chart(this.productsChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.stats.topProducts.map(p => p.label),
        datasets: [{
          data: this.stats.topProducts.map(p => p.value),
          backgroundColor: [
            '#3880ff', '#3dc2ff', '#5260ff', '#2dd36f', '#ffc409', '#eb445a'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}
