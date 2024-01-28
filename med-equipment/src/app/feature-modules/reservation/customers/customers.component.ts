import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {User} from "../../../authentication/model/user.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {AuthService} from "../../../authentication/auth.service";
import {ReservationService} from "../reservation.service";
import {CompanyAdmin} from "../../../shared/model/company-admin";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements AfterViewInit {
  user!: User;
  admin!: CompanyAdmin;

  displayedColumns: string[] = ['Name', 'Surname', 'Company', 'Email'];

  customers: MatTableDataSource<User>;
  page: number = 0;
  size: number = 5;
  totalCustomers = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService
  ) {
    this.customers = new MatTableDataSource<User>();
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngAfterViewInit() {
    this.reservationService.getCompanyAdmin(this.user.id).subscribe({
      next: (result) => {
        this.admin = result;
        this.loadCustomers();
      }
    });
  }

  loadCustomers() {
    this.reservationService.getCustomers(this.admin.company.id, this.page, this.size).subscribe({
      next: (result) => {
        this.customers = new MatTableDataSource<User>();
        this.customers.data = result.content;
        this.totalCustomers = result.totalElements;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.loadCustomers();
  }
}
