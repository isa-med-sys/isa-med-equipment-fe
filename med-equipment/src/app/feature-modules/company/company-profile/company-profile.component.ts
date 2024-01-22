import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Company } from "../../../shared/model/company";
import { CompanyService } from "../company.service";
import { ActivatedRoute } from "@angular/router";
import { Equipment } from "../../../shared/model/equipment";
import { TimeSlot } from 'src/app/shared/model/timeslot';
import { AuthService } from 'src/app/authentication/auth.service';
import { Reservation } from 'src/app/shared/model/reservation';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import { User } from 'src/app/authentication/model/user.model';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CustomTimeSlot } from 'src/app/shared/model/custom-time-slot';
import { createDuration } from '@fullcalendar/core/internal';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit {
  user!: User;
  companyId!: number;
  company!: Company;
  equipment: Equipment[] = [];
  reservations: Equipment[] = [];
  timeSlots: TimeSlot[] = [];
  selectedTimeSlotId: string | null = null;
  customTimeSlot?: {
    start: Date
  };

  calendarOptions: CalendarOptions = {
    plugins: [ interactionPlugin, dayGridPlugin, timeGridPlugin,],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    initialView: 'timeGridWeek',
    slotMinTime: '00:00',
    slotMaxTime: '24:00', 
    selectable: true, 
    editable: false, 
    weekends: true, 
    nowIndicator: true,
    selectMirror: true,
    dayMaxEvents: false,
    selectOverlap: false,
    allDaySlot: false,
    slotDuration: '00:30',
    locale: 'en-GB',
    height: 550,
    firstDay: 1,
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    dayHeaderFormat: {
      weekday: 'short',
      month: 'numeric',
      day: 'numeric',
      omitCommas: true,
    },
    slotLabelInterval: { hours: 1 },
    events: [],
    eventColor: '#2ECBE9',
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
  };

  currentEvents: EventApi[] = [];

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef
  ) {
    this.authService.user$.subscribe(user => {
      this.user = user;      
    });
  }

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
        this.updateCalendarOptions();
      }
    });
  }

  updateCalendarOptions() {
    if (this.company.workStartTime !== undefined && this.company.workEndTime !== undefined) {
      this.calendarOptions.weekends = this.company.worksOnWeekends;

      const startHour = +this.company.workStartTime[0];
      const startMinute = +this.company.workStartTime[1];
      this.calendarOptions.slotMinTime = createDuration({ hours: startHour, minutes: startMinute });


      const endHour = +this.company.workEndTime[0];
      const endMinute = +this.company.workEndTime[1];
      this.calendarOptions.slotMaxTime = createDuration({ hours: endHour, minutes: endMinute });
    }
  }

  loadEquipment() {
    this.companyService.getAvailableEquipmentByCompany(this.companyId).subscribe({
      next: (result) => {
        this.equipment = result;
      }
    });
  }

  loadTimeSlots() {
    this.companyService.getAvailableTimeSlots(this.companyId).subscribe(
      (timeSlots: TimeSlot[]) => {
        if (timeSlots.length > 0) {
          this.timeSlots = timeSlots;
          const events = this.timeSlots.map(slot => this.mapTimeSlotToEvent(slot));
          this.calendarOptions.events = events;
        } else {
          this.calendarOptions.events = [{ title: 'No available time slots', start: new Date() }];
        }
      },
      (err) => {
        console.error('Error fetching time slots:', err);
      }
    );
  }

  mapTimeSlotToEvent(slot: TimeSlot): any {
    const startDate = new Date(slot.start[0], slot.start[1] - 1, slot.start[2], slot.start[3], slot.start[4]);
    const endDate = new Date(startDate.getTime() + slot.duration * 1000);
    const isSelected = String(slot.id) == this.selectedTimeSlotId;
    const backgroundColor = isSelected ? '#2ECBE9' : '#a5a5a5';
    return {
      id: String(slot.id),
      title: isSelected ? 'Your Pick' : 'Available',
      backgroundColor: backgroundColor,
      borderColor: backgroundColor,
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


  finalizeReservation() {
    if (this.selectedTimeSlotId == null && this.customTimeSlot) {
      this.companyService.createTimeSlot(this.companyId, this.customTimeSlot)
        .pipe(
          finalize(() => {
            this.finalizeReservationAfterTimeSlotCreation();
          })
        )
        .subscribe({
          next: (result) => {
            this.selectedTimeSlotId = result.id.toString();
          },
          error: (e) => {
            this.openSnackBar(`Try picking another time slot!\n${e.error}`, 'Close');
          }
        });
    } else {
      this.finalizeReservationAfterTimeSlotCreation();
    }
  }

  private finalizeReservationAfterTimeSlotCreation() {
    if (this.reservations.length > 0 && this.selectedTimeSlotId) {
      const reservation: Reservation = {
        userId: this.user.id,
        companyId: this.companyId,
        equipmentIds: this.reservations.map(equipment => equipment.id),
        timeSlotId: +this.selectedTimeSlotId,
      };

      this.companyService.makeReservation(reservation).subscribe(
        () => {
          this.openSnackBar('Reservation successful. Check your email for reservation details.', 'Close');
          this.clearAndReloadData();
        },
        (e) => {
          this.openSnackBar(`Reservation failed.\n${e.error}`, 'Close');
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

  handleEventClick(info: EventClickArg) {
    this.selectedTimeSlotId = info.event.id;
    this.calendarOptions.events = this.timeSlots.map(slot => this.mapTimeSlotToEvent(slot));
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.selectedTimeSlotId = null;
    this.calendarOptions.events = this.timeSlots.map(slot => this.mapTimeSlotToEvent(slot));

    const selectedDate = new Date(selectInfo.start.getTime() - selectInfo.start.getTimezoneOffset() * 60000);
    this.customTimeSlot = {
      start: selectedDate, 
    };
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    
    this.changeDetector.detectChanges();
  }

  openSnackBar(message: string, action: string, verticalPosition: MatSnackBarVerticalPosition = 'bottom') {
    this.snackBar.open(message, action, {
      duration: 30000,
      verticalPosition: verticalPosition,
    });
  }

  formatTime(timeArray: number[] | undefined): string {
    if (timeArray && timeArray.length === 2) {
      const [hour, minute] = timeArray;

      const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
      const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;

      return `${formattedHour}:${formattedMinute}`;
    }
    return 'N/A';
  }
  
  isReservationValid(): boolean {
    return this.reservations.length > 0 && !!this.selectedTimeSlotId;
  }

  isEquipmentInReservations(equipment: Equipment): boolean {
    return this.reservations.includes(equipment);
  }
}