import { Component, OnInit } from '@angular/core';
import { PurchaseOrderService } from '../../service/purchase-order-service';
import { PurchaseOrder, ApiResponse } from '../../model/purchase-order.model';
import { MaterialModule } from '../../model/material.module';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-purchase-order-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, DatePipe],
  template: `
    <h2>Purchase Orders</h2>
    <div *ngIf="loading" class="flex justify-center items-center h-32">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
    </div>
    <table mat-table [dataSource]="purchaseOrders" class="mat-elevation-z8" *ngIf="!loading && purchaseOrders.length">
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
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    <div *ngIf="!loading && !purchaseOrders.length">No purchase orders found.</div>
  `,
  styles: [`
    table {
      width: 100%;
      margin-top: 16px;
    }
    th.mat-header-cell, td.mat-cell {
      text-align: left;
    }
  `]
})
export class PurchaseOrderListComponent implements OnInit {
  purchaseOrders: PurchaseOrder[] = [];
  displayedColumns: string[] = ['poNumber', 'description', 'supplierName', 'orderDate', 'totalAmount', 'status'];
  loading = false;

  constructor(private purchaseOrderService: PurchaseOrderService) {}

  ngOnInit() {
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
      }
    });
  }
}
