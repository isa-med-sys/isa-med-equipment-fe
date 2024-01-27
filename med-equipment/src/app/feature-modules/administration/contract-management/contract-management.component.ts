import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/authentication/model/user.model';
import { Contract } from 'src/app/shared/model/contract';
import { AdministrationService } from '../administration.service';
import { AuthService } from 'src/app/authentication/auth.service';
import { CompanyAdmin } from 'src/app/shared/model/company-admin';
import { PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-contract-management',
  templateUrl: './contract-management.component.html',
  styleUrls: ['./contract-management.component.scss']
})
export class ContractManagementComponent implements OnInit {
  user!: User;
  admin!: CompanyAdmin;

  displayedColumns: string[] = ['companyName', 'startDate', 'equipment'];
  contracts: MatTableDataSource<Contract>;
  page: number = 0;
  size: number = 5;
  totalContracts = 0;

  constructor(private administrationService: AdministrationService, private authService: AuthService, private datePipe: DatePipe) {
    this.contracts = new MatTableDataSource<Contract>();
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {
    if (this.user.id) {
      this.administrationService.getCompanyAdmin(this.user.id).subscribe({
        next: (user) => {
          this.admin = user;
          this.loadContracts();
        },
        error: (err) => {
          console.error('Error fetching admin profile:', err);
        }
      });
    }
  }

  loadContracts(): void {
    this.administrationService.getActiveReservationsByCompany(
      this.admin.company.id,
      this.page,
      this.size,
    ).subscribe(result => {
      this.contracts = new MatTableDataSource<Contract>();
      this.contracts.data = result.content;
      this.totalContracts = result.totalElements;
    });
  }

  onPageChange(event: PageEvent) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.loadContracts();
  }

  formatDate(dateArray: number[] | null): string {
    if (dateArray) {
      const dateObject = new Date(dateArray[0], dateArray[1], dateArray[2]);
      return this.datePipe.transform(dateObject, 'dd.MM.yyyy') ?? 'N/A';
    } else {
      return 'N/A';
    }
  }
}
