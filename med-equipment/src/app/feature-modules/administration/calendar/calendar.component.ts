import { ChangeDetectorRef, Component } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  eventGuid = 0;
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
    weekends: true,
    editable: false,
    selectable: true,
    selectOverlap: false,
    selectMirror: true,
    dayMaxEvents: false,
    height: 650,
    locale: 'en-GB',
    allDaySlot: false,
    slotDuration: '00:30',
    slotMinTime: '06:00',
    slotMaxTime: '18:00',
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    dayHeaderFormat: {
      weekday: 'short', // Display the full name of the day (e.g., "Monday")
      month: 'numeric',
      day: 'numeric',
      omitCommas: true, // Remove commas between weekday and date
    },
    firstDay: 1,
    slotLabelInterval: { hours: 1 },
    eventOverlap: false,
    events: [ //fetch
      { title: 'Meeting222', start: new Date() },
    ],
    eventColor: '#378006',
    eventBackgroundColor: '#111006',
    //eventBorderColor text
    businessHours: { // Define your work hours
      startTime: '09:00',
      endTime: '17:00',
      daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
    },
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    // eventAdd: this.addToBase(this),
    // eventChange: this.changeToBase(this),
    // eventRemove: this.removeToBase(this),
  };
  currentEvents: EventApi[] = [];

  constructor(private changeDetector: ChangeDetectorRef) {
  }
  
  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;
    
    calendarApi.unselect(); // clear date selection
    
    if (title) { //dodaj na bek
      calendarApi.addEvent({
        id: this.createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }
  
// const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

// export const INITIAL_EVENTS: EventInput[] = [
//   {
//     id: createEventId(),
//     title: 'All-day event',
//     start: TODAY_STR
//   },
//   {
//     id: createEventId(),
//     title: 'Timed event',
//     start: TODAY_STR + 'T00:00:00',
//     end: TODAY_STR + 'T03:00:00'
//   },
//   {
//     id: createEventId(),
//     title: 'Timed event',
//     start: TODAY_STR + 'T12:00:00',
//     end: TODAY_STR + 'T15:00:00'
//   }
// ];

  createEventId() {
    return String(this.eventGuid++);
  }


  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }
}
