import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemAdminProfileComponent } from './system-admin-profile/system-admin-profile.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RegisteredUserProfileComponent } from './registered-user-profile/registered-user-profile.component';
import { CompanyAdminProfileComponent } from './company-admin-profile/company-admin-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';



@NgModule({
  declarations: [
    SystemAdminProfileComponent,
    RegisteredUserProfileComponent,
    ChangePasswordComponent,
    CompanyAdminProfileComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [
    SystemAdminProfileComponent,
    RegisteredUserProfileComponent,
    ChangePasswordComponent,
    CompanyAdminProfileComponent
  ]
})
export class AdministrationModule { }
