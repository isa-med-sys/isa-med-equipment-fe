import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { AdministrationService } from '../administration.service';
import { AuthService } from 'src/app/authentication/auth.service';
import { Reservation } from 'src/app/shared/model/reservation';
import { Order } from 'src/app/shared/model/order';
import { CompanyAdmin } from "../../../shared/model/company-admin";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, SortDirection } from "@angular/material/sort";
import {DatePipe} from "@angular/common";
import {MatSnackBar, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";

@Component({
  selector: 'app-order-taking',
  templateUrl: './order-taking.component.html',
  styleUrls: ['./order-taking.component.scss']
})
export class OrderTakingComponent implements OnInit {
  selectedFile!: File;
  adminId: number;
  admin?: CompanyAdmin;
  order?: Order;

  displayedColumns: string[] = ['companyName', 'price', 'start', 'showOrder'];
  reservations: MatTableDataSource<Reservation>;
  page: number = 0;
  size: number = 5;
  totalReservations = 0;

  sortField: string = 'start';
  sortDirection: string = 'desc';

  notFoundQR: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private administrationService: AdministrationService, authService: AuthService,
              private cdr: ChangeDetectorRef,
              private datePipe: DatePipe,
              private snackBar: MatSnackBar) {
    this.adminId = authService.user$.value.id;
    this.reservations = new MatTableDataSource<Reservation>();
  }

  ngOnInit() {
    // this.sort.direction = this.sortDirection as SortDirection;
    // this.sort.active = this.sortField;
    //
    // this.sort.sortChange.subscribe(() => {
    //   this.sortField = this.sort.active;
    //   this.sortDirection = this.sort.direction as string;
    //   this.getCompanyAdmin();
    // });

    this.cdr.detectChanges();
    this.getCompanyAdmin();
  }

  onPageChange(event: PageEvent) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.getAllOrders();
  }

  getCompanyAdmin() {
    if (this.adminId) {
      this.administrationService.getCompanyAdmin(this.adminId).subscribe({
        next: (result) => {
          this.admin = result;
          this.getAllOrders();
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  getAllOrders() {
    this.administrationService.getAllOrders(
      this.admin!.company.id,
      this.page,
      this.size,
      this.sortField,
      this.sortDirection
    ).subscribe({
      next: (result) => {
        this.reservations = new MatTableDataSource<Reservation>();
        this.reservations.data = result.content;
        this.totalReservations = result.totalElements;
        console.log(result.content);
      },
    });
  }

  showReservation(reservation: Reservation): void {
    this.notFoundQR = false;
    console.log(reservation);
    if (reservation.id){
      this.administrationService.getOrder(reservation.id, this.adminId).subscribe({
        next: (result) => {
          this.order = result;
          this.getAllOrders();
        },
      });
    }
  }

  formatDate(dateArray: number[] | null): string {
    if (dateArray) {
      const dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
      return this.datePipe.transform(dateObject, ' HH:mm dd.MM.yyyy') ?? 'N/A';
    } else {
      return 'N/A';
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.notFoundQR = false;
  }

  uploadImage(): void {
    if (this.selectedFile) {
      this.administrationService.uploadImage(this.adminId, this.selectedFile)
      .subscribe({
        next: (result) => {
          this.order = result;
          console.log(result);
          this.getAllOrders();
        },
        error: (err) => {
          console.error('Error');
          this.notFoundQR = true;
        }
      });
    }
  }

  finishTakingOrder(): void {
    if(this.order) {
      let res: Reservation = {
        id: this.order.id,
        userId: 0,
        companyId: 0,
        equipmentIds: [],
        timeSlotId: 0
      };

      const tempTimeslotStart: Date = new Date(this.order.timeslotStart[0], this.order.timeslotStart[1] - 1, this.order.timeslotStart[2], this.order.timeslotStart[3], this.order.timeslotStart[4]);
      const currentTime: Date = new Date();

      if (tempTimeslotStart < currentTime) {
        this.administrationService.completeOrder(res)
          .subscribe({
            next: (result) => {
              this.openSnackBar('Order has been taken.', 'Close');
              this.getAllOrders();
              this.order = undefined;
            },
            error: (err) => {
              console.error('Error completing order');
            }
          });
      } else {
        this.openSnackBar('Poranijo si', 'Close');
      }
    }
  }

  openSnackBar(message: string, action: string, verticalPosition: MatSnackBarVerticalPosition = 'bottom') {
    this.snackBar.open(message, action, {
      duration: 30000,
      verticalPosition: verticalPosition,
    });
  }
}
