import { Component } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { AuthService } from 'src/app/authentication/auth.service';
import { Reservation } from 'src/app/shared/model/reservation';
import { Order } from 'src/app/shared/model/order';

@Component({
  selector: 'app-order-taking',
  templateUrl: './order-taking.component.html',
  styleUrls: ['./order-taking.component.scss']
})
export class OrderTakingComponent {
  selectedFile!: File;
  adminId: number;
  order?: Order;

  constructor(private administrationService: AdministrationService, authService: AuthService) { 
    this.adminId = authService.user$.value.id;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadImage(): void {
    if (this.selectedFile) {
      this.administrationService.uploadImage(this.adminId, this.selectedFile)
      .subscribe({
        next: (result) => {
          this.order = result;
          if(!this.order?.isValid) {
            // izbaciti ga iz tvoje liste (isc f isp f)
          }
        },
        error: (err) => {
          console.error('Error');
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
      this.administrationService.completeOrder(res)
      .subscribe({
        next: (result) => {
          alert(res); // dodati onaj bolji
          // resertuj pejdz
        },
        error: (err) => {
          console.error('Error completing order');
        }
      });
    }
  }
}
