import { AfterViewInit, Component } from '@angular/core';
import { User } from 'src/app/authentication/model/user.model';
import { Reservation } from 'src/app/shared/model/reservation';
import { ReservationService } from '../reservation.service';
import { AuthService } from 'src/app/authentication/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-reservation-history',
  templateUrl: './reservation-history.component.html',
  styleUrls: ['./reservation-history.component.scss']
})
export class ReservationHistoryComponent implements AfterViewInit {
  user!: User;
  reservations!: MatTableDataSource<Reservation>;

  displayedColumns: string[] = ['ordinal', 'qrCode', 'isPickedUp', 'isCancelled'];
  page: number = 0;
  size: number = 5;
  totalReservations = 0;
  
  constructor(
    private reservationService: ReservationService,
    private authService: AuthService
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

  getBase64Image(base64: string): string {
    return 'data:image/png;base64,' + base64;
  }
}
