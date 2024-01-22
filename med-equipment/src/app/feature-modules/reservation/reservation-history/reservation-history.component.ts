import { AfterViewInit, Component } from '@angular/core';
import { User } from 'src/app/authentication/model/user.model';
import { Reservation } from 'src/app/shared/model/reservation';
import { ReservationService } from '../reservation.service';
import { AuthService } from 'src/app/authentication/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reservation-history',
  templateUrl: './reservation-history.component.html',
  styleUrls: ['./reservation-history.component.scss']
})
export class ReservationHistoryComponent implements AfterViewInit {
  user!: User;
  reservations!: MatTableDataSource<Reservation>;

  displayedColumns: string[] = ['ordinal', 'qrCode', 'isPickedUp', 'isCancelled', 'cancelReservation'];
  page: number = 0;
  size: number = 5;
  totalReservations = 0;
  
  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngAfterViewInit() {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.reservationService.getReservationsByUser(this.user.id, this.page, this.size).subscribe(result => {
      this.reservations = new MatTableDataSource<Reservation>();
      this.reservations.data = result.content;
      this.totalReservations = result.totalElements;
    });
  }
  
  onPageChange(event: PageEvent) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.loadCompanies();
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
    this.loadCompanies();
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
    return 'data:image/png;base64,' + base64;
  }
}
