import { Component } from '@angular/core';
import { Company } from "../../../shared/model/company";
import { CompanyService } from "../company.service";
import { ActivatedRoute } from "@angular/router";
import { Equipment } from "../../../shared/model/equipment";

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent {

  companyId!: number;
  company!: Company;
  equipment: Equipment[] = [];

  constructor(private route: ActivatedRoute, private companyService: CompanyService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.companyId = +params['id'];
    });

    this.companyService.getCompanyById(this.companyId).subscribe({
      next: (company) => {
        this.company = company;

        //if(this.userRole) {
          this.companyService.getEquipment(this.companyId).subscribe({
            next: (result) => {
              this.equipment = result;
              console.log(this.equipment);
            }
          });
        //}
      },
      error: (err) => {
        console.error('Error fetching company:', err);
      }
    });
  }
}
