import { ChangeDetectorRef, Component } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AuthService } from 'src/app/authentication/auth.service';
import { AdministrationService } from '../administration.service';
import { CompanyAdmin } from 'src/app/shared/model/company-admin';
import { Calendar } from 'src/app/shared/model/calendar';
import {TimeSlot} from "../../../shared/model/timeslot";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  adminId?: number;
  admin!: CompanyAdmin;
  calendarData!: Calendar;

  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    initialView: 'timeGridWeek',
    slotMinTime: '00:00', // vidljivosti
    slotMaxTime: '24:00', // vidljivosti
    selectable: false, // da ne klikce
    editable: false, // da ne pomera
    weekends: true, // vikendi prikaz
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
    eventOverlap: false,
    eventColor: '#E0E0E0',
    eventTextColor: '#000000',
    eventBorderColor: '#777777',
    eventBackgroundColor: '#E0E0E0',
    // businessHours: {
    //   startTime: '09:00',
    //   endTime: '17:00',
    //   daysOfWeek: [1, 2, 3, 4, 5]
    // },
    //select: this.handleDateSelect.bind(this),
    //eventClick: this.handleEventClick.bind(this),
    //eventsSet: this.handleEvents.bind(this),
    // eventAdd: this.addToBase(this),
    // eventChange: this.changeToBase(this),
    // eventRemove: this.removeToBase(this),
  };
  currentEvents: EventApi[] = [];

  constructor(private changeDetector: ChangeDetectorRef, authService: AuthService, private administrationService: AdministrationService, private fb: FormBuilder) {
    this.adminId = authService.user$.value.id;

    this.timeslotGroup = this.fb.group({
      date: [''],
      time: [''],
      selectedAdmin: ['']
    });
  }

  ngOnInit() {
    this.initializeCalendar();
  }

  initializeCalendar() {
    if (this.adminId) {
      this.administrationService.getCompanyAdmin(this.adminId).subscribe({
        next: (user) => {
          this.admin = user;

          this.administrationService.getCalendar(this.admin.company.id).subscribe({
            next: (result) => {
              this.calendarData = result;
              this.calendarOptions.slotMinTime = this.calendarData.workStartTime[0] + ':' + this.calendarData.workStartTime[1];
              this.calendarOptions.slotMaxTime = this.calendarData.workEndTime[0] + ':' + this.calendarData.workEndTime[1];
              this.calendarOptions.weekends = this.calendarData.worksOnWeekends;
              let fullCalendarEvents = this.calendarData.timeSlots.map(slot => {
                const startDateTime = new Date(slot.start[0], slot.start[1] - 1, slot.start[2], slot.start[3], slot.start[4]);
                const endDateTime = new Date(startDateTime.getTime() + slot.duration * 1000);
                const eventColor1 = slot.isFree ? 'hsl(120, 100%, 85%)' : 'hsl(0, 100%, 85%)';
                const eventColor2 = slot.isFree ? '#00ff00' : '#ff0000';
                return {
                  title: slot.admin.name,
                  start: startDateTime,
                  end: endDateTime,
                  backgroundColor: eventColor1,
                  borderColor: eventColor2,
                  textColor: '#000000',
                };
              });
              this.calendarOptions.events = fullCalendarEvents;
            }
          });
        },
        error: (err) => {
          console.error('Error fetching admin profile:', err);
        }
      });
    }
  }

  // handleDateSelect(selectInfo: DateSelectArg) {
  //   const title = prompt('Please enter a new title for your event');
  //   const calendarApi = selectInfo.view.calendar;

  //   calendarApi.unselect(); // clear date selection

  //   if (title) { //dodaj na bek
  //     calendarApi.addEvent({
  //       id: this.createEventId(),
  //       title,
  //       start: selectInfo.startStr,
  //       end: selectInfo.endStr,
  //       allDay: selectInfo.allDay
  //     });
  //   }
  // }

  // createEventId() {
  //   return String(this.eventGuid++);
  // }


  // handleEventClick(clickInfo: EventClickArg) {
  //   if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
  //     clickInfo.event.remove();
  //   }
  // }

  // handleEvents(events: EventApi[]) {
  //   this.currentEvents = events;
  //   this.changeDetector.detectChanges();
  // }

  timeslotGroup: FormGroup;
  adminsList: CompanyAdmin[] = [];
  adminsListIds: number[] = [];
  showForm: boolean = false;
  errMessage: string = '';
  showErr: boolean = false;

  initializeTimeSlotFormGroup() {
    this.timeslotGroup = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      selectedAdmin: ['', Validators.required]
    });
  }

  addTimeSlot() {
    this.initializeTimeSlotFormGroup();
    this.showForm = true;
    this.administrationService.getAllAdmins(this.admin.company.id).subscribe(result => {
      this.adminsList = result;
    });
    this.administrationService.getAllAdminIds(this.admin.company.id).subscribe(result => {
      this.adminsListIds = result;
    });
    this.errMessage = '';
    this.showErr = false;
  }

  discardChanges() {
    this.showForm = false;
  }

  createTimeSlot() {
    if (this.timeslotGroup.valid) {
      // Date
      const dateString: string = this.timeslotGroup.get('date')?.value;
      const selectedDate: Date = new Date(dateString);
      // Time
      const time: string = this.timeslotGroup.get('time')?.value;
      const [hours, minutes] = time.split(':');
      const selectedHours: number = parseInt(hours, 10);
      const selectedMinutes: number = parseInt(minutes, 10);
      // Admin
      const tempAdmin: CompanyAdmin = this.timeslotGroup.get('selectedAdmin')?.value;
      const index = this.adminsList.indexOf(tempAdmin);
      const selectedAdminIdx = this.adminsListIds[index];

      let tempTimeSlot: TimeSlot = {
        id: 0,
        admin: tempAdmin,
        companyAdminId: selectedAdminIdx,
        start: [selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate(), selectedHours, selectedMinutes],
        duration: 30,
        isFree: true,
      }

      this.administrationService.addTimeSlot(tempTimeSlot).subscribe({
        next: (result) => {
          tempTimeSlot = result;
          this.showForm = false;
          this.initializeCalendar();
        },
        error: (err) => {
          console.error('Error occurred:', err);
          this.showErr = true;
          this.errMessage = err.error || 'An error occurred';
        }
      });
    }
  }
}
