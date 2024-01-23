import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { MapComponent } from '../shared/map/map.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    HomeComponent
  ]
})
export class LayoutModule { }
