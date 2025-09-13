import { Component, OnInit } from '@angular/core';
import { PurchaseOrderService } from '../../service/purchase-order-service';
import { PurchaseOrder, ApiResponse } from '../../model/purchase-order.model';
import { PurchaseOrderFormComponent } from '../purchase-order-form-component/purchase-order-form-component';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-purchase-order-list',
  standalone: true,
  imports: [CommonModule, DatePipe, NgIf, FormsModule, PurchaseOrderFormComponent],
  template: `

    <div class="max-w-6xl mx-auto p-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 class="text-4xl font-extrabold text-blue-800 tracking-tight drop-shadow">Purchase Order Management</h1>
        <button
          class="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-blue-500 transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          (click)="openAddModel()"
        >
          <span class="text-2xl">+</span>
          <span>Add New PO</span>
        </button>
      </div>

      <!-- Filter Bar -->
      <div class="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap gap-4 items-end border border-blue-100">
        <div>
          <label class="block text-xs font-semibold text-blue-700 mb-1">Supplier</label>
          <select class="border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300" [(ngModel)]="filterSupplier">
            <option value="">All</option>
            <option *ngFor="let s of supplierList" [value]="s">{{ s }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-blue-700 mb-1">Status</label>
          <select class="border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300" [(ngModel)]="filterStatus">
            <option value="">All</option>
            <option *ngFor="let st of statusList" [value]="st">{{ st }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-blue-700 mb-1">Start Date</label>
          <input type="date" class="border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300" [(ngModel)]="filterStartDate" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-blue-700 mb-1">End Date</label>
          <input type="date" class="border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300" [(ngModel)]="filterEndDate" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-blue-700 mb-1">Price Range</label>
          <select class="border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300" [(ngModel)]="filterPriceRange">
            <option *ngFor="let range of priceRanges" [value]="range.value">{{ range.label }}</option>
          </select>
        </div>
        <button (click)="clearFilters()" class="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 text-gray-700 font-semibold shadow hover:from-gray-300 hover:to-gray-200 border border-gray-300">Clear</button>
      </div>

      <h2 class="text-2xl font-bold text-blue-700 mb-4">Purchase Orders</h2>
      <div *ngIf="loading" class="flex justify-center items-center h-32">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>

      <div class="overflow-x-auto rounded-2xl shadow-lg border border-blue-100" *ngIf="!loading && sortedPurchaseOrders.length">
        <table class="min-w-full bg-white text-sm">
          <thead class="sticky top-0 z-10">
            <tr class="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-900">
              <th class="px-5 py-3 text-left font-bold uppercase tracking-wider cursor-pointer select-none" (click)="setSort('poNumber')">
                PO Number
                <span [ngClass]="sortField === 'poNumber' ? 'text-blue-700 font-bold' : 'text-gray-400'">
                  ▲
                </span>
                <span [ngClass]="sortField === 'poNumber' ? 'text-blue-700 font-bold' : 'text-gray-400'">
                  ▼
                </span>
              </th>
              <th class="px-5 py-3 text-left font-bold uppercase tracking-wider">Supplier</th>
              <th class="px-5 py-3 text-left font-bold uppercase tracking-wider cursor-pointer select-none" (click)="setSort('orderDate')">
                Order Date
                <span [ngClass]="sortField === 'orderDate' ? 'text-blue-700 font-bold' : 'text-gray-400'">
                  ▲
                </span>
                <span [ngClass]="sortField === 'orderDate' ? 'text-blue-700 font-bold' : 'text-gray-400'">
                  ▼
                </span>
              </th>
              <th class="px-5 py-3 text-left font-bold uppercase tracking-wider cursor-pointer select-none" (click)="setSort('totalAmount')">
                Total Amount
                <span [ngClass]="sortField === 'totalAmount' ? 'text-blue-700 font-bold' : 'text-gray-400'">
                  ▲
                </span>
                <span [ngClass]="sortField === 'totalAmount' ? 'text-blue-700 font-bold' : 'text-gray-400'">
                  ▼
                </span>
              </th>
              <th class="px-5 py-3 text-left font-bold uppercase tracking-wider">Status</th>
              <th class="px-5 py-3 text-left font-bold uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let po of sortedPurchaseOrders; let i = index" [ngClass]="i % 2 === 0 ? 'bg-white' : 'bg-blue-50'" class="border-b transition hover:bg-blue-100">
              <td class="px-5 py-3 font-mono text-blue-900">{{ po.poNumber }}</td>
              <td class="px-5 py-3">{{ po.supplierName }}</td>
              <td class="px-5 py-3">{{ po.orderDate | date }}</td>
              <td class="px-5 py-3 font-semibold text-blue-700">{{ po.totalAmount | currency }}</td>
              <td class="px-5 py-3">
                <span
                  class="inline-block px-3 py-1 rounded-full text-xs font-bold shadow-sm"
                  [ngClass]="{
                    'bg-blue-100 text-blue-700': po.status === 'Draft',
                    'bg-green-100 text-green-700': po.status === 'Approved',
                    'bg-yellow-100 text-yellow-700': po.status === 'Shipped',
                    'bg-gray-200 text-gray-700': po.status === 'Completed',
                    'bg-red-100 text-red-700': po.status === 'Cancelled'
                  }"
                  >{{ po.status }}</span>
              </td>
              <td class="px-5 py-3 flex gap-2">
                <button
                  class="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition border border-blue-200 shadow-sm"
                  (click)="openAddModel(); editingPO = po"
                >
                  Edit
                </button>
                <button
                  class="px-3 py-1 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition border border-red-200 shadow-sm"
                  (click)="deletingPO = po; showDeleteModal = true"
                >
                  Delete
                </button>
                <button
                  class="px-3 py-1 rounded-lg bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition border border-green-200 shadow-sm"
                  (click)="viewItem(po)"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div *ngIf="!loading && !filteredPurchaseOrders.length" class="text-center text-gray-400 mt-8 text-lg font-semibold">
        No purchase orders found.
      </div>

  <!-- Add/Edit Modal -->
      <!-- View Details Modal -->
      <div *ngIf="showViewModal" class="modal-overlay flex items-center justify-center z-50 fixed inset-0 bg-black bg-opacity-40" (click)="closeViewModal()">
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 relative animate-fade-in-up pointer-events-auto border border-blue-100"
          (click)="$event.stopPropagation()"
        >
          <div class="flex justify-between items-center border-b px-8 py-5 bg-blue-50 rounded-t-2xl">
            <h2 class="text-2xl font-bold text-blue-700 tracking-wide">Purchase Order Details</h2>
            <button
              (click)="closeViewModal()"
              class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-blue-100 text-2xl text-blue-400 hover:text-blue-700 transition"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div class="p-8" *ngIf="viewingPO">
            <dl class="grid grid-cols-1 gap-y-4 gap-x-8 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">PO Number</dt>
                <dd class="mt-1 text-lg font-semibold text-gray-900">{{ viewingPO.poNumber }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Status</dt>
                <dd class="mt-1">
                  <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                    [ngClass]="{
                      'bg-blue-100 text-blue-700': viewingPO.status === 'Draft',
                      'bg-green-100 text-green-700': viewingPO.status === 'Approved',
                      'bg-yellow-100 text-yellow-700': viewingPO.status === 'Shipped',
                      'bg-gray-200 text-gray-700': viewingPO.status === 'Completed',
                      'bg-red-100 text-red-700': viewingPO.status === 'Cancelled'
                    }"
                  >{{ viewingPO.status }}</span>
                </dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-sm font-medium text-gray-500">Description</dt>
                <dd class="mt-1 text-gray-900">{{ viewingPO.description }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Supplier</dt>
                <dd class="mt-1 text-gray-900">{{ viewingPO.supplierName }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Order Date</dt>
                <dd class="mt-1 text-gray-900">{{ viewingPO.orderDate | date }}</dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-sm font-medium text-gray-500">Total Amount</dt>
                <dd class="mt-1 text-gray-900">{{ viewingPO.totalAmount | currency }}</dd>
              </div>
            </dl>
          </div>
          <div class="p-8 text-center text-gray-500" *ngIf="viewLoading">Loading...</div>
        </div>
      </div>
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div
          class="bg-white rounded-xl shadow-lg w-full max-w-xl mx-4 relative animate-fade-in-up z-10 pointer-events-auto"
          (click)="$event.stopPropagation()"
        >
          <div class="flex justify-between items-center border-b px-6 py-4">
            <h2 class="text-xl font-bold text-blue-700">
              {{ editingPO ? 'Edit Purchase Order' : 'Add New Purchase Order' }}
            </h2>
            <button
              (click)="closeModal()"
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-2xl text-gray-400 hover:text-gray-700 transition"
            >
              ×
            </button>
          </div>
          <div class="p-6">
            <app-purchase-order-form-component
              [purchaseOrderToEdit]="editingPO"
              (formSubmit)="onFormSubmit($event)"
              (formClose)="closeModal()"
            >
            </app-purchase-order-form-component>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteModal" class="modal-overlay" (click)="showDeleteModal = false">
        <div
          class="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 relative animate-fade-in-up z-10 pointer-events-auto"
          (click)="$event.stopPropagation()"
        >
          <div class="p-6">
            <h2 class="text-xl font-bold text-red-600 mb-4">Confirm Deletion</h2>
            <p class="mb-6">
              Are you sure you want to delete PO <strong>{{ deletingPO?.poNumber }}</strong
              >?
            </p>
            <div class="flex justify-end gap-4">
              <button
                (click)="showDeleteModal = false"
                class="px-6 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                (click)="confirmDelete()"
                class="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-800 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class PurchaseOrderListComponent implements OnInit {
  // Sorting state
  sortField: 'poNumber' | 'orderDate' | 'totalAmount' = 'poNumber';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Filtering state for UI
  filterSupplier: string = '';
  filterStatus: string = '';
  filterStartDate: string = '';
  filterEndDate: string = '';
  filterPriceRange: string = '';
  priceRanges: { label: string; value: string }[] = [ { label: 'All', value: '' } ];
  supplierList: string[] = [];
  statusList: string[] = [];


  // Computed filtered list (for filtering only)
  get filteredPurchaseOrders(): PurchaseOrder[] {
    const toDateString = (d: string) => {
      if (!d) return '';
      if (d.length >= 10 && d[4] === '-' && d[7] === '-') {
        return d.substring(0, 10);
      }
      const date = new Date(d);
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${date.getFullYear()}-${mm}-${dd}`;
    };
    return this.purchaseOrders.filter(po => {
      const supplierMatch = !this.filterSupplier || po.supplierName === this.filterSupplier;
      const statusMatch = !this.filterStatus || po.status === this.filterStatus;
      const poDate = toDateString(po.orderDate);
      const startDate = toDateString(this.filterStartDate);
      const endDate = toDateString(this.filterEndDate);
      const startDateMatch = !startDate || poDate >= startDate;
      const endDateMatch = !endDate || poDate <= endDate;
      let priceMatch = true;
      if (this.filterPriceRange === '0-500') priceMatch = po.totalAmount >= 0 && po.totalAmount <= 500;
      else if (this.filterPriceRange === '500-1000') priceMatch = po.totalAmount > 500 && po.totalAmount <= 1000;
      else if (this.filterPriceRange === '1000+') priceMatch = po.totalAmount > 1000;
      return supplierMatch && statusMatch && startDateMatch && endDateMatch && priceMatch;
    });
  }

  // Sorted and filtered list (for display)
  get sortedPurchaseOrders(): PurchaseOrder[] {
    const arr = [...this.filteredPurchaseOrders];
    arr.sort((a, b) => {
      let aVal: any, bVal: any;
      switch (this.sortField) {
        case 'poNumber':
          aVal = a.poNumber;
          bVal = b.poNumber;
          break;
        case 'orderDate':
          aVal = new Date(a.orderDate).getTime();
          bVal = new Date(b.orderDate).getTime();
          break;
        case 'totalAmount':
          aVal = a.totalAmount;
          bVal = b.totalAmount;
          break;
        default:
          aVal = a.poNumber;
          bVal = b.poNumber;
      }
      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    // If descending, show ▼ first, else ▲ first (handled by icon color above)
    return arr;
  }

  setSort(field: 'poNumber' | 'orderDate' | 'totalAmount') {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  clearFilters() {
    this.filterSupplier = '';
    this.filterStatus = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
  }
  purchaseOrders: PurchaseOrder[] = [];
  displayedColumns: string[] = [
    'poNumber',
    'description',
    'supplierName',
    'orderDate',
    'totalAmount',
    'status',
  ];
  loading = false;
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  editingPO: PurchaseOrder | null = null;
  deletingPO: PurchaseOrder | null = null;
  showViewModal: boolean = false;
  viewingPO: PurchaseOrder | null = null;
  viewLoading: boolean = false;
  isEditing: boolean = false;

  constructor(private purchaseOrderService: PurchaseOrderService) {}

  ngOnInit() {
    this.fetchPurchaseOrders();
    this.purchaseOrderService.getStatusOptions().subscribe({
      next: (res: ApiResponse<string[]>) => {
        if (res.success) {
          this.statusList = res.data;
        }
      }
    });
  }
  fetchPurchaseOrders() {
    this.loading = true;
    this.purchaseOrderService.fetchAll().subscribe({
      next: (res: ApiResponse<PurchaseOrder[]>) => {
        if (res.success) {
          this.purchaseOrders = res.data;
          // Populate supplier list (unique names)
          this.supplierList = Array.from(new Set(res.data.map(po => po.supplierName))).sort();
          // Dynamically build priceRanges based on data
          const has0_500 = res.data.some(po => po.totalAmount >= 0 && po.totalAmount <= 500);
          const has500_1000 = res.data.some(po => po.totalAmount > 500 && po.totalAmount <= 1000);
          const has1000plus = res.data.some(po => po.totalAmount > 1000);
          this.priceRanges = [ { label: 'All', value: '' } ];
          if (has0_500) this.priceRanges.push({ label: '0 - 500', value: '0-500' });
          if (has500_1000) this.priceRanges.push({ label: '500 - 1000', value: '500-1000' });
          if (has1000plus) this.priceRanges.push({ label: '1000+', value: '1000+' });
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
  openAddModel() {
    this.showModal = true;
    this.editingPO = null;
  }
  closeModal() {
    this.showModal = false;
    this.editingPO = null;
  }

  onFormSubmit(event: any) {
    this.fetchPurchaseOrders();
    // Modal will close via (formClose)
  }
  viewItem(po: PurchaseOrder) {
    this.showViewModal = true;
    this.viewingPO = null;
    this.viewLoading = true;
  this.purchaseOrderService.getById(po.id!).subscribe({
      next: (res: ApiResponse<PurchaseOrder>) => {
        if (res.success) {
          this.viewingPO = res.data;
        }
        this.viewLoading = false;
      },
      error: () => {
        this.viewLoading = false;
      },
    });
  }

  closeViewModal() {
    this.showViewModal = false;
    this.viewingPO = null;
    this.viewLoading = false;
  }
  confirmDelete() {
    if (this.deletingPO) {
      this.purchaseOrderService.delete(this.deletingPO.id!).subscribe({
        next: (res) => {
          this.fetchPurchaseOrders();
          this.showDeleteModal = false;
          this.deletingPO = null;
          console.log('Deleted successfully');
        },
        error: () => {
          this.showDeleteModal = false;
        },
      });
    }
  }

  setEditMode(po: PurchaseOrder) {
    console.log('setEditMode', po);
    this.isEditing = true;
    this.editingPO = po;
  }
}
