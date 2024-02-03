import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CalendarOptions, EventInput, EventSourceFuncArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { ThirdPartyDraggable } from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../app.service';
import { PassvalueService } from '../service/passvalue.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit, AfterViewInit
{
 
  calendarOptions : CalendarOptions ={
    initialView : 'timeGridDay',
    views: {
      timeGridFourDay: {
        type: 'timeGrid',
        duration: { days: 2 }
      }
    },
   
    plugins : [dayGridPlugin,interactionPlugin,timeGridPlugin,listPlugin],
    // interactionPlugin
      headerToolbar: {
      right: 'prev,next',
      center: '',
      left: 'title',
      
    },
    
    // eventMinHeight:this.eventHeight,
    weekends : true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    nowIndicator:true,     
    expandRows:true,
    // eventMinHeight:75,
    slotMinTime:'07:00:00',
    eventTimeFormat : { hour12: true, hour: '2-digit', minute: '2-digit' },
  
    // slotMaxTime:'23:00:00',    
    
    
    // titleFormat:{dateStyle:'short'},
    dateClick: this.handleDateClick.bind(this), // MUST ensure `this` context is maintained
    // eventClick: this.handleEventClick.bind(this),
    // events:this.loadEvents.bind(this)
    
    
    
    //  [ 
      // { title: 'event 1', date: '01-01-2023' },
      // { title: 'event 2', date: '02-01-2023' }
    // ],
    
    
 
   
  }
 
  eventsPromise: Promise<EventInput>
  scheduleDate:Date=new Date();
  formHeader:string=""
 
 constructor(private modalService: NgbModal, private appService: AppService,private ref: ChangeDetectorRef, private passValue: PassvalueService)
 {
    this.appService.getScheduleDate.subscribe(x=>this.scheduleDate = x)
 
 }
 
ngAfterViewInit(): void {
  setTimeout(()=>{
    
    this.passValue.setformHeader("Calendar");
  this.ref.detectChanges()
  }
  ,0)
  
}
  ngOnInit(): void {
   
  }
  handleDateClick(arg)
  {
    this.scheduleDate = arg.dateStr;
    console.log(arg.dateStr)

  }
  confirmSelectedSlot()
  {
    this.appService.setScheduleDate(this.scheduleDate)
    this.modalService.dismissAll();
    
  }


}
