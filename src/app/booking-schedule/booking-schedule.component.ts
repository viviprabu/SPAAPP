import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarOptions, EventInput, EventSourceFuncArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { ThirdPartyDraggable } from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'

// import timeGridPlugin from '@fullcalendar/timegrid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { EventsComponent } from '../add-events/events.component';
import { PassvalueService } from '../service/passvalue.service';
import { EventScheduleService } from '../service/eventschedule.service';
import { EventSchedule} from '../model/eventschedule';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Observable } from 'rxjs';
import { Services } from '../model/services';
import { ServicesService } from '../service/services.service';
import { formatDate } from '@angular/common';
import { UserStoreService } from '../service/user-store.service';
import { AuthService } from '../service/auth.service';
import { RoleService } from '../service/role.service';
import { Role } from '../model/role';
import { UserBranch } from '../model/userbranch';
import { UserbranchService } from '../service/userbranch.service';
import { CustomerService } from '../service/customer.service';
import { Users } from '../model/users';
import { Customer } from '../model/customer';
import { Branch } from '../model/branch';
import { BranchService } from '../service/branch.service';
import { ShowbranchComponent } from '../showbranch/showbranch.component';
import { BookingWizardComponent } from '../booking-wizard/booking-wizard.component';
import { GuestHomeComponent } from '../guest-home/guest-home.component';
import { Router } from '@angular/router';
import { TransactionComponent } from '../transaction/transaction.component';
import { AppService } from '../app.service';
import { ModifyEventComponent } from '../modify-event/modify-event.component';

@Component({
  selector: 'app-booking-schedule',
  templateUrl: './booking-schedule.component.html',
  styleUrl: './booking-schedule.component.scss'
})
export class BookingScheduleComponent implements OnInit,AfterViewInit{
  isModify:boolean;
  isApproved:boolean;
  @Input() showContent: TemplateRef<any>
  public role:string="";
  scheduleDate:Date=null;
  eventDto:EventSchedule[]=[];
  bookingDto:EventInput[]=[];
  events:EventInput[]=[];
  isShow:boolean = false;
  isSubmit:boolean = false;
  serviceDto : Services[]=[];
  eventId : number=0;
  schDate: Date =null;
  sltDuration:string='00:30';
  toggleWeek : boolean = false;
  currentDate: string="";
  dateString! : Date;
  fullName:string="";
  roleId:number=0;
  roleName:string="";
  roleDto:Role[]=[];
  branchId:number=0;
  userBranchDto:UserBranch[]=[];
  selectedUserBranch:UserBranch[]=[];
  UserDto:Users[]=[];
  userId:number=0;
  firstName:string=""
  lastName:string=""
  gender:string=""
  phone:string=""
  name:string=""
  selectedBranchDto:Branch[]=[];
  branchDto:Branch[]=[];
  eventHeight:number=0;
  isHide:boolean = false;
  // eventBills: EventInput[]=[];
  calendarOptions : CalendarOptions ={
    initialView : 'timeGridWeek',
   
    plugins : [dayGridPlugin,interactionPlugin,timeGridPlugin,listPlugin],
    // interactionPlugin
      headerToolbar: {
      right: 'prev,next today',
      center: 'title',
      left: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      
    },
    
    // eventMinHeight:this.eventHeight,
    weekends : true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    nowIndicator:true,     
    expandRows:true,
    slotMinTime:'07:00:00',
    eventTimeFormat : { hour12: true, hour: '2-digit', minute: '2-digit' },
  
    // slotMaxTime:'23:00:00',    
    
    
    // titleFormat:{dateStyle:'short'},
    dateClick: this.handleDateClick.bind(this), // MUST ensure `this` context is maintained
    eventClick: this.handleEventClick.bind(this),
    events:this.loadEvents.bind(this)
    
    
    
    //  [ 
      // { title: 'event 1', date: '01-01-2023' },
      // { title: 'event 2', date: '02-01-2023' }
    // ],
    
    
 
   
  }
 
  eventsPromise: Promise<EventInput>
  eventsObservable: Observable<EventInput>;

  bookingFormGroup: FormGroup;
  formHeader:string="";
  eventsIdDto: EventSchedule;
 

  constructor(private modalService: NgbModal,private passValue: PassvalueService, private eventService: EventScheduleService,private formBuild: FormBuilder,
    private servicesService: ServicesService, private userStore:UserStoreService, private auth:AuthService,private roleService: RoleService, private router: Router,
    private userBranchService: UserbranchService,private customerService: CustomerService,private branchService: BranchService,private ref: ChangeDetectorRef,private appService:AppService)
  {
    this.passValue.getScheduleDate.subscribe(x=>this.scheduleDate = x)
    this.passValue.getEventId.subscribe(x=>this.eventId = x);
    this.passValue.getIsModify.subscribe(x=>this.isModify = x)
    this.passValue.getIsApproved.subscribe(x=>this.isApproved = x)
    this.passValue.getName.subscribe(x=>this.name = x)
    this.passValue.getGender.subscribe(x=>this.gender = x)
    this.passValue.getPhone.subscribe(x=>this.phone = x)
    this.passValue.getBranchId.subscribe(x=>this.branchId = x)
    this.appService.getIsHide.subscribe(x=>this.isHide = x)
    
    // this.passValue.getSelectedBranchDto.subscribe(x=>this.selectedBranchDto = x)

    this.bookingFormGroup = this.formBuild.group({
      id:[0],
      name:['',Validators.required],
      phone:['',Validators.required],
      title:['',Validators.required],
      serviceId:['',Validators.required],
      scheduleDate:['',Validators.required],
      startTime:[''],
      endTime:[''],
      isClosed:[true],
      isActive:[true]
    })

   
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   this.ref.detectChanges()
  // }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      
      this.passValue.setformHeader( "Events Booking");
    this.ref.detectChanges()
    }
    ,0)
    
  }

  ngOnInit() {
    
    this.loadEvents1()
    this.passValue.getEventHeight.subscribe(x=>this.eventHeight = x);
  this.getBranch();
  this.getServices();
  // this.loadEvents(null);
  this.getNamefromToken()
  this.getRolefromToken();
  this.getUserId();
    this.eventHeight = 75;
    

    const eventTimeFormat = { hour12: false, hour: '2-digit', minute: '2-digit' };
    
  }
  getBranch()
  {
    this.branchService.getBranch().subscribe(res=>{
      this.branchDto = res
    });
    // this.eventService.getEvents().subscribe(data=>{
    //   this.eventDto = data;
    //   console.log(this.eventDto)
      
  }
  getUserId()
  {
    this.auth.getAllUsers().subscribe(res=>{
      this.UserDto = res.filter(x=>x.username == this.fullName)
      this.userId = this.UserDto[0].id
      
    })
  }

 slotDurationOneAndHalfHour()
 {
  this.sltDuration = '01:30'
  this.calendarOptions.slotDuration = this.sltDuration;
 }
 slotDurationOneHour()
 {
  this.sltDuration = '01:00'
  this.calendarOptions.slotDuration = this.sltDuration;
 }
  getServices()
  {
    this.servicesService.getService().subscribe(result=>{
      this.serviceDto = result;
    })
  }
 
  handleDateClick(arg)
  {
    // console.log(arg)
    let currentDate = formatDate(new Date(),'yyyy-MM-dd HH:mm:ss','en-us')
    let currentTime = formatDate(new Date(),'HH:mm:ss','en-us')
    let schdTime = formatDate(arg.dateStr,'HH:mm:ss','en-us')
    let schdDate = formatDate(arg.dateStr,'yyyy-MM-dd HH:mm:ss','en-us')
    // console.log(schdTime,currentTime)

    // if(schdDate >= currentDate)
    // {
      this.scheduleDate = arg.dateStr
      this.passValue.setScheduleDate(this.scheduleDate);
            this.isModify = false;
            this.passValue.setIsModify(this.isModify);
            this.isApproved = false;
            this.passValue.setIsModify(this.isApproved);  

            this.router.navigate(['/', 'events']);

        // this.modalService.open(EventsComponent,{
        //   size:'xl'
        //  })
         
            
    // }
    
    // else
    // {
    //   Swal.fire("Bookings not allowed in previous date & time")
    // }
    // Swal.fire('date click! ' + arg.dateStr);
  }
  // fetchEvents()
  // {
  //   this.eventService.getEvents().subscribe(result=>{
  //     this.eventDto = result
  //     this.eventBills = this.eventDto.map((e:any)=>({title:e.title,startTime:e.startTime,endTime:e.endTime}))
  //     console.log(this.eventBills)
  //   });
  // }


  loadEvents1(): any{

    this.auth.getAllUsers().subscribe(res=>{
      this.UserDto = res.filter(x=>x.username == this.fullName)
      this.userId = this.UserDto[0].id
      console.log(this.userId)

      let c =[]
      let a = this.eventService.getEventById(this.userId).subscribe(x=>{
        x.map(y=>{


          let b = {
           id:y.id.toString(),
           title:y.eventTitle,
           date:y.scheduleDate,
           start:y.startTime,
           end:y.endTime,
          }

c.push(b)
})
console.log(c)
          return c;
      });

    })

  }

loadEvents(args)
{
  
  
  this.events = [];

  if(this.roleName == "Guest")
  {
  
    return new Promise<EventInput[]>((resolve)=>{
      this.auth.getAllUsers().subscribe(res=>{
        this.UserDto = res.filter(x=>x.username == this.fullName)
        this.userId = this.UserDto[0].id
        // console.log(this.userId)
      })
      this.eventService.getEventById(this.userId).subscribe(result=>{
        result.filter(val=>{
          // console.log(result.length)
          
          this.events.push({
            id:val.id.toString(),
           title:val.eventTitle,
           date:val.scheduleDate,         
           start:val.startTime,
           end:val.endTime
          
           
          });
          resolve(this.events);
          
         
        });
      }, error=>console.error(error));
      
    });
  }
  else
  {
    this.events = [];
    return new Promise<EventInput[]>((resolve)=>{
      this.eventService.getEvents().subscribe(result=>{
        result.filter(val=>{
          // console.log(result.length)
          
          this.events.push({
            id:val.id.toString(),
           title:val.eventTitle,
           date:val.scheduleDate,         
           start:val.startTime,
           end:val.endTime
          
           
          });
          resolve(this.events)
        });
      }, error=>console.error(error));
      
    });
  }


  
}

  
  handleEventClick(arg)
  {
    var datestr = arg.dateStr
    this.eventId = arg.event.id;
    
        this.isModify = true;
        this.isHide = true
        this.passValue.setEventId(this.eventId)
        this.passValue.setIsModify(this.isModify);
        this.appService.setIsHide(this.isHide);
        // this.isApproved = true;
        // this.passValue.setIsModify(this.isApproved);
    

        // console.log(this.schDate)
    
   
    // this.modalService.open(EventsComponent,{size:'xl'})
    
    this.router.navigate(['/','events'])
  }

  toggleWeekends()
  {
    if(this.calendarOptions.weekends = !this.calendarOptions.weekends)   
      {
        this.toggleWeek = false
      }
      else
      {
        this.toggleWeek = true
      }
      
    
  
    
  }
  close()
  {
    this.modalService.dismissAll();
  }
  saveBooking()
  {

  }

  getNamefromToken()
  {
    this.userStore.getFullNameFromStore().subscribe(res=>{
      var fullNameFromToken = this.auth.getFullNamefromToken();
      this.fullName = res || fullNameFromToken     // //console.log(this.fullName)
    });
}
getRolefromToken()
  {
    this.userStore.getRoleFromStore().subscribe(res=>{
      var roleFromToken = this.auth.getRoleFromToken();
      this.role = res || roleFromToken

      this.roleService.getRole().subscribe(res=>{
        this.roleDto = res;
        this.roleDto.filter(x=>{
          if(x.id == parseInt(this.role))
          {
            this.roleName = x.name;
          }
        })
        // console.log(this.roleName)
      })
     
    });
}
getCustomerDetails()
{
 
    this.auth.getAllUsers().subscribe(user=>{
      this.UserDto = user
      this.UserDto.filter(x=>{
        if(x.username == this.fullName)
        {
          this.userId = x.id
          this.firstName = x.firstName
          this.lastName = x.lastName
          this.gender = x.gender
          this.phone = x.phone
          this.name = (this.firstName+' '+this.lastName)        
        }
      })      
      // console.log(this.firstName)
      // console.log(this.lastName)
      // console.log(this.gender)
      // console.log(this.phone)
      // console.log(this.name)
      this.passValue.setName(this.name)
      this.passValue.setGender(this.gender)
      this.passValue.setPhone(this.phone)
      })
    
    this.userBranchService.getUserBranch().subscribe(br=>{
      this.userBranchDto = br;
      this.selectedUserBranch = this.userBranchDto.filter(x=>{
       return x.id == this.userId
      })
      console.log(this.branchId)
      this.passValue.setBranchId(this.branchId)
    })

   this.selectedBranchDto =  this.branchDto.filter(x=>{
    // this.passValue.setSelectedBranchDto(this.selectedBranchDto)
      return x.id == this.selectedUserBranch[0].id
    })
    
  
}
}
