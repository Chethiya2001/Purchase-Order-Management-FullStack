import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PurchaseOrder, PurchaseOrderStatus } from '../../model/purchase-order.model';
import { PurchaseOrderService } from '../../service/purchase-order-service';

@Component({
  selector: 'app-purchase-order-form-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-lg p-8 max-w-lg mx-auto mt-12">
      <form [formGroup]="poForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <h2 class="text-2xl font-bold text-blue-700 mb-6">{{ isEditing ? 'Edit' : 'Add' }} Purchase Order</h2>
        <div>
          <label class="block text-gray-700 font-medium mb-1">PO Number</label>
          <input type="text" formControlName="poNumber" required class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition" />
        <div>
          <label class="block text-gray-700 font-medium  mt-2">Description</label>
          <textarea formControlName="description" required rows="3" class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition resize-y"></textarea>
        </div>
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">Supplier Name</label>
          <input type="text" formControlName="supplierName" required class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">Order Date</label>
          <input type="date" formControlName="orderDate" required class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">Total Amount</label>
          <input type="number" formControlName="totalAmount" required min="0" class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">Status</label>
          <select formControlName="status" required class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition">
            <option value="" disabled selected>Select status</option>
            <option *ngFor="let status of statusOptions" [value]="status">{{ status }}</option>
          </select>
        </div>
        <div class="flex justify-end gap-4 mt-8">
          <button type="button" class="px-6 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-700 transition" (click)="onCancel()">Cancel</button>
          <button type="submit" class="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-800 transition disabled:opacity-50" [disabled]="!poForm.valid">
            {{ isEditing ? 'Update' : 'Create' }} Purchase Order
          </button>
        </div>
      </form>
    </div>
  `,
  styles: '',
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
