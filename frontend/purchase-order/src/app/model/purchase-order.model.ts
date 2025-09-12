export interface PurchaseOrder {
  id?: number;
  poNumber: string;
  description: string;
  supplierName: string;
  orderDate: string;
  totalAmount: number;
  status: PurchaseOrderStatus;
}

export type PurchaseOrderStatus = 'Draft' | 'Approved' | 'Shipped' | 'Completed' | 'Cancelled';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PurchaseOrderFilter {
  supplier?: string;
  status?: PurchaseOrderStatus;
  minTotalAmount?: number;
  maxTotalAmount?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface PaginationParams {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
