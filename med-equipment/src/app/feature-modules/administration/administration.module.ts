import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemAdminProfileComponent } from './system-admin-profile/system-admin-profile.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';



@NgModule({
  declarations: [
    SystemAdminProfileComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [
    SystemAdminProfileComponent
  ]
})
export class AdministrationModule { }
