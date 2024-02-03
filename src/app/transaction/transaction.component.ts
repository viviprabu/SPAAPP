import { PassvalueService } from './../service/passvalue.service';
import { ServicesComponent } from './../services/services.component';
import { CustomerComponent } from './../customer/customer.component';
import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Transaction } from '../model/transaction';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl, AbstractControl, NgModel } from '@angular/forms';
import { TransactionService } from '../service/transaction.service';
import Swal from 'sweetalert2';
import { BranchService } from '../service/branch.service';
import { Branch, BranchList } from '../model/branch';
import { TherapistService } from '../service/therapist.service';
import { Therapist } from '../model/therapist';
import { CustomerService } from '../service/customer.service';
import { Customer } from '../model/customer';
import { Services } from '../model/services';
import { ServicesService } from '../service/services.service';
import { Payment } from '../model/payment';
import { PaymentService } from '../service/payment.service';
import { timestamp } from 'rxjs';
import { DatePipe } from '@angular/common';
import {formatDate} from '@angular/common';
import { Users } from '../model/users';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../service/auth.service';
import { InvoiceComponent } from '../invoice/invoice.component';
import { UserStoreService } from '../service/user-store.service';
import { AppService } from '../app.service';
import { BranchName } from '../model/branchname';
import { RoleService } from '../service/role.service';
import { Role } from '../model/role';
import { UserbranchService } from '../service/userbranch.service';
import { EventScheduleService } from '../service/eventschedule.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  providers:[DatePipe]
})
export class TransactionComponent implements OnInit,AfterViewInit,AfterContentChecked {
  isModalShow:boolean;
  brDto : Branch[]=[];
  brId:number;
  getBranchIdDto:Branch[]=[];
  branchName:string = "";
  username:string = "";
  role:string = "";
  newItem:string = "";
  invno:string = "";
  isSelected:boolean = true;
  vat:number = 0;
  tax:number = 0;
  totalCost:number = 0;
  invoiceNumber:string = "";
  userDto : Users[]=[];
  invoiceDto:Transaction[]=[];
  therapistDto:Therapist[]=[];
  paymentDto : Payment[]=[];
  customerDto : Customer[]=[];
  serviceDto : Services[]=[];
  branchDto:Branch[]=[];
  isSearch:boolean = false;
  searchDto:Services[]=[];
  formCname: string = "";
  ctryName:any;
  transDto:Transaction[]=[];
  transFormGroup: FormGroup;
  searchFormGroup:FormGroup;
  isActiveValue:boolean = false;
  isChecked : boolean = false;
  isModify:boolean = false;
  now:Date;
  invoice:string="";
  formSubmitted : boolean = false;
  userIdDto:Users[]=[];
  checkState: boolean;
  options: any;
  branchid: any;
  branchId:number=0;
  useridentity: number=0;
  displayHeader: string;
  localBranchId : any;
  uId: number;
  brName:string="";
  brNameDto:BranchList[]=[];
  formHeader:string="";
  transactionDto : Transaction[]=[];
  searchTerm:string="";
  isCheckedMap:boolean = false;
  roleName:string=""
  roleDto:Role[]=[]
  userId:number=0;  
  transPageDto:Transaction[]=[];
  page=1;
  pageSize=15;
  userBranchDto: import("d:/Applications/SpaApp/src/app/model/userbranch").UserBranch[];
  custStatusDto: Transaction[];
  roleId: number;
  customerName: string;
  loginUserDto: Users[];
  phone:string="";
  bookingId:number=0;
  isHide:boolean = false;
  eventId : number = 0;
  currentUser: Users;
  tDto: Therapist[];
  constructor(private formBuilder:FormBuilder, private transService:TransactionService,
   private branchService: BranchService,private therapistService: TherapistService,private customerService:CustomerService,
   private servicesService:ServicesService, private paymentService: PaymentService,private userStore: UserStoreService,
   private datePipe:DatePipe,private auth:AuthService,private passService:PassvalueService,private roleService: RoleService,
   private modalService:NgbModal,private appService: AppService,private ref: ChangeDetectorRef,private userBranchservice: UserbranchService,
   private eventService:EventScheduleService
   )
  {
    this.passService.getInvoice.subscribe(x=>this.invoice == x);
    this.passService.getEventId.subscribe(x=>this.bookingId = x)
    this.passService.getEventId.subscribe(x=>this.eventId = x)
   


    this.transFormGroup = this.formBuilder.group({
id:[0],
branchId:["",Validators.required],
// tdate:[this.now],
invoiceNumber : [""],
therapistId : [0,Validators.required],
roomNumber : ["",Validators.required],
receptionistId : [0,Validators.required],
phone :["",Validators.required],
serviceId :[0,Validators.required],
price :[0],
vat : [0],
municipalTax : [0],
qty : [0,Validators.required],
totalCost : [0],
tips : [0],
paymentId : [0],
customerStatus : ["",Validators.required],
refund : [0],
userId : [0],
bookingId:[0]

    }),
    this.searchFormGroup = this.formBuilder.group({
      search:[""]
    })



  }
  ngAfterContentChecked(): void {
    this.refreshPages();
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.passService.setformHeader('Transactions');
    this.ref.detectChanges()
    }
    ,0)
    
  }

  ngOnInit() {
  
    this.appService.getIsHide.subscribe(x=>this.isHide = x)
    this.loadMasterDatas();    
    this.generateInvoice();
    if(this.eventId != 0)
    {
      this.getEventsDetails();
    }
   
    
    


}
loadMasterDatas()
{ 
   this.auth.userDetail$.subscribe(x=>this.currentUser = x)
  this.username = this.currentUser.username
  this.therapistService.getTherapist().subscribe(x=>this.therapistDto = x)
  // this.branchService.getBranch().subscribe(x=>this.branchDto = x)
  this.branchService.getBranchByUsername(this.username).subscribe(x=>this.branchDto = x)
  this.transService.getTransaction().subscribe(res=>this.transDto = res)
  this.servicesService.getService().subscribe(srv=>this.serviceDto = srv)
  this.paymentService.getPayment().subscribe(pay=>this.paymentDto = pay)
  

}
getEventsDetails()
{
  this.eventService.getEventByEventsId(this.eventId).subscribe(x=>{
    this.transFormGroup.controls['phone'].setValue(x.phone)
   
    this.phone = x.phone
       
      this.transService.getUserByPhone(this.phone.toString()).subscribe(res=>{
        this.custStatusDto = res;
        
        if(this.custStatusDto.length !=0)
        {
          this.transFormGroup.controls['customerStatus'].setValue('Regular');
        }
        else
        {
          this.transFormGroup.controls['customerStatus'].setValue('New');
        }
      })

    this.transFormGroup.controls['serviceId'].setValue(x.serviceId)
    const sDto = this.serviceDto.filter(y=>y.id == x.serviceId)      
        this.transFormGroup.controls['price'].setValue(sDto[0].price);

        this.vat = (sDto[0].price*5/100)
        this.transFormGroup.controls['vat'].setValue(this.vat);
        this.tax = (sDto[0].price*7/100)
        this.transFormGroup.controls['municipalTax'].setValue(this.tax);
        this.totalCost = sDto[0].price*(this.transFormGroup.controls['qty'].value)
        this.transFormGroup.controls['totalCost'].setValue(this.totalCost);
      
    
    this.transFormGroup.controls['branchId'].setValue(x.branchId)
    
    
      const tpDto = this.therapistDto.filter(x=>x.branchId == x.branchId);
      this.therapistDto = tpDto;
      // //console.log(brn);
      
      this.transFormGroup.controls['therapistId'].setValue(x.therapistId)
    });
   
    
  
}
onValueChange()
{
const found = this.brNameDto.filter(res=>res.name === this.brName)
// this.brName = found? found[0] : {}
}
refreshPages()
  {
    this.transPageDto = this.transDto.map((slots, i) => ({ id: i + 1, ...slots })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
  }



showInvoice(inv:string)
{
  this.invoice = inv

   this.passService.setInvoiceNumber(this.invoice)


  this.modalService.open(InvoiceComponent,{
    size:'lg'
  });



}
close()
{
 document.getElementById('closeModal').click();
}



  showTherapist(e)
  {
    this.transFormGroup.controls['branchId'].setValue(e.target.value);
   
    this.tDto = this.therapistDto.filter(x=>x.branchId == e.target.value)
    this.therapistDto = this.tDto;
  }

  saveTransaction()
  {
    if (this.transFormGroup.valid)
    {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {

        if (result.isConfirmed) {

          
            // if(this.bookingId !=0)
            // {
            //   this.therapistService.getTherapist().subscribe(brn=>{
            //     this.therapistDto = brn.filter(x=>x.branchId == x.branchId);
            //     // //console.log(brn);
            //     this.therapistDto.filter(y=>y.name == this.transFormGroup.controls['therapistId'].value)
            //     this.transFormGroup.controls['therapistId'].setValue(this.therapistDto[0].id)
            //   });
            // }
            // else
            // {
              let phone = this.transFormGroup.get('phone').value
              this.userDto.filter(x=>x.phone == phone)
              this.transFormGroup.controls['userId'].setValue(this.userDto[0].id);          
                this.transFormGroup.controls['receptionistId'].setValue(this.userId);
                this.transFormGroup.controls['bookingId'].setValue(this.bookingId);
                

                this.transService.createTransaction(this.transFormGroup.value).subscribe((res:any)=>{
                  this.transDto.push(res.value[0]);
                  this.invoice = this.transFormGroup.controls['invoiceNumber'].value;
                  this.passService.setInvoiceNumber(this.invoice);
                  this.generateInvoice();
                  
                  // Swal.fire('Saved!', '', 'success')
                  this.modalService.open(InvoiceComponent,{
                    size:'lg'
                  });
      
                },err=>{
                    Swal.fire('Failed!', err.message, 'error')
                  });
            // }
        } 
        else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }

      })
    }
    else
    {
      // Swal.fire('Failed!', 'Please Enter required Fields')
      this.validateAllFormFields(this.transFormGroup)
    }


  }
  private validateAllFormFields(formGrop:FormGroup){
    Object.keys(formGrop.controls).forEach(element => {
      const control = formGrop.get(element);
      if(control instanceof FormControl){
        control.markAsDirty({onlySelf:true});
      }
      else if(control instanceof FormGroup)
      {
        this.validateAllFormFields(control)
      }
    });

  }
  getRecords(trans: Transaction)
  {
    this.transFormGroup.controls['id'].setValue(trans.id);
    this.transFormGroup.controls['branchId'].setValue(trans.branchId);
    this.transFormGroup.controls['userId'].setValue(trans.userId);
    this.transFormGroup.controls['invoiceNumber'].setValue(trans.invoiceNumber);
    this.transFormGroup.controls['therapistId'].setValue(trans.therapistId);
    this.transFormGroup.controls['roomNumber'].setValue(trans.roomNumber);
    this.transFormGroup.controls['phone'].setValue(trans.phone);
    this.transFormGroup.controls['serviceId'].setValue(trans.serviceId);
    this.transFormGroup.controls['price'].setValue(trans.price);
    this.transFormGroup.controls['vat'].setValue(trans.vat);
    this.transFormGroup.controls['municipalTax'].setValue(trans.municipalTax);
    this.transFormGroup.controls['qty'].setValue(trans.qty);
    this.transFormGroup.controls['totalCost'].setValue(trans.totalCost);
    this.transFormGroup.controls['tips'].setValue(trans.tips);
    this.transFormGroup.controls['paymentId'].setValue(trans.paymentId);
    this.transFormGroup.controls['customerStatus'].setValue(trans.customerStatus);
    this.transFormGroup.controls['refund'].setValue(trans.refund);
    this.transFormGroup.controls['receptionistId'].setValue(trans.receptionistId);

    this.isModify = true;
  }
  modifyTransaction()
  {
    Swal.fire({
      title: "Do you want to modify the changes?",
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: "Modify",
      denyButtonText: `Don't Modify`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */

      if (result.isConfirmed) {
        this.transService.updateTransaction(this.transFormGroup.value).subscribe((res:any)=>{
          // //console.log(res);
          // this.transDto = res.value[0];
          this.transFormGroup.reset();
          this.isModify = false;
          location.reload();
        })
        // Swal.fire("Modified!", "", "success");
      } else if (result.isDenied) {
        this.isModify=false;
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }


deleteCountry(trans:Transaction)
{
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {


    if (result.isConfirmed) {
      this.transService.deleteTransaction(trans).subscribe(res=>{
        // //console.log(res)
        //this.getEmployee();
        this.transDto.splice(this.transDto.findIndex(x=>x.id == trans.id), 1);        
        this.transFormGroup.reset();
        location.reload();
    })

      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
    }
    else if (result.isDenied) {
      Swal.fire('Changes are not saved', '', 'info')
    }
  });
}


  Cancel()
  {
    this.isModify=false;
    this.transFormGroup.reset();
  }


 
  CancelSearch()
  {
    this.searchFormGroup.reset();
    this.isSearch = false;
    location.reload()

  }
  onServiceChange(value:any)
  {
    const sDto = this.serviceDto.filter(sname=>sname.id == value.target.value)
      {
        this.transFormGroup.controls['price'].setValue(sDto[0].price);

        this.vat = (sDto[0].price*5/100)
        this.transFormGroup.controls['vat'].setValue(this.vat);
        this.tax = (sDto[0].price*7/100)
        this.transFormGroup.controls['municipalTax'].setValue(this.tax);
        this.totalCost = sDto[0].price*(this.transFormGroup.controls['qty'].value)
        this.transFormGroup.controls['totalCost'].setValue(this.totalCost);
      }
    

    // this.phone = this.transFormGroup.controls['phone'].value
   
      
  }

  onCustomerChange(e)
  {
   this.auth.checkExistingUser(e.target.value).subscribe(res=>{
    this.userDto = res
    this.customerName = this.userDto[0].firstName
    this.transFormGroup.controls['userId'].setValue(this.userDto[0].firstName);
  
      if(this.userDto.length !=0)
      {
        this.transFormGroup.controls['customerStatus'].setValue('Regular');
      }
      else
      {
        this.transFormGroup.controls['customerStatus'].setValue('New');
      }
    })

  }

  onChangeQty(event:any)
  {
    this.totalCost = (this.transFormGroup.controls['price'].value)*event.target.value;
    this.transFormGroup.controls['totalCost'].setValue(this.totalCost);

  }
generateInvoice()
{
  this.transFormGroup.reset();
  this.transFormGroup.controls['id'].setValue(0);
  this.transFormGroup.controls['qty'].setValue(1);
  this.transFormGroup.controls['refund'].setValue(0);
  this.transFormGroup.controls['tips'].setValue(0);
  let inv:number;

  let increment:number = 1;
  const separator = '-'
  
    if(this.transDto.length>0)
    {
      this.transDto.forEach(row=>{
          this.invoiceNumber=this.transDto.slice(-1)[0].invoiceNumber
      });
      this.invno = this.invoiceNumber.substring(this.invoiceNumber.indexOf(separator)+1)
      inv = parseInt(this.invno)+1;
    this.transFormGroup.controls['invoiceNumber'].setValue('INV_PER_'+formatDate(new Date(), 'yyyy', 'en')+'-'+inv);
       }
    else
    {
      inv = 1;
              this.transFormGroup.controls['invoiceNumber'].setValue('INV_PER_'+formatDate(new Date(), 'yyyy', 'en')+'-'+inv);

    }

  
}

pageReload()
{
 this.branchid = this.transFormGroup.controls['branchId'].value
  location.reload();
  this.transFormGroup.controls['branchId'].setValue(this.branchid);
}
openCustomer()
{
  this.displayHeader = 'true';
  this.passService.setdisplayHeader(this.displayHeader)
  this.modalService.open(CustomerComponent,{
    size:'lg'

  })
}
OpenService()
{
  this.modalService.open(ServicesComponent,{
    size:'lg'
  });
}


addNew(){
  this.isModify = false;
  this.transFormGroup.reset();
  this.generateInvoice();
  this.transFormGroup.controls['id'].setValue(0);
  this.transFormGroup.controls['receptionistId'].setValue(this.username);
  this.transFormGroup.controls['qty'].setValue(1);
  this.transFormGroup.controls['refund'].setValue(0);
  
}
deleteRows()
{
  window.location.reload();
}
check(e)
  {
    if(e.target.checked)
    {
      this.isCheckedMap = true;
    }
    else
    {
      this.isCheckedMap = false;
    }
    // this.isCheckedMap = !this.isCheckedMap
  }

}
