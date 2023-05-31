import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';

import {SharedModule} from '../shared/shared.module';
import {AdminRoutingModule} from './admin-routing.module';
import { EditProductFormComponent } from './products-list/edit-product-form/edit-product-form.component';
import { EditProductPhotosComponent } from './products-list/edit-product-photos/edit-product-photos.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { UsersListComponent } from './users-list/users-list.component';

import { EditProductComponent } from './products-list/edit-product/edit-product.component';
import { UserEditComponent } from './users-list/user-edit/user-edit.component';
import { UserDetailsComponent } from './users-list/user-details/user-details.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationComponent } from './pagination/pagination.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { AllOrderDetailsComponent } from './all-orders/all-order-details/all-order-details.component';






@NgModule({
  declarations: [AdminComponent, EditProductComponent, EditProductFormComponent, EditProductPhotosComponent, ProductsListComponent, UsersListComponent, UserEditComponent, UserDetailsComponent, PaginationComponent, DashboardComponent, AllOrdersComponent, AllOrderDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    NgxPaginationModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule { }