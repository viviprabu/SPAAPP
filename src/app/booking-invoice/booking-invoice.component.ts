import { PassvalueService } from '../service/passvalue.service';
import { ServicesComponent } from '../services/services.component';
import { CustomerComponent } from '../customer/customer.component';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-booking-invoice',
  templateUrl: './booking-invoice.component.html',
  styleUrls: ['./booking-invoice.component.scss'],
  providers:[DatePipe]
})
export class BookingInvoiceComponent implements OnInit,AfterViewInit {
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
  currentUser: Users;
  
  constructor(private formBuilder:FormBuilder, private transService:TransactionService,
   private branchService: BranchService,private therapistService: TherapistService,private customerService:CustomerService,
   private servicesService:ServicesService, private paymentService: PaymentService,private userStore: UserStoreService,
   private datePipe:DatePipe,private auth:AuthService,private ref: ChangeDetectorRef, private passService: PassvalueService,
   private modalService:NgbModal,private appService: AppService
   )
  {
    this.passService.getInvoice.subscribe(x=>this.invoice == x);
    

    this.transFormGroup = this.formBuilder.group({
id:[0],
branchId:["",Validators.required],
// tdate:[this.now],
invoiceNumber : [""],
therapistId : [0,Validators.required],
roomNumber : ["",Validators.required],
customerId : [0,Validators.required],
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
userId : [0,Validators.required],

    })



  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   this.ref.detectChanges()
  // }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.passService.setformHeader("Booking-Invoice");
    
    this.ref.detectChanges()
    }
    ,0)
    
  }

  ngOnInit() {
    this.loadMasterDatas()
     this.generateInvoice();
  
    this.getBranchID();

    this.brNameDto = JSON.parse(localStorage.getItem(('checked') || '[]'));
    // if(this.brNameDto.length = 0)
    // {
      // this.brNameDto.filter(res=>{
      //   if(res.id == this.brNameDto[0].id)
      //   {
          this.brName = this.brNameDto[0].name;
          this.transFormGroup.controls['branchId'].setValue(this.brNameDto[0].name)
      //   }
      // })
      // console.log(this.brNameDto[0].name)
      // console.log(this.brName)
      // console.log(this.brNameDto)
      this.onValueChange();
    // }
    // else
    // {

    // }
    this.transFormGroup.controls['userId'].setValue(this.username);


}
loadMasterDatas()
{
  this.branchService.getBranch().subscribe(brn=>this.branchDto = brn)
  this.transService.getTransaction().subscribe(res=>this.transactionDto = res)
  this.branchService.getBranch().subscribe(brn=>this.branchDto = brn)
  this.auth.getAllUsers().subscribe(res=>this.userDto = res)
  this.transService.getTransaction().subscribe(res=>this.transDto = res)
  this.customerService.getCustomer().subscribe(cst=>this.customerDto = cst)
  this.therapistService.getTherapist().subscribe(brn=>this.therapistDto = brn)
  this.servicesService.getService().subscribe(srv=>this.serviceDto = srv)
  this.paymentService.getPayment().subscribe(pay=>this.paymentDto = pay)
  this.auth.userDetail$.subscribe(x=>this.currentUser = x)
  // this.auth.GetAllUsers().subscribe(user=>{
  //   this.userDto = user;
  // });
}
onValueChange()
{
const found = this.brNameDto.filter(res=>res.name === this.brName)
// this.brName = found? found[0] : {}
}
getBranchID()
{
  this.transFormGroup.controls['userId'].setValue(this.username);

   
      this.branchId = parseInt(localStorage.getItem('branchId'))
      //console.log(this.branchId)
      this.getBranchIdDto = this.branchDto.filter(br=> br.id == this.branchId)
       
        this.transFormGroup.controls['branchId'].setValue(this.getBranchIdDto[0].name);
        //console.log(br.name)
     

      
    
}
getCustomerStatus()
{
  
  const phoneNumber = this.transFormGroup.value.phone;

  if(this.transactionDto.length > 0)
  {
    this.transactionDto.filter(event=>{
      if(event.phone == phoneNumber)
      {
        this.transFormGroup.controls['customerStatus'].setValue('Regular');
      }
      else{
        this.transFormGroup.controls['customerStatus'].setValue('New');
      }
    })
  }
  else
  {
    this.transFormGroup.controls['customerStatus'].setValue('New');
  }

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
 this.modalService.dismissAll();
}
  getTransList()
  {

   

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
          this.userIdDto = this.userDto.filter(element=>element.username == this.transFormGroup.controls['userId'].value)            
              this.transFormGroup.controls['userId'].setValue(this.userIdDto[0].id)
          this.brDto = this.branchDto.filter(res=>res.name == this.transFormGroup.controls['branchId'].value)
              this.transFormGroup.controls['branchId'].setValue(this.brDto[0].id)
           
          this.transService.createTransaction(this.transFormGroup.value).subscribe((res:any)=>{
            this.transDto.push(res.value[0]);
            this.invoice = this.transFormGroup.controls['invoiceNumber'].value;
            this.passService.setInvoiceNumber(this.invoice);
            this.generateInvoice();
            this.getBranchID();
            // Swal.fire('Saved!', '', 'success')
            this.modalService.open(InvoiceComponent,{
              size:'lg'
            });

          },err=>{
              Swal.fire('Failed!', err.message, 'error')
            });

        } else if (result.isDenied) {
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
    this.transFormGroup.controls['userId'].setValue(trans.userId);

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

// onCheckboxChange(e) {

//   const website: FormArray = this.transFormGroup.get('isApproved') as FormArray;

//   if (e.target.checked == true) {

//     // //console.log(e.target.checked)
//     this.isChecked = e.target.checked;
//     this.countryFormGroup.controls['isActive'].setValue(this.isChecked)
//     //console.log(this.isChecked);

//   } else {

//     // //console.log(e.target.checked)
//     this.isChecked = e.target.checked;
//     this.countryFormGroup.controls['isActive'].setValue(this.isChecked);
//     //console.log(this.isChecked);
//   }
// // }
// resetForm()
//   {
//     this.transFormGroup.controls['id'].setValue(0);
//     this.transFormGroup.reset();
//     // this.transFormGroup.controls['branchId'].setValue(" ");
//     // // // this.transFormGroup.controls['tDate'].setValue("");
//     // this.transFormGroup.controls['invoiceNumber'].setValue(" ");
//     // this.transFormGroup.controls['therapistId'].setValue(" ");
//     // this.transFormGroup.controls['roomNumber'].setValue(" ");
//     // this.transFormGroup.controls['customerId'].setValue(" ");
//     // this.transFormGroup.controls['phone'].setValue(" ");
//     // this.transFormGroup.controls['serviceId'].setValue("");
//     // this.transFormGroup.controls['price'].setValue(0);
//     // this.transFormGroup.controls['vat'].setValue(0);
//     // this.transFormGroup.controls['municipalTax'].setValue(0);
//     // this.transFormGroup.controls['qty'].setValue(0);
//     // this.transFormGroup.controls['totalCost'].setValue(0);
//     // this.transFormGroup.controls['tips'].setValue(0);

//     // this.transFormGroup.controls['paymentId'].setValue(" ")
//     // this.transFormGroup.controls['customerStatus'].setValue(" ");
//     // this.transFormGroup.controls['refund'].setValue(" ");
//     //  this.transFormGroup.controls['userId'].setValue(" ");
//     // this.isSelected = false;

//   }
  Cancel()
  {
    this.isModify=false;
    this.transFormGroup.reset();
  }


  // searchCountry()
  // {
  //   this.formCname = this.searchFormGroup.controls['cname'].value;

  //   // //console.log(this.formCname)
  //   if(this.formCname === "")
  //   {
  //     Swal.fire("Please enter required Country to search?");
  //   }
  //   else
  //   {
  //     this.searchDto = this.countryDto.filter((element)=>{
  //       return element.name.toLowerCase() == this.formCname.toLowerCase();
  //     })
  //     this.countryDto = this.searchDto;

  //     // //console.log(this.countryDto);
  //     this.isSearch = true;
  //   }

  // }
  CancelSearch()
  {
    this.searchFormGroup.reset();
    this.isSearch = false;
    window.location.reload();

  }
  onServiceChange(value:any)
  {
    this.serviceDto.forEach((sname, j) => {

      if(sname.id == value.target.value)
      {
        this.transFormGroup.controls['price'].setValue(sname.price);

        this.vat = (sname.price*5/100)
        this.transFormGroup.controls['vat'].setValue(this.vat);
        this.tax = (sname.price*7/100)
        this.transFormGroup.controls['municipalTax'].setValue(this.tax);
        this.totalCost = sname.price*(this.transFormGroup.controls['qty'].value)
        this.transFormGroup.controls['totalCost'].setValue(this.totalCost);
      }
    });
  }

  onCustomerChange(value:any)
  {
    this.customerDto.forEach((cname, j) => {

      if(cname.id == value.target.value)
      {
        this.transFormGroup.controls['phone'].setValue(cname.phone);

      }
    });


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
  // this.transService.getTransaction().subscribe(res=>{
  //   this.transDto = res;
    
    if(this.transactionDto.length>0)
    {
      this.transactionDto.forEach(row=>{
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

  // })
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

// getNamefromToken()
//   {
//     this.userStore.getFullNameFromStore().subscribe(res=>{
//       var usernameFromToken = this.auth.getFullNamefromToken();
//       this.username = res || usernameFromToken
//       // //console.log(this.fullName)
//     });


// }
// getRolefromToken()
//   {
//     this.userStore.getRoleFromStore().subscribe(res=>{
//       var roleFromToken = this.auth.getRoleFromToken();
//       this.role = res || roleFromToken

//     });
// }
addNew(){
  this.isModify = false;
  this.transFormGroup.reset();
  this.generateInvoice();
  this.transFormGroup.controls['id'].setValue(0);
  this.transFormGroup.controls['userId'].setValue(this.username);
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
