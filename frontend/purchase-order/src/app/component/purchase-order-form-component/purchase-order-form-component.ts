import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PurchaseOrder, PurchaseOrderStatus } from '../../model/purchase-order.model';
import { PurchaseOrderService } from '../../service/purchase-order-service';

@Component({
  selector: 'app-purchase-order-form-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div
      class="bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-100 flex items-center justify-center "
    >
      <div class="w-full max-w-2xl">
        <!-- Main Card -->
        <div
          class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          <!-- Header Section -->
          <div
            class="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 px-8 py-6 relative overflow-hidden"
          >
            <!-- Background decoration -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"
            ></div>
            <div class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>

            <div class="relative z-10">
              <h2 class="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <svg
                  class="w-8 h-8 text-white/90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {{ isEditing ? 'Edit' : 'Create New' }} Purchase Order
              </h2>
              <p class="text-white/80 text-sm">
                {{
                  isEditing
                    ? 'Update existing order details'
                    : 'Fill in the details to create a new purchase order'
                }}
              </p>
            </div>
          </div>

          <!-- Form Section -->
          <form [formGroup]="poForm" (ngSubmit)="onSubmit()" class="p-8 space-y-6">
            <!-- PO Number -->
            <div class="group">
              <label class="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                <svg
                  class="w-4 h-4 inline-block mr-2 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                  />
                </svg>
                PO Number
              </label>
              <div class="relative">
                <input
                  type="text"
                  formControlName="poNumber"
                  placeholder="Enter purchase order number. e.g. PO-1001"
                  class="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl
           focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100
           transition-all duration-300 bg-gray-50/50 hover:bg-white group-hover:border-gray-300
           placeholder-gray-400"
                />

                <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div class="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              <p
                *ngIf="poForm.get('poNumber')?.touched && poForm.get('poNumber')?.invalid"
                class="text-red-500 text-sm mt-2 flex items-center gap-1 animate-shake"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                PO Number is required.
              </p>
            </div>

            <!-- Description -->
            <div class="group">
              <label class="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                <svg
                  class="w-4 h-4 inline-block mr-2 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
                Description
              </label>
              <textarea
                formControlName="description"
                placeholder="e.g. Order for 50 office chairs with delivery by next week"
                rows="4"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
         focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100
         transition-all duration-300 bg-gray-50/50 hover:bg-white resize-none
         group-hover:border-gray-300 placeholder-gray-400"
              ></textarea>

              <p
                *ngIf="poForm.get('description')?.touched && poForm.get('description')?.invalid"
                class="text-red-500 text-sm mt-2 flex items-center gap-1 animate-shake"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Description is required.
              </p>
            </div>

            <!-- Two Column Layout for Supplier and Date -->
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Supplier Name -->
              <div class="group">
                <label
                  class="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide"
                >
                  <svg
                    class="w-4 h-4 inline-block mr-2 text-teal-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Supplier
                </label>
                <input
                  type="text"
                  formControlName="supplierName"
                  placeholder="e.g. ACME Supplies Ltd."
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
         focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100
         transition-all duration-300 bg-gray-50/50 hover:bg-white
         group-hover:border-gray-300 placeholder-gray-400"
                />

                <p
                  *ngIf="poForm.get('supplierName')?.touched && poForm.get('supplierName')?.invalid"
                  class="text-red-500 text-sm mt-2 flex items-center gap-1 animate-shake"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Supplier name is required.
                </p>
              </div>

              <!-- Order Date -->
              <div class="group">
                <label
                  class="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide"
                >
                  <svg
                    class="w-4 h-4 inline-block mr-2 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Order Date
                </label>
                <input
                  type="date"
                  formControlName="orderDate"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-gray-50/50 hover:bg-white group-hover:border-gray-300"
                />
                <p
                  *ngIf="poForm.get('orderDate')?.touched && poForm.get('orderDate')?.invalid"
                  class="text-red-500 text-sm mt-2 flex items-center gap-1 animate-shake"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Order date is required.
                </p>
              </div>
            </div>

            <!-- Two Column Layout for Amount and Status -->
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Total Amount -->
              <div class="group">
                <label
                  class="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide"
                >
                  <svg
                    class="w-4 h-4 inline-block mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                  Total Amount
                </label>
                <div class="relative">
                  <input
                    type="number"
                    formControlName="totalAmount"
                    placeholder="0.00"
                    min="0"
                    class="w-full px-4 py-3 pl-8 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-gray-50/50 hover:bg-white group-hover:border-gray-300"
                  />
                  <div
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 font-bold"
                  >
                    $
                  </div>
                </div>
                <p
                  *ngIf="poForm.get('totalAmount')?.touched && poForm.get('totalAmount')?.invalid"
                  class="text-red-500 text-sm mt-2 flex items-center gap-1 animate-shake"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Total amount must be a positive number.
                </p>
              </div>

              <!-- Status Dropdown -->
              <div class="relative group">
                <label
                  class="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide"
                >
                  <svg
                    class="w-4 h-4 inline-block mr-2 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Status
                </label>
                <button
                  type="button"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 flex justify-between items-center bg-gray-50/50 hover:bg-white text-left group-hover:border-gray-300"
                  (click)="toggleDropdown()"
                >
                  <span [class]="poForm.get('status')?.value ? 'text-gray-900' : 'text-gray-500'">
                    {{ poForm.get('status')?.value || 'Select status' }}
                  </span>
                  <svg
                    class="w-5 h-5 text-gray-400 transition-transform duration-200"
                    [class.rotate-180]="dropdownOpen"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <!-- Dropup Menu -->
                <div
                  *ngIf="dropdownOpen"
                  class="absolute bottom-full mb-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl z-20 overflow-hidden animate-fadeIn"
                >
                  <div
                    *ngFor="let status of statusOptions; let i = index"
                    (click)="selectStatus(status)"
                    class="px-4 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                    [style.animation-delay]="i * 50 + 'ms'"
                  >
                    <div class="w-3 h-3 rounded-full" [class]="getStatusColor(status)"></div>
                    <span class="text-gray-700 font-medium">{{ status }}</span>
                  </div>
                </div>
                <p
                  *ngIf="poForm.get('status')?.touched && poForm.get('status')?.invalid"
                  class="text-red-500 text-sm mt-2 flex items-center gap-1 animate-shake"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Status is required.
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                class="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-300 font-semibold flex items-center justify-center gap-2 group"
                (click)="onCancel()"
              >
                <svg
                  class="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancel
              </button>

              <button
                type="submit"
                class="flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
                [class]="
                  poForm.valid
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 hover:from-indigo-700 hover:via-purple-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-purple-200'
                    : 'bg-gray-300 cursor-not-allowed'
                "
                [disabled]="!poForm.valid"
              >
                <div
                  class="absolute inset-0 bg-white/20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"
                ></div>
                <svg
                  class="w-5 h-5 group-hover:scale-110 transition-transform relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    [attr.d]="
                      isEditing
                        ? 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                        : 'M12 6v6m0 0v6m0-6h6m-6 0H6'
                    "
                  />
                </svg>
                <span class="relative z-10">
                  {{ isEditing ? 'Update Purchase Order' : 'Create Purchase Order' }}
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Floating particles decoration -->
        <div class="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div
            class="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400/30 rounded-full animate-float"
          ></div>
          <div
            class="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/30 rounded-full animate-float-delayed"
          ></div>
          <div
            class="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-teal-400/30 rounded-full animate-bounce"
          ></div>
        </div>
      </div>
    </div>

    <style>
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes shake {
        0%,
        100% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(-5px);
        }
        75% {
          transform: translateX(5px);
        }
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-20px) rotate(180deg);
        }
      }

      @keyframes float-delayed {
        0%,
        100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-15px) rotate(-180deg);
        }
      }

      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
      }
      .animate-shake {
        animation: shake 0.5s ease-in-out;
      }
      .animate-float {
        animation: float 6s ease-in-out infinite;
        animation-delay: 0s;
      }
      .animate-float-delayed {
        animation: float-delayed 8s ease-in-out infinite;
        animation-delay: 2s;
      }
    </style>
  `,
})
export class PurchaseOrderFormComponent {
  @Output() formClose = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<any>();
  @Input() purchaseOrderToEdit?: PurchaseOrder | null;
  poForm: FormGroup;
  isEditing: boolean = false;
  statusOptions: string[] = [];
  dropdownOpen = false;

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

    if (this.purchaseOrderToEdit) {
      this.setEditMode(this.purchaseOrderToEdit);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['purchaseOrderToEdit'] && changes['purchaseOrderToEdit'].currentValue) {
      this.setEditMode(changes['purchaseOrderToEdit'].currentValue);
    }
  }

  setEditMode(po: PurchaseOrder) {
    this.isEditing = true;
    this.poForm.patchValue({
      ...po,
      orderDate: po.orderDate ? po.orderDate.substring(0, 10) : '',
    });
  }

  onSubmit() {
    if (this.poForm.valid) {
      const poData: PurchaseOrder = {
        ...this.poForm.value,
        orderDate: new Date(this.poForm.value.orderDate).toISOString(),
      };

      if (this.isEditing && this.purchaseOrderToEdit && this.purchaseOrderToEdit.id) {
        this.poService.edit(this.purchaseOrderToEdit.id, poData).subscribe({
          next: (res) => {
            if (res.success) {
              this.formSubmit.emit(res.data);
              this.poForm.reset();
              this.isEditing = false;
              this.formClose.emit();
            }
          },
          error: (err) => console.error('Error updating purchase order:', err),
        });
      } else {
        this.poService.create(poData).subscribe({
          next: (res) => {
            if (res.success) {
              this.formSubmit.emit(res.data);
              this.poForm.reset();
              this.formClose.emit();
            }
          },
          error: (err) => console.error('Error creating purchase order:', err),
        });
      }
    }
  }

  onCancel() {
    this.formClose.emit();
    this.poForm.reset();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectStatus(status: string) {
    this.poForm.get('status')?.setValue(status);
    this.dropdownOpen = false;
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      Draft: 'bg-gray-400',
      Approved: 'bg-blue-400',
      Shipped: 'bg-yellow-400',
      Completed: 'bg-green-400',
      Cancelled: 'bg-red-400',
    };
    return colorMap[status] || 'bg-gray-400';
  }
}
