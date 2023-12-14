import { Component, OnInit } from '@angular/core';
import { Company } from "../../../shared/model/company";
import { CompanyService } from "../company.service";
import { ActivatedRoute } from "@angular/router";
import { Equipment } from "../../../shared/model/equipment";
import { TimeSlot } from 'src/app/shared/model/timeslot'; 
import { AuthService } from 'src/app/authentication/auth.service';
import { Reservation } from 'src/app/shared/model/reservation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit {
  companyId!: number;
  company!: Company;
  equipment: Equipment[] = [];
  reservations: Equipment[] = [];
  timeSlots: TimeSlot[] = [];
  selectedTimeSlotId: string | null = null;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'timeGridWeek',
    events: [],
    slotDuration: '00:30:00',
    eventClick: this.handleEventClick.bind(this), 
  };

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.companyId = +params['id'];
      this.initializeData(); 
    });
  }

  initializeData() {
    this.loadCompany();
    this.loadEquipment();
    this.loadTimeSlots();
  }

  loadCompany() {
    this.companyService.getCompanyById(this.companyId).subscribe({
      next: (company) => {
        this.company = company;
      }
    });
  }

  loadEquipment() {
    this.companyService.getEquipment(this.companyId).subscribe({
      next: (result) => {
        this.equipment = result;
      }
    });
  }

  loadTimeSlots() {
    this.companyService.getAvailableTimeSlots(this.companyId).subscribe(
      (timeSlots: TimeSlot[]) => {
        this.timeSlots = timeSlots;
        const events = this.timeSlots.map(slot => this.mapTimeSlotToEvent(slot));
        this.calendarOptions.events = events;
      },
      (err) => {
        console.error('Error fetching time slots:', err);
      }
    );
  }

  mapTimeSlotToEvent(slot: TimeSlot): any {
    const startDate = new Date(slot.start[0], slot.start[1] - 1, slot.start[2], slot.start[3], slot.start[4]);
    const endDate = new Date(startDate.getTime() + slot.duration * 1000);
  
    return {
      id: String(slot.id), 
      title: slot.isFree ? 'Available' : 'Reserved',
      start: startDate,
      end: endDate,
    };
  }
  
  addToReservation(equipment: Equipment) {
    if (!this.reservations.includes(equipment))
      this.reservations.push(equipment);
  }

  removeFromReservation(equipment: Equipment) {
    const index = this.reservations.indexOf(equipment);
    if (index !== -1) {
      this.reservations.splice(index, 1);
    }
  }

  handleEventClick(info: EventClickArg) {
    this.selectedTimeSlotId = info.event.id;
  }

  finalizeReservation() {
    if (this.reservations.length > 0 && this.selectedTimeSlotId) {
      const reservation: Reservation = {
        userId: this.authService.user$.value.id,
        companyId: this.companyId,
        equipmentIds: this.reservations.map(equipment => equipment.id),
        timeSlotId: +this.selectedTimeSlotId, 
      };

      this.companyService.makeReservation(reservation).subscribe(
        (result) => {
          this.openSnackBar('Reservation successful. Check your email for reservation details.', 'Close');
          this.clearAndReloadData();
        },
        (error) => {
          this.openSnackBar('Reservation failed.', 'Close');
        }
      );
    } else {
      this.openSnackBar('Please select equipment and a time slot before finalizing the reservation.', 'Close');
    }
  }

  clearAndReloadData() {
    this.reservations = [];
    this.selectedTimeSlotId = null;
    this.initializeData();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 30000
    });
  }

  isReservationValid(): boolean {
    return this.reservations.length > 0 && !!this.selectedTimeSlotId;
  }
}