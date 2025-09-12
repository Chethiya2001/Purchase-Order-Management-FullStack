import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseUrl } from '../utils/baseUrl';
import { ApiResponse, PurchaseOrder } from '../model/purchase-order.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  private readonly apiUrl = `${BaseUrl.apiUrl}/purchase-orders`;

  constructor(private http: HttpClient) { }

  fetchAll(filter?: any): Observable<ApiResponse<PurchaseOrder[]>> {
    // Optionally pass filter as query params
    return this.http.get<ApiResponse<PurchaseOrder[]>>(this.apiUrl, { params: filter });
  }

  getById(id: number): Observable<ApiResponse<PurchaseOrder>> {
    return this.http.get<ApiResponse<PurchaseOrder>>(`${this.apiUrl}/${id}`);
  }

  create(purchaseOrder: PurchaseOrder): Observable<ApiResponse<PurchaseOrder>> {
    return this.http.post<ApiResponse<PurchaseOrder>>(this.apiUrl, purchaseOrder);
  }

  edit(id: number, purchaseOrder: PurchaseOrder): Observable<ApiResponse<PurchaseOrder>> {
    return this.http.put<ApiResponse<PurchaseOrder>>(`${this.apiUrl}/${id}`, purchaseOrder);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

}
