import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyProfileComponent } from "./company-profile/company-profile.component";
import { MaterialModule } from "../../infrastructure/material/material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";



@NgModule({
  declarations: [
    CompanyProfileComponent,
    CompanyListComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [
    CompanyProfileComponent,
    CompanyListComponent
  ]
})
export class CompanyModule { }
