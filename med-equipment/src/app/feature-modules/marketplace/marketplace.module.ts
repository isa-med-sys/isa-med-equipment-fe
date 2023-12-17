import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EquipmentComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatSelectModule,
    FormsModule,
  ]
})
export class MarketplaceModule { }
