import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './admin.component';

import { UsersListComponent } from './users-list/users-list.component';
import { ProductsListComponent } from './products-list/products-list.component';

import { EditProductComponent } from './products-list/edit-product/edit-product.component';
import { UserEditComponent } from './users-list/user-edit/user-edit.component';
import { UserDetailsComponent } from './users-list/user-details/user-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AllOrdersComponent } from './all-orders/all-orders.component';
import { AllOrderDetailsComponent } from './all-orders/all-order-details/all-order-details.component';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },

      { path: 'products-list', component: ProductsListComponent },
      { path: 'users-list', component: UsersListComponent },
      {path: 'create', component: EditProductComponent, data: {breadcrumb: 'Create'}},
      {path: 'products-list/edit/:id', component: EditProductComponent, data: {breadcrumb: 'Edit'}},
      { path: 'users-list/edit/:id', component: UserEditComponent },
      { path: 'users-list/details/:id', component: UserDetailsComponent },
      { path: 'all-orders', component: AllOrdersComponent },
      { path: 'all-orders/details/:email', component: AllOrderDetailsComponent },
    ],
  },

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }