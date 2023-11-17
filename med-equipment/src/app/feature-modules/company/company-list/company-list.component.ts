import { Component } from '@angular/core';
import { Company } from "../../../shared/model/company";
import { CompanyService } from "../company.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent {

  companies: Company[] = [];

  constructor(private router: Router, private companyService: CompanyService) {
  }

  ngOnInit() {
    this.companyService.getCompanies().subscribe({
      next: (result) => {
        this.companies = result;
      },
      error: (err) => {
        console.error('Error fetching companies:', err);
      }
    });
  }

  viewCompanyDetails(id: number) {
    this.router.navigate(['company', id]);
  }
}
