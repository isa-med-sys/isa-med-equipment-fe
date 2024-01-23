import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { User } from 'src/app/authentication/model/user.model';
import { Reservation } from 'src/app/shared/model/reservation';
import { ReservationService } from '../reservation.service';
import { AuthService } from 'src/app/authentication/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ImagePopupComponent } from 'src/app/shared/image-popup/image-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatSort, SortDirection } from '@angular/material/sort';

@Component({
  selector: 'app-reservation-history',
  templateUrl: './reservation-history.component.html',
  styleUrls: ['./reservation-history.component.scss']
})
export class ReservationHistoryComponent implements AfterViewInit {
  user!: User;

  displayedColumns: string[] = ['companyName', 'price', 'start', 'qrCode', 'cancelReservation'];
  reservations: MatTableDataSource<Reservation>;
  page: number = 0;
  size: number = 5;
  totalReservations = 0;
  
  sortField: string = 'start';
  sortDirection: string = 'desc'; 

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
    this.reservations = new MatTableDataSource<Reservation>();
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngAfterViewInit(): void {
    this.sort.direction = this.sortDirection as SortDirection;
    this.sort.active = this.sortField;

    this.sort.sortChange.subscribe(() => {
      this.sortField = this.sort.active;
      this.sortDirection = this.sort.direction as string;
      this.loadReservations();
    });

    this.cdr.detectChanges();
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getUpcomingReservationsByUser(
      this.user.id,
      this.page,
      this.size,
      this.sortField,
      this.sortDirection
    ).subscribe(result => {
      this.reservations = new MatTableDataSource<Reservation>();
      this.reservations.data = result.content;
      this.totalReservations = result.totalElements;
    });
  }
  
  onPageChange(event: PageEvent) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.loadReservations();
  }

  openQrCodePopup(qrCode: string): void {
    const dialogRef = this.dialog.open(ImagePopupComponent, {
      width: 'auto',
      height: 'auto',
      data: { image: this.getBase64Image(qrCode) }
    });
  }

  formatDate(dateArray: number[] | null): string {
    if (dateArray) {
      const dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
      return this.datePipe.transform(dateObject, ' HH:mm dd.MM.yyyy') ?? 'N/A';
    } else {
      return 'N/A';
    }
  }

  cancelReservation(reservation: Reservation): void {
    if (reservation.isCancelled) {
      this.openSnackBar('Reservation is already cancelled.', 'Close');
    } else {
      this.showCancelConfirmation(reservation);
    }
  }
  
  private showCancelConfirmation(reservation: Reservation): void {
    const confirmation = confirm('Are you sure you want to cancel the reservation?');
    if (confirmation) {
      this.confirmCancellation(reservation);
    }
  }
  
  private confirmCancellation(reservation: Reservation): void {
    this.reservationService.cancelReservation(reservation).subscribe(
      () => {
        this.handleCancellationSuccess();
      },
      (error) => {
        this.handleCancellationError(error);
      }
    );
  }
  
  private handleCancellationSuccess(): void {
    this.openSnackBar('Reservation cancelled.', 'Close');
    this.loadReservations();
  }
  
  private handleCancellationError(error: any): void {
    this.openSnackBar('Error cancelling reservation.', 'Close');
  }

  openSnackBar(message: string, action: string, verticalPosition: MatSnackBarVerticalPosition = 'bottom') {
    this.snackBar.open(message, action, {
      duration: 30000,
      verticalPosition: verticalPosition,
    });
  }

  getBase64Image(base64: string): string {
    console.log(base64);
    if(base64)
      return 'data:image/png;base64,' + base64;

    return 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Rickrolling_QR_code.png'
  }
}