import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { TestErrorComponent } from './core/test-error/test-error.component';
import { HomeComponent } from './home/home.component';
import { AdminGuard } from './core/guards/admin.guard';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { EditUserComponent } from './user-settings/edit-user/edit-user.component';

const routes: Routes = [
 /*  {path: '', component: HomeComponent, data: {breadcrumb: 'Home'}}, */
 {path: '', redirectTo: 'shop', pathMatch: 'full'},
  {path: 'test-error', component: TestErrorComponent},
 /*  {path: 'not-found', component: NotFoundComponent}, */
  {path: 'server-error', component: ServerErrorComponent},
  {path: 'shop', loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)},
  {path: 'basket', loadChildren: () => import('./basket/basket.module').then(m => m.BasketModule)},
  {
    path: 'checkout', 
    canActivate: [AuthGuard],
    loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule)
  },
  {
    path: 'orders', 
    canActivate: [AuthGuard],
    loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module')
      .then(mod => mod.AccountModule), data: { breadcrumb: { skip: true } }
  },

  {
    path: 'user-settings',
    loadChildren: () => import('./user-settings/user-settings.module')
      .then(mod => mod.UserSettingsModule), data: { breadcrumb: { skip: false } }
  },


 /*  {path: 'user-settings', component: UserSettingsComponent, data: {breadcrumb: 'user-settings'}},
  {path: 'user-settings/EditUserComponent', component: EditUserComponent, data: {breadcrumb: 'Edit-user'}}, */
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () => import('./admin/admin.module')
      .then(mod => mod.AdminModule), data: { breadcrumb: 'Admin' }
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
