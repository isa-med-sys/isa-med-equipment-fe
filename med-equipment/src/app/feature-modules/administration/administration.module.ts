import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemAdminProfileComponent } from './system-admin-profile/system-admin-profile.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RegisteredUserProfileComponent } from './registered-user-profile/registered-user-profile.component';
import { CompanyAdminProfileComponent } from './company-admin-profile/company-admin-profile.component';



@NgModule({
  declarations: [
    SystemAdminProfileComponent,
    RegisteredUserProfileComponent,
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
    CompanyAdminProfileComponent
  ]
})
export class AdministrationModule { }
