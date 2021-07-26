import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { StoredEventsViewerComponent } from './components/stored-events-viewer/stored-events-viewer.component';
import { ProductSelectionComponent } from './components/product-selection/product-selection.component';
import { OrdersComponent } from './components/orders/orders.component';
import { RouterModule } from '@angular/router';
import { CustomerProfileComponent } from './components/customer-profile/customer-profile.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderByPipe } from 'src/app/core/pipes/order-by.pipe';

@NgModule({
   declarations: [
      HomeComponent,
      StoredEventsViewerComponent,
      ProductSelectionComponent,
      CartDetailsComponent,
      OrdersComponent,
      CustomerProfileComponent,
      OrderByPipe
   ],
   imports: [
      CommonModule,
      SharedModule,
      RouterModule,
      NgbDatepickerModule
   ],
   providers: []
})
export class EcommerceModule { }