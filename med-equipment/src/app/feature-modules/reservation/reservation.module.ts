import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationHistoryComponent } from './reservation-history/reservation-history.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PickupHistoryComponent } from './pickup-history/pickup-history.component';

@NgModule({
  declarations: [
    ReservationHistoryComponent,
    PickupHistoryComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    SharedModule
  ],
  exports: [
    ReservationHistoryComponent,
    PickupHistoryComponent
  ]
})
export class ReservationModule { }