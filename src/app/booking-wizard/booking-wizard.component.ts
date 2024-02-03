import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BranchService } from '../service/branch.service';
import { Branch } from '../model/branch';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Services } from '../model/services';
import { ServicesService } from '../service/services.service';
import { PassvalueService } from '../service/passvalue.service';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { TherapistAvailability } from '../model/therapistAvailability';
import { TherapistService } from '../service/therapist.service';
import { ShiftService } from '../service/shift.service';
import { Therapist } from '../model/therapist';
import { Shift } from '../model/shift';
import { EventScheduleService } from '../service/eventschedule.service';
import { EventSchedule } from '../model/eventschedule';
import { GetTherapistShift } from '../model/GetTherapistShift';
import { UserStoreService } from '../service/user-store.service';
import { Role } from '../model/role';
import { Users } from '../model/users';
import { RoleService } from '../service/role.service';
import { AuthService } from '../service/auth.service';
import { Currency } from '../model/currency';
import { CurrencyService } from '../service/currency.service';

@Component({
  selector: 'app-booking-wizard',
  templateUrl: './booking-wizard.component.html',
  styleUrl: './booking-wizard.component.scss'
})
export class BookingWizardComponent implements OnInit,AfterViewInit {
  bookingFormGroup : FormGroup;

  ShowTherapist:boolean = false;
  showSaveButton:boolean = false;
  showBranchSelection:boolean = true;
  showService:boolean = false;
  showFinish:boolean = false;
  showPrevious:boolean = false;

  branchDto: any=[];
  serviceDto:Services[]=[];
  availableTimeDto:TherapistAvailability[]=[];
  selectedTherapist:TherapistAvailability[]=[];
  therapistDto:Therapist[]=[];
  selectedTherapistDto:Therapist[]=[];
  shiftDto:Shift[]=[];
  selectedShiftDto:Shift[]=[]
  timeDto : EventSchedule[]=[];
  therapistShiftDto:GetTherapistShift[]=[];
  selectedBranchDto:Branch[]=[];
  bookingDto : EventSchedule[]=[];
  roleDto:Role[]=[];
  userDto:Users[]=[];
  currencyDto:Currency[]=[];
  

  isActive:boolean = false
  isChecked:boolean = false;
  radiochecked:boolean = false;
  isSubmit:boolean = false;
  isClicked:boolean = true; 
  outOfWorkingTime:boolean = false;
  showAddress:boolean = false;
  isShow:boolean = false;

  role:string="";
  fullName:string="";
  roleName:string="";
  branchName:string="";
  count:number = 0;
  previousCount:number=0;
  scheduleDate:Date = null;
  headerText:string="Branch"; 
  availableTime:Date=null;
  price:number=0;
  timeSlot:number=0;
  workingTime:string="";
  branchId:number=0
  bookingStatus:string="";
  therapistId:number = 0;
  therapistName:string=""
  serviceName:string="";
  currencyId:number=0;
  currencyName:string="";
  companyId:number=0;
  userId:number=0;
constructor(private branchService: BranchService, private formBuild: FormBuilder,private servicesService: ServicesService, private passValue: PassvalueService,
  private therapistService: TherapistService, private shiftService: ShiftService,private eventService: EventScheduleService,private userStore:UserStoreService,
  private roleService:RoleService,private auth:AuthService,private currencyService: CurrencyService, private ref: ChangeDetectorRef)
{
  this.bookingFormGroup = this.formBuild.group({
    id:[0],
    name:['',Validators.required],
    gender:['',Validators.required],
    phone:['',Validators.required],
    eventTitle:[''],
    serviceId:['',Validators.required],
    scheduleDate:['',Validators.required],
    startTime:[''],
    endTime:[''],
    isClosed:[false],
    isActive:[true],
    branchId:['',Validators.required],
    therapistId:['',Validators.required],
    userId:[0]
   
  })
  this.passValue.getScheduleDate.subscribe(x=>this.scheduleDate = x);
}
ngAfterViewInit(): void {
  setTimeout(()=>{
    this.passValue.setformHeader("Booking-Wizard");
    
  this.ref.detectChanges()
  }
  ,0)
  
}
ngOnInit() {
  this.bookingFormGroup.controls['scheduleDate'].setValue(formatDate(this.scheduleDate,'yyyy-MM-dd','en-us'))
  this.bookingFormGroup.controls['startTime'].setValue(formatDate(this.scheduleDate,'hh:mm a','en-us'))
  this.getRolefromToken();
  this.getNamefromToken();
  this.getLoginUser();
  this.getAllBranch();
  this.getAllServices();
  this.getAllTherapist();
  this.getUserDetails();
  
}
getAllBranch()
{
  this.branchService.getBranch().subscribe(res=>{
    this.branchDto = res.map(x=> ({...x, checked:false}))

    
  })
}
getLoginUser()
{
  this.auth.getAllUsers().subscribe(res=>{
    this.userDto = res.filter(x=>x.username == this.fullName)
    this.userId = this.userDto[0].id
    this.bookingFormGroup.controls['userId'].setValue(this.userId)
    console.log(this.userId)
  })
}

getAllServices()
{
  this.servicesService.getService().subscribe(res=>{
    this.serviceDto = res
    
  })

}
getUserDetails()
{
 this.roleService.getRole().subscribe(res=>{
   this.roleDto = res;
   this.roleDto.filter(x=>{
     if(x.id == parseInt(this.role))
     {
       this.roleName = x.name;
     }
   })
   // console.log(this.roleName)

   if(this.roleName == 'Guest')
 {
   this.auth.getAllUsers().subscribe(res=>{
     this.userDto = res;    
 
     this.userDto.filter(x=>{
       if(x.username == this.fullName)
       {     
         this.bookingFormGroup.controls['name'].setValue(x.firstName+' '+x.lastName)
         this.bookingFormGroup.controls['phone'].setValue(x.phone)
          this.bookingFormGroup.controls['gender'].setValue(x.gender)
          
          
       }
       else
       {
       
       }
    
     })
   })
  
 }
 else
 {
   this.showAddress = true;
   
 }
 })
}
getAllTherapist()
{
 
    this.therapistService.getTherapist().subscribe(res=>{
      this.therapistDto = res.filter(x=>x.isAvailable == true && x.branchId == this.branchId)          

    this.eventService.getAvailabilityTime(new Date(this.scheduleDate)).subscribe(res=>{
      this.timeDto = res
     console.log(this.timeDto)

      this.therapistService.getTherapistShift(this.branchId).subscribe(get=>{
        this.therapistShiftDto = get

          this.therapistShiftDto.filter(x=>{
           
            var coeff = 1000 * 60 * 30;         
              // this.availableTimeDto.push({
              //   id:x.id,
              //   name:x.name,
              //   availableTime:x.startTime,
              //   checked:false
              // })
          })
        
          this.timeDto.filter(temp=>{
            const index = this.availableTimeDto.findIndex((main:any)=>main.therapistId == temp.therapistId) 
            if(index != -1)
            {
              this.availableTimeDto[index] = temp;
            }
            else
            {
            }
          });   
          console.log(this.availableTimeDto)
      })
     
      
      })    
    
    })
}
chooseBranch()
{
  this.isClicked = true
  this.showBranchSelection = true
  
}
getBranch(e,row)
{  
  this.branchDto = this.branchDto.map(x=>{
    x.checked=false;
    return x
  })
  row.checked = e.target.checked
  this.branchId = row.id;
  this.companyId = row.companyId
  this.bookingFormGroup.controls['branchId'].setValue(row.id) 
  this.isShow = true
  this.currencyService.getCurrency().subscribe(res=>{
    this.currencyDto = res.filter(x=>x.id == this.companyId)    
    this.currencyName = this.currencyDto[0].name
  })
}
getServices(e)
{
  
  const timeFrom = this.bookingFormGroup.controls['startTime'].value
  const availableTime = formatDate(this.availableTime,'hh:mm a','en-us')
  // console.log(this.availableTime)
  if(availableTime == timeFrom )
  {
    this.serviceDto.filter(res=>{
      if(res.id == e.target.value)
      {
        this.price = res.price
        this.timeSlot = res.serviceTime
        this.serviceName = res.name
 
    let timeTo = formatDate(addMinutes(new Date(availableTime),res.serviceTime),'hh:mm a','en-us') 
    console.log('TimeTo',timeTo)
    this.bookingFormGroup.controls['endTime'].setValue(timeTo)
    this.passValue.setEventHeight(res.serviceTime + 15)
      }
      this.isShow = true
  })
 
  }
  else
  {
    this.serviceDto.filter(res=>{
      if(res.id == e.target.value)
      {
        this.price = res.price
        this.timeSlot = res.serviceTime
    let timeTo = formatDate(addMinutes(new Date(this.scheduleDate),res.serviceTime),'hh:mm a','en-us') 
    console.log('TimeTo',timeTo)
    // let now3 = new Date(timeTo);
    // let hours3 = ("0"+ now3.getHours()).slice(-2);
    // let minutes3 = ("0"+ now3.getMinutes()).slice(-2);
    // let str3 = hours3 + ":" + minutes3;
    this.bookingFormGroup.controls['endTime'].setValue(timeTo)
    this.passValue.setEventHeight(res.serviceTime + 15)
      }
    })
    this.isShow = true
  }
}
chooseService()
{

}
chooseTherapist(e,row)
{

  this.availableTimeDto = this.availableTimeDto.map(x=>{
    x.checked=false;
    return x
  })
  row.checked = e.target.checked
  this.isShow = true;

  this.bookingFormGroup.controls['therapistId'].setValue(row.therapistId);
  Swal.fire({
    title: "Do you want to update Available Time?",
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "Update",
    denyButtonText: `Don't Update`
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {

      this.therapistService.getTherapist().subscribe(res=>{
        this.selectedTherapistDto = res.filter(x=>x.id == row.therapistId)          
       const shiftId =  this.selectedTherapistDto.filter(x=>x.therapistShifts.find(y=>y.therapistId == x.id))     
        
        // console.log(shiftId)
        this.shiftService.getShift().subscribe(res=>{
          this.selectedShiftDto = res.filter(x=>shiftId.find(y=>y.therapistShifts.find(z=>z.shiftId == x.id)))
          
          // console.log(this.selectedShiftDto)
          const openTime = formatDate(new Date(this.selectedShiftDto[0].startTime),'hh:mm a','en-us')
          const closeTime = formatDate(new Date(this.selectedShiftDto[0].endTime),'hh:mm a','en-us')
          this.workingTime = openTime +'-'+closeTime;
          const startTime = formatDate(new Date(this.selectedShiftDto[0].startTime),'hh','en-us')
          // console.log(startTime)
          const currentTime = formatDate(new Date(),'HH','en-us')
            console.log(row.availableTime)
            
            this.bookingFormGroup.controls['startTime'].setValue(formatDate(row.availableTime,'hh:mm a','en-us'));
            let timeTo = formatDate(addMinutes(new Date(row.availableTime),this.timeSlot),'hh:mm a','en-us') 
            this.bookingFormGroup.controls['endTime'].setValue(timeTo)
            this.availableTime = row.availableTime

        
          });
        });
      Swal.fire("Updated!", "", "success");
    } else if (result.isDenied) {

      
      this.bookingFormGroup.controls['startTime'].setValue(formatDate(this.scheduleDate,'hh:mm a','en-us'));

      this.therapistService.getTherapist().subscribe(res=>{
        this.selectedTherapistDto = res.filter(x=>x.id == row.therapistId)          
       const shiftId =  this.selectedTherapistDto.filter(x=>x.therapistShifts.find(y=>y.therapistId == x.id))     
        
        // console.log(shiftId)
        this.shiftService.getShift().subscribe(res=>{
          this.selectedShiftDto = res.filter(x=>shiftId.find(y=>y.therapistShifts.find(z=>z.shiftId == x.id)))
          
          // console.log(this.selectedShiftDto)
          const openTime = formatDate(new Date(this.selectedShiftDto[0].startTime),'hh:mm a','en-us')
          const closeTime = formatDate(new Date(this.selectedShiftDto[0].endTime),'hh:mm a','en-us')
          this.workingTime = openTime +'-'+closeTime;
          const startTime = formatDate(new Date(this.selectedShiftDto[0].startTime),'hh','en-us')
          // console.log(startTime)

          
 
          
      
         
          });
        });
      // Swal.fire("Not Updated!", "", "info");
    }
  });
}
previous()
{
  this.previousCount++;
  
  if(this.previousCount == 1)
  {
    if(this.showFinish == true)
    {
      document.getElementById('therapist').click()
      this.headerText = "Therapist"
      this.showFinish = false;
      this.showService = false
      this.ShowTherapist = true
      this.showBranchSelection = false
      this.isClicked == false;
      this.isShow = true

      
    }   
    else if(this.ShowTherapist == true)
    {
      document.getElementById('service').click()
      this.headerText = "Service"
      this.showFinish = false;
      this.showService = true
      this.ShowTherapist = false
      this.showBranchSelection = false
      this.isClicked == false;
      this.isShow = true
    }
    else if(this.showService == true)
    {
      document.getElementById('branch').click()
      this.headerText = "Branch"
      this.showFinish = false;
      this.showService = false
      this.ShowTherapist = false
      this.showBranchSelection = true
      this.isClicked == false;
      this.isShow = true
    }
  }
  else if(this.previousCount == 2)
  {
    if(this.ShowTherapist == true)
    {
      document.getElementById('service').click()
      this.headerText = "Service"
      this.showFinish = false;
      this.showService = true
      this.ShowTherapist = false
      this.showBranchSelection = false
      this.isClicked == false;
      this.isShow = true
      
    }
    else if(this.showService == true)
    {
      document.getElementById('branch').click()
      this.headerText = "Branch"
      this.showFinish = false;
      this.showService = false
      this.ShowTherapist = false
      this.showBranchSelection = true
      this.isClicked == false;
      this.isShow = true
    }
  }
  else{
    document.getElementById('branch').click()
      this.headerText = "Branch"
      this.showFinish = false;
      this.showService = false
      this.ShowTherapist = false
      this.showBranchSelection = true
      this.isClicked == false;
      
  }
  
    
    
  
    
 
}
next()
{
  this.count++
  
  if(this.count == 1)
  {
             
        document.getElementById('service').click()
        this.headerText = "Service"
        this.showService = true
        this.isClicked == false;
        this.showBranchSelection = false;  
        this.isShow = false;
        this.showPrevious = true;
  }
  else if(this.count == 2)
  {
   
    document.getElementById('therapist').click()
    this.getAllTherapist();
    this.headerText = "Therapist"
    this.ShowTherapist = true;
    this.showService = false
    this.showBranchSelection = false;
    this.isClicked == false;
    this.isShow = false;
    
  }
  else
  {
    
      this.headerText = "Booking"
      this.ShowTherapist = false;
    this.showSaveButton = true;
    this.showFinish = true;
    this.isClicked == false;
    document.getElementById('finish').click()
    this.showBranchSelection = false;
    this.branchService.getBranch().subscribe(res=>{
      this.selectedBranchDto = res.filter(x=> x.id == this.branchId)
      this.branchName = this.selectedBranchDto[0].name
    })
    this.therapistId = this.bookingFormGroup.controls['therapistId'].value
    this.selectedTherapist = this.availableTimeDto.filter(x=>x.id == this.therapistId)
    
  }
 

  
}
generateTitle()
{
 
  
  let startTime = this.bookingFormGroup.controls['startTime'].value
  
  // console.log(startTime)

  
  let endTime = this.bookingFormGroup.controls['endTime'].value
  console.log(endTime)
  const therapistId = this.bookingFormGroup.controls['therapistId'].value
  this.therapistService.getTherapist().subscribe(res=>{
    this.therapistDto = res
    this.therapistDto.filter(x=>{
      if(x.id == therapistId)
      {
        this.therapistName = x.name
     
      }
      this.bookingFormGroup.controls['eventTitle'].setValue(this.therapistName +"-"+ startTime +"-"+ endTime)
    })
  
  });        
 
}
saveBooking()
{
 

  if(this.bookingFormGroup.valid)
  {
    
    this.generateTitle();

    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      
      if (result.isConfirmed) {          
       
        this.eventService.createEvent(this.bookingFormGroup.value).subscribe((res:any) => {
          // //console.log(res.value);

          this.bookingDto.push(res.value);
          this.isSubmit == false;
          this.bookingFormGroup.reset();
          this.resetForm();
          window.location.reload();
          
        },err=>{
            Swal.fire('Failed!', err.message, 'error')
          });

      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    }
    )
  }
  else
  {

    this.isSubmit = true;
    // this.validateAllFormFields(this.branchFormGroup)
  }
}
resetForm()
{
  this.bookingFormGroup.controls['id'].setValue(0)
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

  
   
  });
}

}
function addMinutes(date,minutes)
{
 return new Date(date.getTime() + minutes*60000)
}