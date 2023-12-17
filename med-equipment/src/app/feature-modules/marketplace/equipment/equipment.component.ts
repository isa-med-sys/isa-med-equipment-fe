import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../marketplace.service';
import { Equipment } from '../../../shared/model/equipment';
import { Company } from 'src/app/shared/model/company';
import { AuthService } from 'src/app/authentication/auth.service';
import { User } from 'src/app/authentication/model/user.model';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {
  
  equipment: Equipment[] = [];
  companies: Company[] = [];
  isShowingCompanies: boolean = false;
  rating: number = 1;
  name: string = '';
  type: string = 'ALL';
  userId?: number;
  userRole?: string;

  constructor(private service: MarketplaceService, authService: AuthService) {
    this.userId = authService.user$.value.id;
    this.userRole = authService.user$.value.role;
  }
  
  ngOnInit(): void {
    this.search();
  }

  onShowCompanies(equipmentId: number): void {
    this.isShowingCompanies = true;
    this.service.getCompaniesByEquipment(equipmentId).subscribe({
      next: (result: Company[]) => {
        this.companies = result;
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

  updateSliderValue(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.rating = parseFloat(value);
  }

  search(): void {
    this.isShowingCompanies = false;
    if (this.userId && this.userRole) {
  
      this.service.searchEquipment(this.name, this.type, this.rating, this.userId, this.userRole).subscribe({
        next: (result: Equipment[]) => {
          this.equipment = result;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    } else {
      console.error('User or user id is undefined.');
    }
  }
}
