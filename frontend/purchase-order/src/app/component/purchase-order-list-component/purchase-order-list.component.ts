import { Component, OnInit } from '@angular/core';
import { PurchaseOrderService } from '../../service/purchase-order-service';
import { PurchaseOrder, ApiResponse } from '../../model/purchase-order.model';
import { PurchaseOrderFormComponent } from '../purchase-order-form-component/purchase-order-form-component';
import { CommonModule, DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-purchase-order-list',
  standalone: true,
  imports: [CommonModule, DatePipe, NgIf, PurchaseOrderFormComponent],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 class="text-3xl font-bold text-blue-700">Purchase Order Management</h1>
        <button
          class="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-800 transition flex items-center gap-2"
          (click)="openAddModel()"
        >
          <span class="text-xl">+</span>
          <span>Add New PO</span>
        </button>
      </div>

      <h2 class="text-xl font-semibold text-gray-800 mb-4">Purchase Orders</h2>
      <div *ngIf="loading" class="flex justify-center items-center h-32">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"
        ></div>
      </div>

      <div
        class="overflow-x-auto rounded-lg shadow border border-gray-200"
        *ngIf="!loading && purchaseOrders.length"
      >
        <table class="min-w-full bg-white">
          <thead>
            <tr class="bg-blue-50 text-blue-900">
              <th class="px-4 py-3 text-left font-semibold">PO Number</th>
              <th class="px-4 py-3 text-left font-semibold">Supplier</th>
              <th class="px-4 py-3 text-left font-semibold">Order Date</th>
              <th class="px-4 py-3 text-left font-semibold">Total Amount</th>
              <th class="px-4 py-3 text-left font-semibold">Status</th>
              <th class="px-4 py-3 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let po of purchaseOrders" class="border-b hover:bg-blue-50 transition">
              <td class="px-4 py-2">{{ po.poNumber }}</td>
              <td class="px-4 py-2">{{ po.supplierName }}</td>
              <td class="px-4 py-2">{{ po.orderDate | date }}</td>
              <td class="px-4 py-2">{{ po.totalAmount }}</td>
              <td class="px-4 py-2">
                <span
                  class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                  [ngClass]="{
                    'bg-blue-100 text-blue-700': po.status === 'Draft',
                    'bg-green-100 text-green-700': po.status === 'Approved',
                    'bg-yellow-100 text-yellow-700': po.status === 'Shipped',
                    'bg-gray-200 text-gray-700': po.status === 'Completed',
                    'bg-red-100 text-red-700': po.status === 'Cancelled'
                  }"
                  >{{ po.status }}</span
                >
              </td>
              <td class="px-4 py-2">
                <button
                  class="text-blue-600 hover:underline mr-4"
                  (click)="openAddModel(); editingPO = po"
                >
                  Edit
                </button>
                <button
                  class="text-red-600 hover:underline"
                  (click)="deletingPO = po; showDeleteModal = true"
                >
                  Delete
                </button>

                <button class="text-green-600 hover:underline ml-4" (click)="viewItem(po)">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div *ngIf="!loading && !purchaseOrders.length" class="text-center text-gray-500 mt-8">
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
  }
  fetchPurchaseOrders() {
    this.loading = true;
    this.purchaseOrderService.fetchAll().subscribe({
      next: (res: ApiResponse<PurchaseOrder[]>) => {
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
