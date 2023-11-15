import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../marketplace.service';
import { Equipment } from '../model/equipment.model';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {
  
  equipment: Equipment[] = [];

  constructor(private service: MarketplaceService) {}
  
  ngOnInit(): void {
    this.service.getEquipment().subscribe({
      next: (result: Equipment[]) => {
        this.equipment = result;
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

  onShowCompanies(equipment: Equipment): void {
    
  }
}
