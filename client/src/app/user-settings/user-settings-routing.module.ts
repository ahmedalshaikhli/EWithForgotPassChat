import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserSettingsComponent } from './user-settings.component';

const routes: Routes = [
  
  { path: '', component: UserSettingsComponent },
  { path: 'edit-user', component: EditUserComponent },
  // ...
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSettingsRoutingModule { }
