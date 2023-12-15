import { ChangeDetectorRef, Component } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AuthService } from 'src/app/authentication/auth.service';
import { AdministrationService } from '../administration.service';
import { CompanyAdmin } from 'src/app/shared/model/company-admin';
import { Calendar } from 'src/app/shared/model/calendar';

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

  constructor(private changeDetector: ChangeDetectorRef, authService: AuthService, private administrationService: AdministrationService) {
    this.adminId = authService.user$.value.id;
  }

  ngOnInit() {
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
}
