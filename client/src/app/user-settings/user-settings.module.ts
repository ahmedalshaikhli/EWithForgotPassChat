import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserSettingsComponent } from './user-settings.component';


@NgModule({
  declarations: [EditUserComponent,UserSettingsComponent],
  imports: [
    CommonModule,
    
    UserSettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule
 
  ]
})
export class UserSettingsModule { }
