import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PassvalueService } from '../service/passvalue.service';
import { EventScheduleService } from '../service/eventschedule.service';
import { EventSchedule } from '../model/eventschedule';

@Component({
  selector: 'app-modify-event',
  templateUrl: './modify-event.component.html',
  styleUrl: './modify-event.component.scss'
})
export class ModifyEventComponent implements OnInit,AfterViewInit {
  bookingFormGroup:FormGroup
  eventId:number=0;
  branchId:number=0;
  eventTitle:string=""
  eventDto: EventSchedule;
  constructor(private formBuild: FormBuilder,private passValue:PassvalueService,private ref:ChangeDetectorRef,private eventService:EventScheduleService)
  {
    this.passValue.getEventId.subscribe(x=>this.eventId = x)
    this.bookingFormGroup = this.formBuild.group({
      id:[0],
      name:[''],
      gender:['Male'],
      phone:[''],
      eventTitle:[''],
      serviceId:[''],
      scheduleDate:[''],
      startTime:[''],
      endTime:[''],
      isClosed:[false],
      isActive:[true],
      branchId:[''],
      therapistId:[0],
      userId:[0]
     
    })
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      
      this.passValue.setformHeader("Modify Events");
   
    this.ref.detectChanges()
   

    }
    ,0)
  }
  ngOnInit(): void {
    this.geteventDetails();
  }
  geteventDetails()
  {
    this.eventService.getEventByEventsId(this.eventId).subscribe(x=>{
      this.eventDto = x
      console.log(this.eventDto)
    })
  }

}
