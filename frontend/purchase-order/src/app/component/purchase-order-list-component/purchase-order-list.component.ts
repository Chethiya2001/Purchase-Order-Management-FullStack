import { Component, OnInit } from '@angular/core';
import { PurchaseOrderService } from '../../service/purchase-order-service';
import { PurchaseOrder, ApiResponse } from '../../model/purchase-order.model';
import { MaterialModule } from '../../model/material.module';
import { PurchaseOrderFormComponent } from '../purchase-order-form-component/purchase-order-form-component';
import { CommonModule, DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-purchase-order-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, DatePipe, NgIf, PurchaseOrderFormComponent],
  template: `
    <div class="purchase-order-container">
      <div class="header">
        <h1>Purchase Order Management</h1>
        <button class="btn-primary" (click)="openAddModel()">
          <span class="icon">+</span>
          Add New PO
        </button>
      </div>

      <h2>Purchase Orders</h2>
      <div *ngIf="loading" class="flex justify-center items-center h-32">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"
        ></div>
      </div>

      <table
        mat-table
        [dataSource]="purchaseOrders"
        class="mat-elevation-z8"
        *ngIf="!loading && purchaseOrders.length"
      >
        <ng-container matColumnDef="poNumber">
          <th mat-header-cell *matHeaderCellDef>PO Number</th>
          <td mat-cell *matCellDef="let po">{{ po.poNumber }}</td>
        </ng-container>
        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef>Description</th>
          <td mat-cell *matCellDef="let po">{{ po.description }}</td>
        </ng-container>
        <ng-container matColumnDef="supplierName">
          <th mat-header-cell *matHeaderCellDef>Supplier</th>
          <td mat-cell *matCellDef="let po">{{ po.supplierName }}</td>
        </ng-container>
        <ng-container matColumnDef="orderDate">
          <th mat-header-cell *matHeaderCellDef>Order Date</th>
          <td mat-cell *matCellDef="let po">{{ po.orderDate | date }}</td>
        </ng-container>
        <ng-container matColumnDef="totalAmount">
          <th mat-header-cell *matHeaderCellDef>Total Amount</th>
          <td mat-cell *matCellDef="let po">{{ po.totalAmount }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let po">{{ po.status }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
      <div *ngIf="!loading && !purchaseOrders.length">No purchase orders found.</div>

       <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingPO ? 'Edit Purchase Order' : 'Add New Purchase Order' }}</h2>
            <button class="close-button" (click)="closeModal()">×</button>
          </div>
          <div class="modal-body">
            <app-purchase-order-form-component
              (formSubmit)="onFormSubmit($event)"
              (formClose)="closeModal()">
            </app-purchase-order-form-component>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      table {
        width: 80%;
        margin-top: 16px;
      }
      th.mat-header-cell,
      td.mat-cell {
        text-align: left;
      }
        .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 600px;
      min-width: 350px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      animation: slideIn 0.3s ease;
      box-sizing: border-box;
    }

    /* Fix Angular Material overlay panel width and background for dropdowns and datepicker */
    .cdk-overlay-pane, .mat-select-panel, .mat-datepicker-content {
      min-width: 350px !important;
      background: #fff !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
      z-index: 2000 !important;
    }

    .modal-content.delete-modal {
      max-width: 400px;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-30px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 0;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 24px;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #1f2937;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: #9ca3af;
      line-height: 1;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .close-button:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .modal-body {
      padding: 0 24px 24px;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 0 24px 24px;
      border-top: 1px solid #e5e7eb;
      margin-top: 24px;
      padding-top: 24px;
    }

    `,
  ],
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
}
