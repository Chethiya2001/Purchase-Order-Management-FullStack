import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../model/material.module';
import { CommonModule } from '@angular/common';
import { PurchaseOrder, PurchaseOrderStatus } from '../../model/purchase-order.model';
import { PurchaseOrderService } from '../../service/purchase-order-service';

@Component({
  selector: 'app-purchase-order-form-component',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, CommonModule],
  template: `
    <div class="form-modal">
      <form [formGroup]="poForm" (ngSubmit)="onSubmit()" class="purchase-order-form">
        <h2>{{ isEditing ? 'Edit' : 'Add' }} Purchase Order</h2>
        <mat-form-field appearance="fill" class="form-field">
          <mat-label>PO Number</mat-label>
          <input matInput formControlName="poNumber" required />
        </mat-form-field>
        <mat-form-field appearance="fill" class="form-field">
          <mat-label>Description</mat-label>
          <input matInput formControlName="description" required />
        </mat-form-field>
        <mat-form-field appearance="fill" class="form-field">
          <mat-label>Supplier Name</mat-label>
          <input matInput formControlName="supplierName" required />
        </mat-form-field>
        <mat-form-field appearance="fill" class="form-field">
          <mat-label>Order Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="orderDate" required />
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="fill" class="form-field">
          <mat-label>Total Amount</mat-label>
          <input matInput type="number" formControlName="totalAmount" required min="0" />
        </mat-form-field>
        <mat-form-field appearance="fill" class="form-field">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status" required>
            <mat-option *ngFor="let status of statusOptions" [value]="status">{{
              status
            }}</mat-option>
          </mat-select>
        </mat-form-field>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="!poForm.valid">
            {{ isEditing ? 'Update' : 'Create' }} Purchase Order
          </button>
        </div>
      </form>
    </div>
  `,
  styles: `
    .form-modal {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      padding: 32px;
      margin: 40px auto;
    }


    .form-field {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
       .form-control {
      padding: 12px;
      border: 2px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-control.readonly {
      background-color: #f9fafb;
      color: #6b7280;
      cursor: not-allowed;
    }

  `,
})
export class PurchaseOrderFormComponent {
  @Output() formClose = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<any>();
  poForm: FormGroup;
  isEditing: boolean = false;
  statusOptions: string[] = [];

  constructor(private fb: FormBuilder, private poService: PurchaseOrderService) {
    this.poForm = this.fb.group({
      poNumber: ['', Validators.required],
      description: ['', Validators.required],
      supplierName: ['', Validators.required],
      orderDate: ['', Validators.required],
      totalAmount: [0, [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.poService.getStatusOptions().subscribe({
      next: (res: any) => {
        this.statusOptions = res?.data ?? [];
      },
      error: () => {
        this.statusOptions = ['Draft', 'Approved', 'Shipped', 'Completed', 'Cancelled'];
      },
    });
  }

  onSubmit() {
    if (this.poForm.valid) {
      const newPurchaseOrder: PurchaseOrder = {
        ...this.poForm.value,
        orderDate: new Date(this.poForm.value.orderDate).toISOString(), // ensure correct format
      };

      this.poService.create(newPurchaseOrder).subscribe({
        next: (res) => {
          if (res.success) {
            this.formSubmit.emit(res.data); // return created PO to parent
            this.poForm.reset();
            this.formClose.emit(); // close modal after success
          } else {
            console.error('Create failed:', res.message);
          }
        },
        error: (err) => {
          console.error('Error creating purchase order:', err);
        },
      });
    }
  }

  onCancel() {
    this.formClose.emit();
    this.poForm.reset();
  }
}
