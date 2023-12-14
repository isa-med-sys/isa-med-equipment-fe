import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyProfileComponent } from "./company-profile/company-profile.component";
import { CompanySearchComponent } from "./company-search/company-search.component";
import { MaterialModule } from "../../infrastructure/material/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@NgModule({
  declarations: [
    CompanySearchComponent,
    CompanyProfileComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    FullCalendarModule,
    MatSnackBarModule
  ],
  exports: [
    CompanySearchComponent,
    CompanyProfileComponent
  ]
})
export class CompanyModule { }
