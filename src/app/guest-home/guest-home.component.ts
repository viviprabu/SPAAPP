import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ServicesService } from '../service/services.service';
import { Services } from '../model/services';
import { PassvalueService } from '../service/passvalue.service';
import { ComponentFactory } from '@fullcalendar/core/preact';
import { CompanyService } from '../service/company.service';
import { Company } from '../model/company';
import { AppService } from '../app.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ShowbranchComponent } from '../showbranch/showbranch.component';

@Component({
  selector: 'app-guest-home',
  templateUrl: './guest-home.component.html',
  styleUrl: './guest-home.component.scss'
})
export class GuestHomeComponent implements OnInit,AfterViewInit {
  serviceDto : Services[]=[];
  formHeader: string="";
  companyDto:Company[]=[];
  currencyCode:string="";
  radiochecked:boolean = false;
  checked:boolean = false;
  serviceId:number=0;
  price:number=0;
  showBookingBtn:boolean = false;
  serviceTime:number = 0;
  serviceName: any;
  showHome:boolean = false;
  scheduleDate : Date=new Date()
constructor(private servicesService: ServicesService, private passValue: PassvalueService, private companyService: CompanyService, private appService: AppService,
  private ref: ChangeDetectorRef, private modalService: NgbModal, private router:Router)
{
  this.passValue.getformHeader.subscribe(x=>this.formHeader = x)
  this.appService.getServiceId.subscribe(x=>this.serviceId = x)
  this.appService.getPrice.subscribe(x=>this.price = x)
  this.appService.getCurrencyCode.subscribe(x=>this.currencyCode = x)
  this.appService.getServiceTime.subscribe(x=>this.serviceTime = x)
  this.appService.getShowHome.subscribe(x=>this.showHome = x)
  this.appService.getScheduleDate.subscribe(x=>this.scheduleDate = x)
 
}
// ngOnChanges(changes: SimpleChanges): void {
//   this.ref.detectChanges()
// }
ngAfterViewInit(): void {
  setTimeout(()=>{
    this.passValue.setformHeader('Home');
  this.ref.detectChanges()
  }
  ,0)
  
}

  ngOnInit() {
    
    this.getAllServices();
    this.getCurrencyCode();
  }
  getAllServices()
  {
    this.servicesService.getService().subscribe(res=>{
      this.serviceDto = res.map(x=>({...x, checked:false}))
    })
  }
  getCurrencyCode()
  {
    this.companyService.getCompany().subscribe(res=>{
      this.companyDto = res
      this.currencyCode = this.companyDto[0].currencyCode
    })
  }
chooseService(e,row)
{
  this.serviceDto = this.serviceDto.map(x=>{
    x.checked=false;
    return x
  })
  row.checked = e.target.checked
  this.getCurrencyCode();

  this.serviceId = row.id
  this.serviceName = row.name
  this.serviceTime = row.serviceTime
  this.price = row.price
  this.currencyCode = this.currencyCode
  
  this.showBookingBtn = true
}
showBooking()
{
  this.showHome = true
  this.appService.setShowHome(this.showHome)
  this.appService.setServiceId(this.serviceId)
  this.appService.setPrice(this.price)
  this.appService.setCurrencyCode(this.currencyCode)
  this.appService.setServiceTime(this.serviceTime)
  this.appService.setServiceName(this.serviceName)
  
  
  // this.modalService.open(ShowbranchComponent,{
  //   size:'xl'
  // })
  this.modalService.dismissAll();
  this.router.navigate(['/', 'events']);
  
  
}

}
