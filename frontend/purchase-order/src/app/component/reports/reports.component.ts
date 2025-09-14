import { Component, OnInit } from '@angular/core';
import { PurchaseOrderService } from '../../service/purchase-order-service';
import { PurchaseOrder, PurchaseOrderStatus, PURCHASE_ORDER_STATUS_OPTIONS } from '../../model/purchase-order.model';
import { CommonModule, DatePipe, CurrencyPipe, NgClass } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-reports',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div class="relative z-10 max-w-7xl mx-auto p-6">
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent p-2">
            Reports
          </h1>
          <p class="text-gray-600 text-lg">Summary of all purchase orders</p>
        </div>
        <!-- Chart Section -->
        <div class="bg-white/80 rounded-2xl shadow-xl p-6 mb-8 border border-white/30">
          <h2 class="text-2xl font-semibold mb-4 text-indigo-700">Total Amount by Status</h2>
          <canvas baseChart
            [data]="barChartData"
            [options]="barChartOptions"
            [type]="barChartType"
            [labels]="barChartLabels"
            class="w-full max-w-2xl mx-auto h-96"
          ></canvas>
        </div>
        <!-- Summary Section -->
        <div class="bg-white/80 rounded-2xl shadow-xl p-8 mb-8 border border-white/30">
          <h2 class="text-2xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
            <svg class="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2v-5a2 2 0 00-2-2h-1V7a5 5 0 00-10 0v5H5a2 2 0 00-2 2v5a2 2 0 002 2z"/></svg>
            Summary
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <!-- Total Orders Card -->
            <div class="flex flex-col items-center bg-gradient-to-br from-indigo-100 via-blue-50 to-white rounded-xl shadow p-6 border border-indigo-100">
              <div class="bg-indigo-500/10 rounded-full p-3 mb-2">
                <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7"/><path stroke-linecap="round" stroke-linejoin="round" d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z"/></svg>
              </div>
              <div class="text-4xl font-extrabold text-indigo-700">{{ purchaseOrders.length }}</div>
              <div class="text-gray-500 mt-1 font-medium">Total Orders</div>
            </div>
            <!-- Total Amount Card -->
            <div class="flex flex-col items-center bg-gradient-to-br from-green-100 via-teal-50 to-white rounded-xl shadow p-6 border border-green-100">
              <div class="bg-green-500/10 rounded-full p-3 mb-2">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 10v4m8-8a8 8 0 11-16 0 8 8 0 0116 0z"/></svg>
              </div>
              <div class="text-4xl font-extrabold text-green-700">{{ totalAmount | currency }}</div>
              <div class="text-gray-500 mt-1 font-medium">Total Amount</div>
            </div>
            <!-- Status Cards -->
            <ng-container *ngFor="let status of statusOptions">
              <div class="flex flex-col items-center rounded-xl shadow p-6 border"
                [ngClass]="{
                  'bg-gradient-to-br from-blue-100 via-blue-50 to-white border-blue-100': status === 'Draft',
                  'bg-gradient-to-br from-green-100l via-green-50 to-white border-green-100': status === 'Approved',
                  'bg-gradient-to-br from-yellow-100 via-yellow-50 to-white border-yellow-100': status === 'Shipped',
                  'bg-gradient-to-br from-gray-100 via-gray-50 to-white border-gray-100': status === 'Completed',
                  'bg-gradient-to-br from-red-100 via-red-50 to-white border-red-100': status === 'Cancelled'
                }">
                <div class="rounded-full p-3 mb-2"
                  [ngClass]="{
                    'bg-blue-500/10': status === 'Draft',
                    'bg-green-500/10': status === 'Approved',
                    'bg-yellow-500/10': status === 'Shipped',
                    'bg-gray-500/10': status === 'Completed',
                    'bg-red-500/10': status === 'Cancelled'
                  }">
                  <ng-container [ngSwitch]="status">
                    <svg *ngSwitchCase="'Draft'" class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 20h9"/><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.5a2.121 2.121 0 113 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                    <svg *ngSwitchCase="'Approved'" class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <svg *ngSwitchCase="'Shipped'" class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h1l2 9a2 2 0 002 2h8a2 2 0 002-2l2-9h1"/><circle cx="7.5" cy="19.5" r="1.5"/><circle cx="16.5" cy="19.5" r="1.5"/></svg>
                    <svg *ngSwitchCase="'Completed'" class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <svg *ngSwitchCase="'Cancelled'" class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </ng-container>
                </div>
                <div class="text-3xl font-extrabold" [ngClass]="statusColorClass(status)">{{ countByStatus[status] || 0 }}</div>
                <div class="text-gray-500 mt-1 font-medium">{{ status }}</div>
              </div>
            </ng-container>
        <!-- End of Summary Section -->
          </div>
        </div>
        <!-- Table Section -->
        <div class="bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-teal-600/90 text-white">
                  <th class="px-6 py-4 text-left font-bold uppercase tracking-wider">PO Number</th>
                  <th class="px-6 py-4 text-left font-bold uppercase tracking-wider">Supplier</th>
                  <th class="px-6 py-4 text-left font-bold uppercase tracking-wider">Order Date</th>
                  <th class="px-6 py-4 text-left font-bold uppercase tracking-wider">Total Amount</th>
                  <th class="px-6 py-4 text-left font-bold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200/50">
                <tr *ngFor="let po of purchaseOrders" class="transition-all duration-300 hover:bg-white/80 hover:shadow-lg group">
                  <td class="px-6 py-4 font-mono font-bold text-gray-900">{{ po.poNumber }}</td>
                  <td class="px-6 py-4 font-medium text-gray-900">{{ po.supplierName }}</td>
                  <td class="px-6 py-4 text-gray-700 font-medium">{{ po.orderDate | date }}</td>
                  <td class="px-6 py-4 font-bold text-green-700">{{ po.totalAmount | currency }}</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-md"
                      [ngClass]="{
                        'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800': po.status === 'Draft',
                        'bg-gradient-to-r from-green-100 to-green-200 text-green-800': po.status === 'Approved',
                        'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800': po.status === 'Shipped',
                        'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800': po.status === 'Completed',
                        'bg-gradient-to-r from-red-100 to-red-200 text-red-800': po.status === 'Cancelled'
                      }">
                      <div class="w-2 h-2 rounded-full animate-pulse"
                        [ngClass]="{
                          'bg-blue-600': po.status === 'Draft',
                          'bg-green-600': po.status === 'Approved',
                          'bg-yellow-600': po.status === 'Shipped',
                          'bg-gray-600': po.status === 'Completed',
                          'bg-red-600': po.status === 'Cancelled'
                        }"></div>
                      {{ po.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div *ngIf="loading" class="flex flex-col items-center justify-center h-64 bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 mt-8">
          <div class="relative">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
            <div class="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-indigo-400 opacity-20"></div>
          </div>
          <p class="mt-4 text-gray-600 font-medium">Loading purchase orders...</p>
        </div>
        <div *ngIf="!loading && !purchaseOrders.length" class="flex flex-col items-center justify-center h-64 bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 mt-8">
          <svg class="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-500 mb-2">No Purchase Orders Found</h3>
          <p class="text-gray-400 text-center max-w-md">No purchase orders available for reports.</p>
        </div>
      </div>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, BaseChartDirective],
})
export class ReportsComponent implements OnInit {
  purchaseOrders: PurchaseOrder[] = [];
  loading = false;
  totalAmount = 0;
  countByStatus: { [key in PurchaseOrderStatus]?: number } = {};
  statusOptions = PURCHASE_ORDER_STATUS_OPTIONS;

  // Chart.js
  barChartLabels: string[] = this.statusOptions;
  barChartData: ChartConfiguration['data'] = {
    labels: this.barChartLabels,
    datasets: [
      {
        data: [],
        label: 'Total Amount',
        backgroundColor: [
          '#3b82f6', // Draft
          '#22c55e', // Approved
          '#eab308', // Shipped
          '#64748b', // Completed
          '#ef4444', // Cancelled
        ],
      },
    ],
  };
  barChartType: ChartType = 'bar';
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: {},
      y: { beginAtZero: true },
    },
  };

  constructor(private purchaseOrderService: PurchaseOrderService) {}

  ngOnInit() {
    this.loading = true;
    this.purchaseOrderService.fetchAll().subscribe({
      next: (res) => {
        if (res.success) {
          this.purchaseOrders = res.data;
          this.calculateSummary();
          this.updateChart();
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  calculateSummary() {
    this.totalAmount = this.purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);
    this.countByStatus = {};
    for (const status of this.statusOptions) {
      this.countByStatus[status] = this.purchaseOrders.filter(po => po.status === status).length;
    }
  }

  updateChart() {
    const data = this.statusOptions.map(status => {
      return this.purchaseOrders
        .filter(po => po.status === status)
        .reduce((sum, po) => sum + po.totalAmount, 0);
    });
    this.barChartData = {
      labels: this.barChartLabels,
      datasets: [
        {
          data,
          label: 'Total Amount',
          backgroundColor: [
            '#3b82f6', // Draft
            '#22c55e', // Approved
            '#eab308', // Shipped
            '#64748b', // Completed
            '#ef4444', // Cancelled
          ],
        },
      ],
    };
  }

  statusColorClass(status: PurchaseOrderStatus) {
    switch (status) {
      case 'Draft': return 'text-blue-600';
      case 'Approved': return 'text-green-600';
      case 'Shipped': return 'text-yellow-600';
      case 'Completed': return 'text-gray-600';
      case 'Cancelled': return 'text-red-600';
      default: return '';
    }
  }
}
