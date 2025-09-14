import { Routes } from '@angular/router';
import { PurchaseOrderListComponent } from './component/purchase-order-list-component/purchase-order-list.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PurchaseOrderListComponent
  }
];
