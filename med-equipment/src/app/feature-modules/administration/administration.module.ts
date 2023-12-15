import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemAdminProfileComponent } from './system-admin-profile/system-admin-profile.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RegisteredUserProfileComponent } from './registered-user-profile/registered-user-profile.component';
import { CompanyAdminProfileComponent } from './company-admin-profile/company-admin-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CalendarComponent } from './calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { RouterModule } from '@angular/router';
import {MatSelectModule} from "@angular/material/select";



@NgModule({
  declarations: [
    SystemAdminProfileComponent,
    RegisteredUserProfileComponent,
    ChangePasswordComponent,
    CompanyAdminProfileComponent,
    CalendarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    FullCalendarModule,
    RouterModule,
    MatSelectModule
  ],
  exports: [
    SystemAdminProfileComponent,
    RegisteredUserProfileComponent,
    ChangePasswordComponent,
    CompanyAdminProfileComponent
  ]
})
export class AdministrationModule { }
