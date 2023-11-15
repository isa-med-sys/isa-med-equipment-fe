import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';



@NgModule({
  declarations: [
    EquipmentComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ]
})
export class MarketplaceModule { }
