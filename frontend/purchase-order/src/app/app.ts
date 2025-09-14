import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PurchaseOrderListComponent } from "./component/purchase-order-list-component/purchase-order-list.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <router-outlet/>
  `,
  styles: [],
})
export class App {
  protected readonly title = signal('purchase-order');
}
