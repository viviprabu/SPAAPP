import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Services } from '../model/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesService } from '../service/services.service';
import { PassvalueService } from '../service/passvalue.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { EventScheduleService } from '../service/eventschedule.service';
import { Title } from '@angular/platform-browser';
import { FormatWidth, formatDate } from '@angular/common';
import { CalendarOptions, EventInput, FormatDateOptions } from '@fullcalendar/core';
import { CustomerService } from '../service/customer.service';
import { Customer } from '../model/customer';
import { CustomerComponent } from '../customer/customer.component';
import { TransactionComponent } from '../transaction/transaction.component';
import { BookingInvoiceComponent } from '../booking-invoice/booking-invoice.component';
import { BranchService } from '../service/branch.service';
import { Branch } from '../model/branch';
import { Role } from '../model/role';
import { AuthService } from '../service/auth.service';
import { UserStoreService } from '../service/user-store.service';
import { RoleService } from '../service/role.service';
import { Users } from '../model/users';
import { UserBranch } from '../model/userbranch';
import { UserbranchService } from '../service/userbranch.service';
import { EventSchedule} from '../model/eventschedule';
import {SelectedBranchList } from '../model/events';
import { AppService } from '../app.service';
import { TherapistSales } from '../model/therapistSales';
import { TherapistService } from '../service/therapist.service';
import { Therapist} from '../model/therapist';
import moment, { now } from 'moment';
import { Shift } from '../model/shift';
import { ShiftService } from '../service/shift.service';
import { Observable, min, timestamp } from 'rxjs';
import { TherapistAvailability } from '../model/therapistAvailability';
import { GetTherapistShift } from '../model/GetTherapistShift';
import { SlotTimingService } from '../service/slottiming.service';
import { SlotTiming } from '../model/slottiming';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { ThirdPartyDraggable } from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import { BookingScheduleComponent } from '../booking-schedule/booking-schedule.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { Router } from '@angular/router';
import { error } from 'jquery';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
  
})
export class EventsComponent implements OnInit, AfterViewInit {


  calendarOptions : CalendarOptions ={
    initialView : 'timeGridDay',
    // views: {
    //   timeGridFourDay: {
    //     type: 'agendaWeek',
    //     duration: { days: 2 }
    //   }
    // },
   
    plugins : [dayGridPlugin,interactionPlugin,timeGridPlugin,listPlugin],
    // interactionPlugin
      headerToolbar: {
      right: 'prev,next',
      center: '',
      left: 'title',
      
    },
    
    // eventMinHeight:this.eventHeight,
    
    contentHeight:500,
    
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
    dateClick: this.selectDate.bind(this), // MUST ensure `this` context is maintained
    // eventClick: this.handleEventClick.bind(this),
    events:this.loadEvents.bind(this)
    //  [ 
      // { title: 'event 1', date: '01-01-2023' },
      // { title: 'event 2', date: '02-01-2023' }
    // ],
  } 
  eventsPromise: Promise<EventInput>
  // eventsObservable: Observable<EventInput>;
  
  // selectedBranchDto: SelectedBranch[]=[];
  optionHeader:string="---Select any Therapist---"
  times:string="";
  serviceId:number=0;
  branchId :number = 0;
  branchList:Branch[]=[];
  userDto:Users[]=[];
  public role:string="";
  fullName: string="";
  roleDto:Role[]=[];
  public roleName:string="";
  isApproved:boolean;
  isSubmit:boolean = false;
  isChecked:boolean = false;
  isModify:boolean = false;
  bookingDto : EventSchedule[]=[];
  serviceDto: Services[]=[];
  bookingFormGroup: FormGroup;
  scheduleDate:Date = new Date();
  eventDto:EventSchedule[]=[];
  eventId: number = 0;
  customerDto : Customer[]=[];
  customerFormGroup:FormGroup;
  searchTerm:string="";
  isSelected:boolean= false
  price:number=0;
  bookingStatus : string="";
  isActive:boolean = false;
  updateDto: Customer[]=[];
  branchDto: Branch[]=[];
  gender:string=""
  phone:string=""
  name:string=""
  therapistDto: Therapist[]=[];  
  userBranchDto:UserBranch[]=[]; 
  userdto:Users[]=[];
  timeSlot:number=0;
  showAddress:boolean= false;
  therapistName:string="";
  workingTime:string="";
  selectedTherapistDto : Therapist[]=[];
  selectedShiftDto:Shift[]=[];
  outOfWorkingTime:boolean=false;
  shiftId : number=0;
  therapistAvailableTimeDto : TherapistAvailability[]=[];
  availableTime: Date= new Date();
  timeDto : EventSchedule[]=[];
  availableTimeDto:TherapistAvailability[]=[];
  tempAvailableTimeDto:TherapistAvailability[]=[];
  maxDto:EventSchedule[]=[];
  eventHeight:Number = 0;
  currentDate:Date = new Date();
  therapistShiftDto:GetTherapistShift[]=[];
  check:boolean = false;
  serviceTime:number=0;
  branchName:string="";
  onCheck:boolean = false;
  currencyCode:string="";
  slotTimeDto : SlotTiming[]=[]
  selectedSlotTime:Date = new Date();
  events: any[];
  userId:number=0;
  therapistSelection:string="";
  serviceName:string="";
  now:any;
  showContent:boolean=false;
  sDate: any;
  time1: any;
  time2: any;
  service: any;
  therapist: any;
  formHeader:string="";
  userByPhoneDto:Users[]=[]
  signFormGroup:FormGroup;
  userBranchSelectedDto: UserBranch;
  userEventDto: EventSchedule;
  showSaveButton:boolean = true;
  serviceEventDto: Services[];
  tprSelected:number=0;
  currentUser: Users;
  tempTherapistDto: any;
  tempTimeDto: EventSchedule[];
  eventsDto: EventSchedule[];
  selectedbranchDto: Branch[];
  tempBranchDto: { check: boolean; id: number; name: string; countryId: number; createdOn: string; companyId: number; openingTime: Date; closingTime: Date; isActive: boolean; isChecked: boolean; company: import("d:/Applications/SpaApp/src/app/model/company").Company[]; transaction: import("d:/Applications/SpaApp/src/app/model/transaction").Transaction[]; checked: boolean; }[];
  constructor(private formBuild: FormBuilder,private services: ServicesService,private passValue: PassvalueService,private modalService: NgbModal,
    private eventService: EventScheduleService, private customerService: CustomerService, private branchService: BranchService,private auth:AuthService,
    private userStore: UserStoreService, private roleService: RoleService,private userBranchService:UserbranchService, private appService: AppService,
    private therapistService: TherapistService, private shiftService:ShiftService, private eventScheduleService: EventScheduleService, private slotTimeService: SlotTimingService,
    private ref: ChangeDetectorRef,private timeSlotService: SlotTimingService,private router:Router,private servicesService:ServicesService)
  {
    
    this.passValue.getEventId.subscribe(x=>this.eventId = x);
    this.passValue.getIsModify.subscribe(x=>this.isModify = x)
    this.passValue.getIsApproved.subscribe(x=>this.isApproved = x)
    this.passValue.getName.subscribe(x=>this.name = x)
    this.passValue.getGender.subscribe(x=>this.gender = x)
    this.passValue.getPhone.subscribe(x=>this.phone = x)
    this.passValue.getBranchId.subscribe(x=>this.branchId = x)
    
    this.passValue.getEventHeight.subscribe(x=>this.eventHeight = x)     
     
    this.appService.getServiceId.subscribe(x=>this.serviceId = x)
    this.appService.getPrice.subscribe(x=>this.price = x)
    this.appService.getCurrencyCode.subscribe(x=>this.currencyCode = x)   
    this.appService.getServiceTime.subscribe(x=>this.serviceTime = x)
    this.appService.getServiceName.subscribe(x=>this.serviceName = x)    
    this.passValue.getScheduleDate.subscribe(x=>this.scheduleDate = x) 
    this.appService.getbranchList.subscribe(x=>this.branchList = x)
    setInterval(() => {
      this.now = new Date().toString().split(' ')[4];
    }, 1);
    
   
    
    this.bookingFormGroup = this.formBuild.group({
      id:[0],
      name:['',Validators.required],
      gender:['Male'],
      phone:['',Validators.required],
      eventTitle:[''],
      serviceId:['',Validators.required],
      scheduleDate:['',Validators.required],
      startTime:['',Validators.required],
      endTime:['',Validators.required],
      isClosed:[false],
      isActive:[true],
      branchId:['',Validators.required],
      therapistId:['',Validators.required],
      userId:[0]
     
    }),
    this.signFormGroup = this.formBuild.group({
      firstName:[""],
      lastName:[""],
      phone:[""],
    })
   
  }

  
  ngAfterViewInit(): void {
    setTimeout(()=>{
      
      this.passValue.setformHeader("Events");
      
      
    
    this.ref.detectChanges()
    }
    ,0)
    
  }
  ngOnInit() {
    this.passValue.getBranchId.subscribe(x=>this.branchId = x)   
    
    this.loadMasterDatas() 
    this.getDateValues() 
   
   
    
    this.bookingFormGroup.get('startTime')?.valueChanges.subscribe(()=>this.setEndTime())
    this.scheduleDate = this.bookingFormGroup.get('scheduleDate').value
  
   
    // this.loadTherapistAvailableTime();
    if(this.isModify)
    {
      this.showSaveButton = false;
      this.getEventsById();
      
    }  
    this.getBranchList();
  }
  
  loadMasterDatas()
  {
    this.therapistService.getTherapist().subscribe(tr=>this.tempTherapistDto = tr.map(y=>({...y, checked:false})))    
    this.servicesService.getService().subscribe(sr=>this.serviceDto=sr.map(x=>({...x, ischecked:false})))
    this.eventService.getEvents().subscribe(result=>this.eventsDto = result)
    this.roleService.getRole().subscribe(rl=>this.roleDto = rl)   
    this.auth.userDetail$.subscribe(x=>{this.currentUser = x})
    // if(this.serviceId == 0)
    // {

    // }
    // else
    // {
     
   
  }
  getBranchList()
  {
   this.branchService.getBranchByUsername(this.currentUser.username).subscribe(res=>{
    this.tempBranchDto = res.map(y=>({...y, check:false}))
    this.branchDto = this.tempBranchDto
  })
 
    
  }

  getDateValues()
  {
   
    this.bookingFormGroup.controls['serviceId'].setValue(this.serviceName)
    this.bookingFormGroup.controls['branchId'].setValue(this.branchId)    
    if(this.scheduleDate !=null)
    {
      this.bookingFormGroup.controls['scheduleDate'].setValue(formatDate(this.scheduleDate,'yyyy-MM-dd','en-us'))
 
      let now3 = new Date(this.scheduleDate);
     let hours3 = ("0"+ now3.getHours()).slice(-2);
     let minutes3 = ("0"+ now3.getMinutes()).slice(-2);
     let str3 = hours3 + ":" + minutes3;
     this.bookingFormGroup.controls['startTime'].setValue(str3)
    }
    else
    {
      this.bookingFormGroup.controls['scheduleDate'].setValue(formatDate(new Date(),'yyyy-MM-dd','en-us'))
    }

    
    
  }
  
  
 
  
  loadEvents()
  {
    this.events = [];

    // if(this.roleName == "Guest")
    // {
    
      return new Promise<EventInput[]>((resolve)=>{
        // this.eventService.getEvents().subscribe(result=>{
          this.eventsDto.filter(val=>{
            // console.log(result.length)
            
            this.events.push({
              id:val.id.toString(),
             title:val.eventTitle,
             date:val.scheduleDate,         
             start:val.startTime,
             end:val.endTime
            });
            resolve(this.events);
            
           
          // });
        }, error=>console.error(error));
        
      });

  }
  confirmSelectedSlot()
  {
        this.availableTimeDto = [];
        // this.therapistService.getTherapist().subscribe(res=>{
          this.therapistDto.filter(y=>y.branchId == this.branchId).map(x=>({...x, checked:false}))  
          const schdDate = this.bookingFormGroup.controls['scheduleDate'].value
          this.eventService.getAvailableTimeList(this.serviceId,new Date(schdDate)).subscribe(res=>{
            this.timeDto = res 
          this.availableTimeDto = this.timeDto.filter(x=>x.branchId == this.branchId)
          })
          
          // this.eventService.getAvailableTimeList(this.serviceId,new Date(this.scheduleDate)).subscribe(res=>{
          //   this.timeDto = res
            // this.timeDto.filter(x=>{
            //   if(this.therapistDto.find(y=>y.id == x.id))
            //   {
            //     this.availableTimeDto.push({
            //       id:x.id,
            //       name:x.name,
            //       availableTime:x.availableTime,
            //       checked:false
            //     })
            //   }
            // })
    
      
            
          // })
   
    // })
    this.modalService.dismissAll();
  }
  selectDate(arg)
  {
    let currentDate = formatDate(new Date(),'yyyy-MM-dd HH:mm:ss','en-us')
    let currentTime = formatDate(new Date(),'HH:mm:ss','en-us')
    let schdTime = formatDate(arg.dateStr,'HH:mm:ss','en-us')
    let schdDate = formatDate(arg.dateStr,'yyyy-MM-dd HH:mm:ss','en-us')
    // console.log(schdTime,currentTime)

    if(schdDate >= currentDate)
    {
    this.scheduleDate = arg.dateStr
    // console.log(this.scheduleDate)
    // this.passValue.setScheduleDate(this.scheduleDate)
    this.bookingFormGroup.controls['scheduleDate'].setValue(formatDate(this.scheduleDate,'yyyy-MM-dd','en-us'))

     let now3 = new Date(arg.dateStr);
    let hours3 = ("0"+ now3.getHours()).slice(-2);
    let minutes3 = ("0"+ now3.getMinutes()).slice(-2);
    let str3 = hours3 + ":" + minutes3;
    
    this.bookingFormGroup.controls['startTime'].setValue(str3)
    
    let timeTo = formatDate(addMinutes(new Date(this.scheduleDate),this.serviceTime),'hh:mm a','en-us') 
      // console.log('TimeTo',timeTo)
      this.bookingFormGroup.controls['endTime'].setValue(timeTo)
    }
    else
    {
      Swal.fire("Bookings not allowed in previous date & time")
    }
    

  }
  updateEndTime(e)
  {
    let timeTo = formatDate(addMinutes(new Date(),this.serviceTime),'hh:mm a','en-us') 
      // console.log('TimeTo',timeTo)
      this.bookingFormGroup.controls['endTime'].setValue(timeTo)
  }
 

  setEndTime(){
    let selectedTime = this.bookingFormGroup.get('startTime')?.value;
    let endTime;

    if(selectedTime){
      let today = new Date();
      let [hours, minutes] = selectedTime.split(':')

      today.setHours(Number(hours))
      today.setMinutes(Number(minutes))

      today.setMinutes(today.getMinutes()+this.serviceTime);

      endTime = formatDate(today,'hh:mm a','en-us')

      this.bookingFormGroup.get('endTime').setValue(endTime);
    }

    // console.log(endTime)
  }
  
  getBranchId(e,row)
  {
    
     this.branchDto = this.branchDto.filter(y=>{
      y.check=false;
      return y
    })
    row.check = e.target.checked
    this.branchId = row.id
    this.passValue.setBranchId(row.id);
      this.bookingFormGroup.controls['branchId'].setValue(row.id)  
      this.therapistDto = this.tempTherapistDto.filter(x=>x.branchId == row.id)
      
      this.eventService.getAvailableTimeList(this.serviceId,new Date(this.scheduleDate)).subscribe(res=>{
        this.timeDto = res
        this.availableTimeDto = this.timeDto.filter(x=>x.branchId == row.id)

    })
         
       this.showContent = true;
       this.getUserDetails();

  }
 


 
 
 getUserDetails()
 {
      this.roleDto.filter(x=>{
        if(x.id == this.currentUser.roleId)
        this.roleName = x.name
      })
      if(this.roleName == 'Guest')
      {
          this.bookingFormGroup.controls['name'].setValue(this.currentUser.firstName+' '+this.currentUser.lastName)
          this.bookingFormGroup.controls['phone'].setValue(this.currentUser.phone)
           this.bookingFormGroup.controls['gender'].setValue(this.currentUser.gender)
           this.bookingFormGroup.controls['userId'].setValue(this.currentUser.id)
      }
      else
      {
        this.bookingFormGroup.controls['name'].setValue("")
          this.bookingFormGroup.controls['phone'].setValue("")
           this.bookingFormGroup.controls['gender'].setValue("")
           this.bookingFormGroup.controls['userId'].setValue("")   
      }
    
   
    

   
  
  
  

  
 }
 getUserByPhone()
 {
  const phone = this.bookingFormGroup.controls['phone'].value
    
  if(phone != null)
  {
    this.auth.checkExistingUser(phone).subscribe({
      next:((res)=>{
        
          this.bookingFormGroup.controls['name'].setValue(res[0].firstName)
          this.bookingFormGroup.controls['phone'].setValue(res[0].phone)
           this.bookingFormGroup.controls['gender'].setValue(res[0].gender)
           this.bookingFormGroup.controls['userId'].setValue(res[0].id)
      }),      
     error:(err)=>{
      Swal.fire(err?.error.message);
      this.bookingFormGroup.controls['name'].setValue("")          
           this.bookingFormGroup.controls['gender'].setValue("")
           this.bookingFormGroup.controls['userId'].setValue("")
     }
    })
    
  }
  else
  {
    Swal.fire('Enter phone to search?')
  }
 }
  addNew()
  {
    
    this.modalService.open(CustomerComponent,{size:'lg'})
    
  }
 
 
  
  getEventsById()
  {
     
      
      this.eventService.getEventByEventsId(this.eventId).subscribe(x=>{
         
        this.branchService.getBranchByUsername(this.currentUser.username).subscribe(res=>{
          this.tempBranchDto = res.filter(y=>y.id == x.branchId).map(y=>({...y, check:false}))
          this.selectedbranchDto = this.tempBranchDto
          this.selectedTherapistDto = this.tempTherapistDto.filter((tpr:any)=>tpr.branchId == x.branchId)
        

        this.branchId = x.branchId;
        this.tprSelected = x.therapistId
        this.scheduleDate = x.scheduleDate
        this.serviceId = x.serviceId
        //  this.branchDto = this.tempBranchDto.filter(res=>res.id == x.branchId)
     
            this.bookingFormGroup.controls['id'].setValue(x.id);
            // this.bookingFormGroup.controls['title'].setValue(x.eventTitle);
            this.bookingFormGroup.controls['name'].setValue(x.name);
            this.bookingFormGroup.controls['gender'].setValue(x.gender);
            this.bookingFormGroup.controls['phone'].setValue(x.phone);
            this.bookingFormGroup.controls['scheduleDate'].setValue(formatDate(new Date(x.scheduleDate),'yyyy-MM-dd','en-us'));         
            this.bookingFormGroup.controls['userId'].setValue(x.userId);
            this.bookingFormGroup.controls['branchId'].setValue(x.branchId);
            this.bookingFormGroup.controls['therapistId'].setValue(x.therapistId)
           
            
            let now3 = new Date(x.startTime);
            let hours3 = ("0"+ now3.getHours()).slice(-2);
            let minutes3 = ("0"+ now3.getMinutes()).slice(-2);
            let str3 = hours3 + ":" + minutes3;
            this.bookingFormGroup.controls['startTime'].setValue(str3)
            
            this.bookingFormGroup.controls['endTime'].setValue(formatDate(x.endTime,'hh:mm a','en-us'));
            
            const serviceName = this.serviceDto.filter(y=>y.id == this.serviceId)             
                this.bookingFormGroup.controls['serviceId'].setValue(serviceName[0].name);
            // const therapist = this.therapistDto.filter(y=>y.id == x.therapistId)
            this.eventService.getAvailableTimeList(this.serviceId,new Date(x.scheduleDate)).subscribe(res=>{
              this.timeDto = res
            this.availableTimeDto = this.timeDto.filter(y=>y.branchId == x.branchId)
            })
          })
              
          
            
           
            
             
              // this.branchName = this.branchDto[0].name
           
             

              })

            
          
        }
      
  generateTitle()
  {
            // let now3 = new Date(this.bookingFormGroup.controls['startTime'].value);
            // let hours3 = ("0"+ now3.getHours()).slice(-2);
            // let minutes3 = ("0"+ now3.getMinutes()).slice(-2);
            // let str3 = hours3 + ":" + minutes3;
    
    // let startTime = this.bookingFormGroup.controls['startTime'].value

    // // console.log(startTime)

    
    // let endTime = this.bookingFormGroup.controls['endTime'].value

    // console.log(endTime)

    // const therapistId = this.bookingFormGroup.controls['therapistId'].value
    // this.therapistService.getTherapist().subscribe(res=>{
    //   this.therapistDto = res
    //   this.therapistDto.filter(x=>{
    //     if(x.id == therapistId)
    //     {
    //       this.therapistName = x.name
       
    //     }
        this.bookingFormGroup.controls['eventTitle'].setValue(this.therapist +"-"+ this.bookingFormGroup.get('startTime').value +"-"+ this.bookingFormGroup.get('endTime').value)
        
    //   })
    // })
      this.bookingFormGroup.controls['serviceId'].setValue(this.serviceId)
      this.bookingFormGroup.controls['scheduleDate'].setValue(formatDate(this.scheduleDate,'yyyy-MM-dd','en-us'))
      // this.bookingFormGroup.controls['startTime'].setValue(this.scheduleDate)
      // this.bookingFormGroup.controls['endTime'].setValue(this.scheduleDate)
      
    // });        
    // const date = this.scheduleDate;
    // const time = this.bookingFormGroup.controls['startTime'].value;
    // const yy = new Date(date).getFullYear();
    // const mm = new Date(date).getMonth() + 1;    
    // const dd = new Date(date).getDate();

    // var intermeddt = new Date(yy + '-' + mm + '-' + dd)
    // intermeddt.setHours((time.split(' ')[0]).split(':')[0]);
    // intermeddt.setMinutes((time.split(' ')[0]).split(':')[1]);   

    // this.bookingFormGroup.controls['startTime'].setValue(formatDate(intermeddt,'yyyy-MM-dd HH:mm a','en-us'))

    // const date1 = this.scheduleDate;
    // const time1 = this.bookingFormGroup.controls['endTime'].value;
    // const yy1 = new Date(date1).getFullYear();
    // const mm1 = new Date(date1).getMonth() + 1;    
    // const dd1 = new Date(date1).getDate();

    // var intermeddt1 = new Date(yy1 + '-' + mm1 + '-' + dd1);
    // intermeddt1.setHours((time1.split(' ')[0]).split(':')[0]);
    // intermeddt1.setMinutes((time1.split(' ')[0]).split(':')[1]);
    // this.bookingFormGroup.controls['endTime'].setValue(formatDate(intermeddt1,'yyyy-MM-dd HH:mm a','en-us'))
  
  }
  openVerifyDetails(modal)
  {
    if(this.roleName == 'Guest')
    {
      if(this.bookingFormGroup.valid)
      {
      this.sDate = this.bookingFormGroup.controls['scheduleDate'].value
      this.time1 = this.bookingFormGroup.controls['startTime'].value
      this.time2 = this.bookingFormGroup.controls['endTime'].value
      this.service = this.bookingFormGroup.controls['serviceId'].value
      this.therapistDto.filter(x=>{
        if(x.id == this.bookingFormGroup.controls['therapistId'].value)
        {
          this.therapist = x.name
        }
      })
      this.modalService.open(modal,{size:'lg',centered:true})
      }
      else
      {
  
      this.isSubmit = true;
      
      }
    }
    else
    {
      if(this.bookingFormGroup.valid)
      {
      this.generateTitle();
      this.bookingFormGroup.controls['gender'].setValue('Male')
      this.bookingFormGroup.controls['userId'].setValue(0)
      this.eventService.createEvent(this.bookingFormGroup.value).subscribe({
        // //console.log(res.value);
        next:((res:any)=>{
          this.bookingDto.push(res.value);
       
          // window.location.ref();
          Swal.fire("Booking Confirmed")
          this.isSubmit == false;
          this.bookingFormGroup.reset();
          this.resetForm();
          this.router.navigate(['/','booking-schedule'])
        }),
        error:(err)=>{
          Swal.fire(err?.error.message);        
         }
        })
    }
    else
    {
      this.isSubmit = true
    }

    }
   
    

    
  }
  cancelBooking()
  {
    this.modalService.dismissAll();
  }
  saveBooking()
  {
    
      
      this.generateTitle();
             
         
          this.eventService.createEvent(this.bookingFormGroup.value).subscribe({
            // //console.log(res.value);
            next:((res:any)=>{
            
            this.bookingDto.push(res.value);
            this.isSubmit == false;
            this.bookingFormGroup.reset();
            this.resetForm();
            // window.location.reload();
            this.modalService.dismissAll();
            this.router.navigate(['/','guest-home'])
          }),        
        error:(err)=>{
          Swal.fire(err?.error.message);        
         }
        })
  
  }
  resetForm()
  {
    this.bookingFormGroup.controls['id'].setValue(0);
    this.bookingFormGroup.controls['isActive'].setValue(true);
    this.bookingFormGroup.controls['isClosed'].setValue(false);
    

  }
  modifyBooking()
  {
    this.generateTitle();
             
         
    this.eventService.UpdateEvent(this.bookingFormGroup.value).subscribe({
      // //console.log(res.value);
      next:((res:any)=>{
      
      this.bookingDto.push(res.value);
      this.isSubmit == false;
      this.bookingFormGroup.reset();
      this.resetForm();
      // window.location.reload();
      this.modalService.dismissAll();
      this.router.navigate(['/','booking-schedule'])
    }),        
  error:(err)=>{
    Swal.fire(err?.error.message);        
   }
  })

  }
  close()
  {
    this.modalService.dismissAll();
  }
  onGenderChange(e)
  {
    this.bookingFormGroup.controls['gender'].setValue(e.target.value);
  }
  rowSelected(row)
  {
    this.isSelected = true
  }
  ChooseTherapist(e,row)
  {
    this.therapistDto = this.therapistDto.filter(y=>{
      y.checked=false;
      return y
    })
    row.checked = e.target.checked
     this.bookingFormGroup.controls['therapistId'].setValue(e.target.value)
    //  this.therapistDto.filter(x=>{
    //   if(x.id == e.target.value)
    //   {
    //     this.therapist = x.name;
    //   }
    //  })
     
     
  }
  selectTherapist(e,row)
  {
    this.availableTimeDto = this.availableTimeDto.map(x=>{
      x.checked = false;
      return x
    } )
    row.checked = e.target.checked   
    this.therapist = row.name;

    this.bookingFormGroup.controls['therapistId'].setValue(row.id); 

    // console.log(row.availableTime)
    let now3 = new Date(row.availableTime)
    let hours3 = ("0"+ now3.getHours()).slice(-2);
    let minutes3 = ("0"+ now3.getMinutes()).slice(-2);
    let str3 = hours3 + ":" + minutes3;
    
    this.bookingFormGroup.controls['startTime'].setValue(str3)    
    this.setEndTime();

        // this.therapistService.getTherapist().subscribe(res=>{
        //   this.selectedTherapistDto = res.filter(x=>x.id == row.therapistId)          
        //  const shiftId =  this.selectedTherapistDto.filter(x=>x.therapistShifts.find(y=>y.therapistId == x.id))     
          
        //   // console.log(shiftId)
        //   this.shiftService.getShift().subscribe(res=>{
        //     this.selectedShiftDto = res.filter(x=>shiftId.find(y=>y.therapistShifts.find(z=>z.shiftId == x.id)))
            
        //     // console.log(this.selectedShiftDto)
        //     const openTime = formatDate(new Date(this.selectedShiftDto[0].startTime),'hh:mm a','en-us')
        //     const closeTime = formatDate(new Date(this.selectedShiftDto[0].endTime),'hh:mm a','en-us')
        //     this.workingTime = openTime +'-'+closeTime;
        //     const startTime = formatDate(new Date(this.selectedShiftDto[0].startTime),'hh','en-us')
        //     // console.log(startTime)
        //     const currentTime = formatDate(new Date(),'HH','en-us')
        //       // console.log(row.availableTime)
              // this.bookingFormGroup.controls['startTime'].setValue(formatDate(this.scheduleDate,'hh:mm a','en-us'));              
             
              // let timeTo = formatDate(addMinutes(new Date(row.availableTime),row.serviceTime),'hh:mm a','en-us') 
              // this.bookingFormGroup.controls['endTime'].setValue(timeTo)
              // this.availableTime = row.availableTime
        //   })
        // })        
     
   
    
      
      
  }
  changeService(e,row)
  {
    this.serviceId = row.id
    this.serviceDto = this.serviceDto.map(x=>{
      x.ischecked=false;
      return x
    })
    row.ischecked = e.target.checked
    this.serviceId = parseInt(row.id); 
     
      this.bookingFormGroup.controls['serviceId'].setValue(row.name)  
    
    const timeFrom = this.bookingFormGroup.controls['startTime'].value
    const availableTime = formatDate(this.availableTime,'hh:mm a','en-us')
   
      this.serviceDto.filter(res=>{
        if(res.id == e.target.value)
        {
          this.price = res.price
          this.serviceTime = res.serviceTime
          this.setEndTime();   
        
        }
      })
      
      
      // this.availableTimeDto=[];
      // console.log(this.timeDto)
      //   this.eventService.getAvailableTimeList(this.serviceId,new Date(this.scheduleDate)).subscribe(res=>{
      //     this.timeDto = res
      //     this.timeDto.filter(x=>{
      //       this.availableTimeDto.push({
      //         id:x.id,
      //         name:x.name,
      //         availableTime:x.availableTime,
      //         checked:false
      //       })
    
          
        // })
        // this.tempAvailableTimeDto = this.availableTimeDto
        // console.log(this.tempAvailableTimeDto)
        // this.therapistService.getTherapist().subscribe(res=>{
          // this.therapistDto.filter(y=>y.branchId == this.branchId).map(x=>({...x, checked:false})) 
          // console.log(this.therapistDto)
          // this.availableTimeDto = this.tempAvailableTimeDto.filter(x=>this.therapistDto.find(y=>y.id == x.id))
          // console.log(this.availableTimeDto)
        
      
    // })
   
    // }
    // else
    // {
    //   this.serviceDto.filter(res=>{
    //     if(res.id == e.target.value)
    //     {
    //       this.price = res.price
    //       this.timeSlot = res.serviceTime
    //   let timeTo = formatDate(addMinutes(new Date(this.scheduleDate),res.serviceTime),'hh:mm a','en-us') 
    //   console.log('TimeTo',timeTo)
    //   // let now3 = new Date(timeTo);
    //   // let hours3 = ("0"+ now3.getHours()).slice(-2);
    //   // let minutes3 = ("0"+ now3.getMinutes()).slice(-2);
    //   // let str3 = hours3 + ":" + minutes3;
    //   this.bookingFormGroup.controls['endTime'].setValue(timeTo)
    //   this.passValue.setEventHeight(res.serviceTime + 15)
    //     }
    //   })
    // }
    
  
  
     
   
    
   
  }

  openModal(modal){
    this.modalService.open(modal,{size:'xl'})
  }
  
  // ApproveBooking()
  // {
  //   // console.log(id)
    
  //   Swal.fire({
  //     title: "Do you want to Approve?",
  //     showDenyButton: true,
  //     // showCancelButton: true,
  //     confirmButtonText: "Approve",
  //     denyButtonText: `Cancel`
  //   }).then((result) => {
  //     /* Read more about isConfirmed, isDenied below */

  //     if (result.isConfirmed) {
  //       this.getEventsById();
  //       this.bookingFormGroup.controls['isActive'].setValue(true)
  //       this.eventService.UpdateEvent(this.bookingFormGroup.value).subscribe(res=>{
  //         //console.log(res);
  //         this.getEventsById();
  //         this.customerFormGroup.reset();
  //         // this.isActive = true;
  //         this.bookingStatus = 'Approved'
  //         window.location.reload();
  //       })

  //       // Swal.fire("Modified!", "", "success");
  //     } else if (result.isDenied) {
  //       // this.isModify=false;
  //       Swal.fire("Changes are not saved", "", "info");
  //     }
  //   });
       
    
  // }
  submitInvoice()
  {
    this.modalService.open(BookingInvoiceComponent,{
      size:'xl'
      
    })

  }
  onSelectBranch(e,row)
  {
    // this.branchId = e.target.value
  //  this.branchId = parseInt(e.target.value )
    // this.bookingFormGroup.controls['branchId'].setValue(e.target.value)
    
    
      this.therapistDto = this.therapistDto.filter(x=>x.branchId == this.branchId && x.isAvailable == true)
    
  }
  Checked(e,row)
  {
  
  }

  getNamefromToken()
  {
    this.userStore.getFullNameFromStore().subscribe(res=>{
      var fullNameFromToken = this.auth.getFullNamefromToken();
      this.fullName = res || fullNameFromToken 
      
      
    });
    
}
getRolefromToken()
  {
    this.userStore.getRoleFromStore().subscribe(res=>{
      var roleFromToken = this.auth.getRoleFromToken();
      this.role = res || roleFromToken

      
    });
    

 
}

chooseService(e,row)
{
 
}
openCalendar()
{
  this.modalService.open(CalendarComponent,{
    size:'md'
   
  })
}
confirmSelectedService()
{
  this.eventService.getAvailableTimeList(this.serviceId,new Date(this.scheduleDate)).subscribe(res=>{
    this.timeDto = res
    this.availableTimeDto = res.filter(x=>x.branchId == this.branchId)
    console.log(this.branchId)
    console.log(this.timeDto)
    console.log(res)
    
  })
  // this.availableTimeDto=[]                 
      // this.timeDto.filter(x=>{
      //    this.tempTherapistDto.filter(y=>{            
      //    if(y.id == x.id)         
      //      this.availableTimeDto.push(x)         
      //    })
      //    console.log(this.tempTherapistDto)
      //    console.log(this.timeDto)
      //   })


      //   this.timeDto = this.timeDto.filter(x=>x.id == this.tempTherapistDto.map(y=>y.id))

      //   console.log(this.timeDto)

  document.getElementById('exampleModal').click();
}

}

function addMinutes(date,minutes)
{
 return new Date(date.getTime() + minutes*60000)
}

