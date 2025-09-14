import { Component, OnInit } from '@angular/core';
import { PurchaseOrderService } from '../../service/purchase-order-service';
import { PurchaseOrder } from '../../model/purchase-order.model';
import { CommonModule, DatePipe, CurrencyPipe, NgClass } from '@angular/common';

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
  imports: [CommonModule, DatePipe, CurrencyPipe],
})
export class ReportsComponent implements OnInit {
  purchaseOrders: PurchaseOrder[] = [];
  loading = false;
  constructor(private purchaseOrderService: PurchaseOrderService) {}
  ngOnInit() {
    this.loading = true;
    this.purchaseOrderService.fetchAll().subscribe({
      next: (res) => {
        if (res.success) {
          this.purchaseOrders = res.data;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
