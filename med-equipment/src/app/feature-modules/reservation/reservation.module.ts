import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationHistoryComponent } from './reservation-history/reservation-history.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ReservationHistoryComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    SharedModule
  ],
  exports: [
    ReservationHistoryComponent
  ]
})
export class ReservationModule { }
