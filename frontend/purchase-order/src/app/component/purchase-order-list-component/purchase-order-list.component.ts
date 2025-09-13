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

   <!-- Main Container with animated background -->
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">

      <!-- Floating background elements -->
      <div class="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div class="relative z-10 max-w-7xl mx-auto p-6">

        <!-- Header Section -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <div class="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div class="text-center lg:text-left">
              <h1 class="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent p-2">
                Purchase Order Management
              </h1>
              <p class="text-gray-600 text-lg">Manage and track all your purchase orders efficiently</p>
            </div>
            <button
              class="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              (click)="openAddModel()"
            >
              <div class="absolute inset-0 bg-white/20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <div class="relative z-10 flex items-center gap-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add New PO</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Advanced Filter Bar -->
  <div class="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-8 border border-white/30 z-[30] relative">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end">

            <!-- Supplier Filter -->
            <div class="group">
              <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Supplier
              </label>
              <select class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white/80 hover:bg-white group-hover:border-gray-300" [(ngModel)]="filterSupplier">
                <option value="">All Suppliers</option>
                <option *ngFor="let s of supplierList" [value]="s">{{ s }}</option>
              </select>
            </div>

            <!-- Status Filter -->
            <div class="group">
              <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Status
              </label>
              <select class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white/80 hover:bg-white group-hover:border-gray-300" [(ngModel)]="filterStatus">
                <option value="">All Status</option>
                <option *ngFor="let st of statusList" [value]="st">{{ st }}</option>
              </select>
            </div>

            <!-- Start Date Filter with Custom Calendar -->
            <div class="group relative">
              <label class="block text-sm font-semibold text-gray-700 mb-2  flex items-center gap-2">
                <svg class="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Start Date
              </label>
              <button type="button"
                class="w-full px-4 py-3 border-2 z-[40] border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-300 flex justify-between items-center bg-white/80 hover:bg-white text-left group-hover:border-gray-300"
                (click)="toggleStartDateDropdown()">
                <span [class]="filterStartDate ? 'text-gray-900' : 'text-gray-500'">
                  {{ getFormattedFilterDate(filterStartDate) || 'Select date' }}
                </span>
                <svg class="w-5 h-5 text-gray-400 transition-transform duration-200" [class.rotate-180]="startDateDropdownOpen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div *ngIf="startDateDropdownOpen" class="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl z-[50] overflow-hidden animate-fadeIn">
                <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
                  <button type="button" (click)="previousMonth('start')" class="p-1 rounded-lg hover:bg-white/50 transition-colors">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span class="font-semibold text-gray-700">{{ getMonthYearDisplay('start') }}</span>
                  <button type="button" (click)="nextMonth('start')" class="p-1 rounded-lg hover:bg-white/50 transition-colors">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div class="grid grid-cols-7 p-2  text-xs text-center text-gray-500 bg-gray-50 py-2">
                  <div *ngFor="let day of dayLabels" class="py-1 font-medium">{{ day }}</div>
                </div>
                <div class="grid grid-cols-7 p-2  text-sm">
                  <button type="button" *ngFor="let date of startCalendarDays" (click)="selectFilterDate(date, 'start')"
                    class="aspect-square flex items-center justify-center hover:bg-indigo-50 transition-colors relative"
                    [class]="getDateClasses(date)" [disabled]="!date.isCurrentMonth">
                    <span [class]="date.isSelected ? 'text-white font-semibold' : date.isCurrentMonth ? 'text-gray-700' : 'text-gray-300'">
                      {{ date.day }}
                    </span>
                    <div *ngIf="date.isSelected" class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full m-1"></div>
                  </button>
                </div>
                <div class="border-t border-gray-100 p-2">
                  <div class="flex gap-2 flex-wrap">
                    <button type="button" (click)="selectToday('start')" class="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">Today</button>
                    <button type="button" (click)="selectTomorrow('start')" class="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">Tomorrow</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- End Date Filter with Custom Calendar -->
            <div class="group relative">
              <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                End Date
              </label>
              <button type="button"
                class="w-full px-4 py-3 border-2 z-[40] border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-300 flex justify-between items-center bg-white/80 hover:bg-white text-left group-hover:border-gray-300"
                (click)="toggleEndDateDropdown()">
                <span [class]="filterEndDate ? 'text-gray-900' : 'text-gray-500'">
                  {{ getFormattedFilterDate(filterEndDate) || 'Select date' }}
                </span>
                <svg class="w-5 h-5 text-gray-400 transition-transform duration-200" [class.rotate-180]="endDateDropdownOpen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div *ngIf="endDateDropdownOpen" class="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl z-[50] overflow-hidden animate-fadeIn">
                <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
                  <button type="button" (click)="previousMonth('end')" class="p-1 rounded-lg hover:bg-white/50 transition-colors">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span class="font-semibold text-gray-700">{{ getMonthYearDisplay('end') }}</span>
                  <button type="button" (click)="nextMonth('end')" class="p-1 rounded-lg hover:bg-white/50 transition-colors">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div class="grid grid-cols-7 p-2  text-xs text-center text-gray-500 bg-gray-50 py-2">
                  <div *ngFor="let day of dayLabels" class="py-1 font-medium">{{ day }}</div>
                </div>
                <div class="grid grid-cols-7 p-2  text-sm">
                  <button type="button" *ngFor="let date of endCalendarDays" (click)="selectFilterDate(date, 'end')"
                    class="aspect-square flex items-center justify-center hover:bg-indigo-50 transition-colors relative"
                    [class]="getDateClasses(date)" [disabled]="!date.isCurrentMonth">
                    <span [class]="date.isSelected ? 'text-white font-semibold' : date.isCurrentMonth ? 'text-gray-700' : 'text-gray-300'">
                      {{ date.day }}
                    </span>
                    <div *ngIf="date.isSelected" class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full m-1"></div>
                  </button>
                </div>
                <div class="border-t border-gray-100 p-2">
                  <div class="flex gap-2 flex-wrap">
                    <button type="button" (click)="selectToday('end')" class="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">Today</button>
                    <button type="button" (click)="selectTomorrow('end')" class="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">Tomorrow</button>
                  </div>
                </div>
              </div>
            </div>


            <!-- Price Range Filter -->
            <div class="group">
              <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Price Range
              </label>
              <select class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white/80 hover:bg-white group-hover:border-gray-300" [(ngModel)]="filterPriceRange">
                <option *ngFor="let range of priceRanges" [value]="range.value">{{ range.label }}</option>
              </select>
            </div>

            <!-- Clear Filters Button -->
            <div class="flex justify-end">
              <button (click)="clearFilters()"
                      class="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold shadow-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300 border border-gray-300 hover:shadow-xl transform hover:scale-105 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Clear
              </button>
            </div>
          </div>
        </div>

        <!-- Purchase Orders Section Title -->
        <div class="flex items-center gap-3 mb-6">
          <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Purchase Orders</h2>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="flex flex-col items-center justify-center h-64 bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30">
          <div class="relative">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
            <div class="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-indigo-400 opacity-20"></div>
          </div>
          <p class="mt-4 text-gray-600 font-medium">Loading purchase orders...</p>
        </div>

        <!-- Data Table -->
        <div class="bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden" *ngIf="!loading">
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-teal-600/90 text-white">
                  <th class="px-6 py-4 text-left font-bold uppercase tracking-wider cursor-pointer select-none hover:bg-white/10 transition-all duration-300 group" (click)="setSort('poNumber')">
                    <div class="flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      PO Number
                      <div class="flex flex-col ml-1">
                        <svg class="w-3 h-3 transition-all duration-200" [class]="sortField === 'poNumber' && sortDirection === 'asc' ? 'text-yellow-300' : 'text-white/50'" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                        <svg class="w-3 h-3 transform rotate-180 transition-all duration-200" [class]="sortField === 'poNumber' && sortDirection === 'desc' ? 'text-yellow-300' : 'text-white/50'" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left font-bold uppercase tracking-wider">
                    <div class="flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Supplier
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left font-bold uppercase tracking-wider cursor-pointer select-none hover:bg-white/10 transition-all duration-300 group" (click)="setSort('orderDate')">
                    <div class="flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Order Date
                      <div class="flex flex-col ml-1">
                        <svg class="w-3 h-3 transition-all duration-200" [class]="sortField === 'orderDate' && sortDirection === 'asc' ? 'text-yellow-300' : 'text-white/50'" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                        <svg class="w-3 h-3 transform rotate-180 transition-all duration-200" [class]="sortField === 'orderDate' && sortDirection === 'desc' ? 'text-yellow-300' : 'text-white/50'" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left font-bold uppercase tracking-wider cursor-pointer select-none hover:bg-white/10 transition-all duration-300 group" (click)="setSort('totalAmount')">
                    <div class="flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Total Amount
                      <div class="flex flex-col ml-1">
                        <svg class="w-3 h-3 transition-all duration-200" [class]="sortField === 'totalAmount' && sortDirection === 'asc' ? 'text-yellow-300' : 'text-white/50'" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                        <svg class="w-3 h-3 transform rotate-180 transition-all duration-200" [class]="sortField === 'totalAmount' && sortDirection === 'desc' ? 'text-yellow-300' : 'text-white/50'" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left font-bold uppercase tracking-wider">
                    <div class="flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Status
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left font-bold uppercase tracking-wider">
                    <div class="flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200/50">
                <tr *ngFor="let po of pagedPurchaseOrders; let i = index"
                    class="transition-all duration-300 hover:bg-white/80 hover:shadow-lg group"
                    [class]="i % 2 === 0 ? 'bg-white/40' : 'bg-gray-50/40'">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-indigo-400 rounded-full animate-pulse group-hover:animate-none group-hover:bg-indigo-600 transition-colors"></div>
                      <span class="font-mono font-bold text-gray-900">{{ po.poNumber }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {{ po.supplierName.charAt(0).toUpperCase() }}
                      </div>
                      <span class="font-medium text-gray-900">{{ po.supplierName }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-700 font-medium">{{ po.orderDate | date }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-1">
                      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span class="font-bold text-gray-900">{{ po.totalAmount | currency }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-md transition-all duration-300 hover:shadow-lg"
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
                  <td class="px-6 py-4">
                    <div class="flex gap-2">
                      <button class="group px-3 py-2 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 font-semibold hover:from-blue-200 hover:to-blue-300 transition-all duration-300 border border-blue-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-1"
                              (click)="openAddModel(); editingPO = po">
                        <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button class="group px-3 py-2 rounded-lg bg-gradient-to-r from-red-100 to-red-200 text-red-700 font-semibold hover:from-red-200 hover:to-red-300 transition-all duration-300 border border-red-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-1"
                              (click)="deletingPO = po; showDeleteModal = true">
                        <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                      <button class="group px-3 py-2 rounded-lg bg-gradient-to-r from-green-100 to-green-200 text-green-700 font-semibold hover:from-green-200 hover:to-green-300 transition-all duration-300 border border-green-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-1"
                              (click)="viewItem(po)">
                        <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Controls -->
          <div *ngIf="pagedPurchaseOrders.length" class="bg-white/40 backdrop-blur-sm px-6 py-4 border-t border-gray-200/50">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <label class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Rows per page:
                </label>
                <select [(ngModel)]="pageSize" (ngModelChange)="goToPage(1)"
                        class="border-2 border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300">
                  <option *ngFor="let size of pageSizeOptions" [value]="size">{{ size }}</option>
                </select>
              </div>
              <div class="flex items-center gap-3">
                <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1"
                        class="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 font-semibold hover:from-indigo-200 hover:to-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-indigo-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Prev
                </button>
                <div class="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200 shadow-md">
                  <span class="text-sm font-semibold text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
                </div>
                <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages"
                        class="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 font-semibold hover:from-indigo-200 hover:to-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-indigo-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none flex items-center gap-1">
                  Next
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Data State -->
        <div *ngIf="!loading && !filteredPurchaseOrders.length"
             class="flex flex-col items-center justify-center h-64 bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30">
          <svg class="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-500 mb-2">No Purchase Orders Found</h3>
          <p class="text-gray-400 text-center max-w-md">No purchase orders match your current filters. Try adjusting your search criteria or create a new purchase order.</p>
        </div>

        <!-- View Details Modal -->
        <div *ngIf="showViewModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="closeViewModal()">
          <div class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl relative border border-white/20 overflow-hidden animate-fade-in-up"
               (click)="$event.stopPropagation()">
            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 px-8 py-6 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
              <div class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
              <div class="relative z-10 flex justify-between items-center">
                <div>
                  <h2 class="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Purchase Order Details
                  </h2>
                  <p class="text-white/80 text-sm">Complete information about this purchase order</p>
                </div>
                <button (click)="closeViewModal()"
                        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 text-white transition-all duration-300 group">
                  <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Modal Content -->
            <div class="p-8" *ngIf="viewingPO">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="group">
                  <dt class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    PO Number
                  </dt>
                  <dd class="text-2xl font-bold text-gray-900 font-mono bg-gray-50 px-4 py-2 rounded-lg">{{ viewingPO.poNumber }}</dd>
                </div>
                <div class="group">
                  <dt class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Status
                  </dt>
                  <dd>
                    <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                          [ngClass]="{
                            'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800': viewingPO.status === 'Draft',
                            'bg-gradient-to-r from-green-100 to-green-200 text-green-800': viewingPO.status === 'Approved',
                            'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800': viewingPO.status === 'Shipped',
                            'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800': viewingPO.status === 'Completed',
                            'bg-gradient-to-r from-red-100 to-red-200 text-red-800': viewingPO.status === 'Cancelled'
                          }">
                      <div class="w-3 h-3 rounded-full animate-pulse"
                           [ngClass]="{
                             'bg-blue-600': viewingPO.status === 'Draft',
                             'bg-green-600': viewingPO.status === 'Approved',
                             'bg-yellow-600': viewingPO.status === 'Shipped',
                             'bg-gray-600': viewingPO.status === 'Completed',
                             'bg-red-600': viewingPO.status === 'Cancelled'
                           }"></div>
                      {{ viewingPO.status }}
                    </span>
                  </dd>
                </div>
                <div class="md:col-span-2 group">
                  <dt class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Description
                  </dt>
                  <dd class="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border-l-4 border-teal-400">{{ viewingPO.description }}</dd>
                </div>
                <div class="group">
                  <dt class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Supplier
                  </dt>
                  <dd class="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{{ viewingPO.supplierName }}</dd>
                </div>
                <div class="group">
                  <dt class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Order Date
                  </dt>
                  <dd class="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{{ viewingPO.orderDate | date }}</dd>
                </div>
                <div class="md:col-span-2 group">
                  <dt class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Total Amount
                  </dt>
                  <dd class="text-3xl font-bold text-green-600 bg-green-50 px-4 py-3 rounded-lg border-l-4 border-green-400">{{ viewingPO.totalAmount | currency }}</dd>
                </div>
              </div>
            </div>

            <!-- Loading State for Modal -->
            <div class="p-12 text-center" *ngIf="viewLoading">
              <div class="relative inline-block">
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
                <div class="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-indigo-400 opacity-20"></div>
              </div>
              <p class="mt-4 text-gray-600 font-medium">Loading purchase order details...</p>
            </div>
          </div>
        </div>

        <!-- Add/Edit Modal -->
        <div *ngIf="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="closeModal()">
          <div class="w-full max-w-4xl relative animate-fade-in-up" (click)="$event.stopPropagation()">
            <app-purchase-order-form-component
              [purchaseOrderToEdit]="editingPO"
              (formSubmit)="onFormSubmit($event)"
              (formClose)="closeModal()">
            </app-purchase-order-form-component>
          </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div *ngIf="showDeleteModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="showDeleteModal = false">
          <div class="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md relative border border-white/20 overflow-hidden animate-fade-in-up"
               (click)="$event.stopPropagation()">
            <!-- Warning Header -->
            <div class="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 relative overflow-hidden">
              <div class="absolute inset-0 bg-red-600/20"></div>
              <div class="relative z-10 flex items-center gap-3">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h2 class="text-xl font-bold text-white">Confirm Deletion</h2>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <p class="text-gray-700 mb-6 leading-relaxed">
                Are you sure you want to delete purchase order <strong class="font-mono text-red-600 bg-red-50 px-2 py-1 rounded">{{ deletingPO?.poNumber }}</strong>? This action cannot be undone.
              </p>
              <div class="flex justify-end gap-3">
                <button (click)="showDeleteModal = false"
                        class="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-300 border border-gray-300 shadow-md hover:shadow-lg">
                  Cancel
                </button>
                <button (click)="confirmDelete()"
                        class="px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Custom Styles -->
      <style>
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out;
        }
      </style>
    </div>
  `,
  styles: [],
})
export class PurchaseOrderListComponent implements OnInit {
  // Pagination state
  // --- Calendar dropdown state and logic for filters ---
  startDateDropdownOpen = false;
  endDateDropdownOpen = false;
  startCurrentMonth: number = new Date().getMonth();
  startCurrentYear: number = new Date().getFullYear();
  endCurrentMonth: number = new Date().getMonth();
  endCurrentYear: number = new Date().getFullYear();
  dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  startCalendarDays: any[] = [];
  endCalendarDays: any[] = [];

  toggleStartDateDropdown() {
    this.startDateDropdownOpen = !this.startDateDropdownOpen;
    if (this.startDateDropdownOpen) {
      this.endDateDropdownOpen = false;
      this.generateCalendarDays('start');
    }
  }
  toggleEndDateDropdown() {
    this.endDateDropdownOpen = !this.endDateDropdownOpen;
    if (this.endDateDropdownOpen) {
      this.startDateDropdownOpen = false;
      this.generateCalendarDays('end');
    }
  }
  generateCalendarDays(type: 'start' | 'end') {
    const year = type === 'start' ? this.startCurrentYear : this.endCurrentYear;
    const month = type === 'start' ? this.startCurrentMonth : this.endCurrentMonth;
    const selectedDate = type === 'start' ? this.filterStartDate : this.filterEndDate;
    const calendarDays = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonth = new Date(year, month, 0);
      const day = prevMonth.getDate() - startingDayOfWeek + i + 1;
      calendarDays.push({
        day: day,
        isCurrentMonth: false,
        isSelected: false,
        date: new Date(year, month - 1, day)
      });
    }
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = this.isDateSelectedForFilter(date, selectedDate);
      calendarDays.push({
        day: day,
        isCurrentMonth: true,
        isSelected: isSelected,
        date: date
      });
    }
    // Add days from next month to complete the grid
    const remainingCells = 42 - calendarDays.length;
    for (let day = 1; day <= remainingCells; day++) {
      calendarDays.push({
        day: day,
        isCurrentMonth: false,
        isSelected: false,
        date: new Date(year, month + 1, day)
      });
    }
    if (type === 'start') this.startCalendarDays = calendarDays;
    else this.endCalendarDays = calendarDays;
  }
  isDateSelectedForFilter(date: Date, selectedDate: string): boolean {
    if (!selectedDate) return false;
    const selected = new Date(selectedDate);
    return date.getFullYear() === selected.getFullYear() &&
           date.getMonth() === selected.getMonth() &&
           date.getDate() === selected.getDate();
  }
  selectFilterDate(dateObj: any, type: 'start' | 'end') {
    if (!dateObj.isCurrentMonth) return;
    const dateString = this.formatDateForInput(dateObj.date);
    if (type === 'start') {
      this.filterStartDate = dateString;
      this.startDateDropdownOpen = false;
      this.startCurrentMonth = dateObj.date.getMonth();
      this.startCurrentYear = dateObj.date.getFullYear();
      this.generateCalendarDays('start');
    } else {
      this.filterEndDate = dateString;
      this.endDateDropdownOpen = false;
      this.endCurrentMonth = dateObj.date.getMonth();
      this.endCurrentYear = dateObj.date.getFullYear();
      this.generateCalendarDays('end');
    }
  }
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  getFormattedFilterDate(dateValue: string): string {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    // Format as MM/DD/YYYY
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }
  getMonthYearDisplay(type: 'start' | 'end'): string {
    const date = new Date(type === 'start' ? this.startCurrentYear : this.endCurrentYear, type === 'start' ? this.startCurrentMonth : this.endCurrentMonth);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }
  previousMonth(type: 'start' | 'end') {
    if (type === 'start') {
      if (this.startCurrentMonth === 0) {
        this.startCurrentMonth = 11;
        this.startCurrentYear--;
      } else {
        this.startCurrentMonth--;
      }
      this.generateCalendarDays('start');
    } else {
      if (this.endCurrentMonth === 0) {
        this.endCurrentMonth = 11;
        this.endCurrentYear--;
      } else {
        this.endCurrentMonth--;
      }
      this.generateCalendarDays('end');
    }
  }
  nextMonth(type: 'start' | 'end') {
    if (type === 'start') {
      if (this.startCurrentMonth === 11) {
        this.startCurrentMonth = 0;
        this.startCurrentYear++;
      } else {
        this.startCurrentMonth++;
      }
      this.generateCalendarDays('start');
    } else {
      if (this.endCurrentMonth === 11) {
        this.endCurrentMonth = 0;
        this.endCurrentYear++;
      } else {
        this.endCurrentMonth++;
      }
      this.generateCalendarDays('end');
    }
  }
  selectToday(type: 'start' | 'end') {
    const today = new Date();
    const dateString = this.formatDateForInput(today);
    if (type === 'start') {
      this.filterStartDate = dateString;
      this.startDateDropdownOpen = false;
      this.startCurrentMonth = today.getMonth();
      this.startCurrentYear = today.getFullYear();
      this.generateCalendarDays('start');
    } else {
      this.filterEndDate = dateString;
      this.endDateDropdownOpen = false;
      this.endCurrentMonth = today.getMonth();
      this.endCurrentYear = today.getFullYear();
      this.generateCalendarDays('end');
    }
  }
  selectTomorrow(type: 'start' | 'end') {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = this.formatDateForInput(tomorrow);
    if (type === 'start') {
      this.filterStartDate = dateString;
      this.startDateDropdownOpen = false;
      this.startCurrentMonth = tomorrow.getMonth();
      this.startCurrentYear = tomorrow.getFullYear();
      this.generateCalendarDays('start');
    } else {
      this.filterEndDate = dateString;
      this.endDateDropdownOpen = false;
      this.endCurrentMonth = tomorrow.getMonth();
      this.endCurrentYear = tomorrow.getFullYear();
      this.generateCalendarDays('end');
    }
  }
  getDateClasses(dateObj: any): string {
    let classes = '';
    if (!dateObj.isCurrentMonth) {
      classes += ' opacity-30 cursor-not-allowed';
    } else {
      classes += ' hover:bg-indigo-50 cursor-pointer';
    }
    if (dateObj.isSelected) {
      classes += ' relative z-10';
    }
    return classes;
  }
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  pageSize: number = 10;
  currentPage: number = 1;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.sortedPurchaseOrders.length / this.pageSize));
  }

  get pagedPurchaseOrders(): PurchaseOrder[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.sortedPurchaseOrders.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    const total = this.totalPages;
    if (page < 1) this.currentPage = 1;
    else if (page > total) this.currentPage = total;
    else this.currentPage = page;
  }
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
  this.currentPage = 1;
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
