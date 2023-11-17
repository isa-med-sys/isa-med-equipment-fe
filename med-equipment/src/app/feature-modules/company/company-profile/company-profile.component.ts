import { Component } from '@angular/core';
import { Company } from "../../../shared/model/company";
import { CompanyService } from "../company.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent {

  companyId!: number;
  company!: Company;

  constructor(private route: ActivatedRoute, private companyService: CompanyService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.companyId = +params['id'];
    });

    this.companyService.getCompanyById(this.companyId).subscribe({
      next: (company) => {
        this.company = company;
      },
      error: (err) => {
        console.error('Error fetching company:', err);
      }
    });
  }
}
