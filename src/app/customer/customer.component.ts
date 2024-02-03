import { NavigationEnd, Router } from '@angular/router';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Customer } from '../model/customer';
import { FormArray, FormBuilder, FormControl, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { CustomerService } from '../service/customer.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Transaction } from '../model/transaction';
import { PassvalueService } from '../service/passvalue.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit,AfterViewInit {
  findDuplicateDto:Customer[]=[];
  displayHeader:string = "false";
  searchTerm:string="";
  someSubscription: any="";
  formCustomer:string="";
  formPhone:string="";
  //isSearch : boolean= false;
  searchDto : Customer[]=[];
  customerDto:Customer[]=[];
  customerFormGroup: FormGroup;
  searchFormGroup: FormGroup;
  isActiveValue:boolean = false;
  isChecked : boolean = false;
  isModify:boolean = false;
  isCheckedMap:boolean=false;
  isSubmit: boolean = false

  constructor(private formBuilder: FormBuilder, private customerService:CustomerService,
    private modalService:NgbModal, private router:Router, private passService: PassvalueService,private ref: ChangeDetectorRef)
  {
    // this.passService.setdisplayHeader('true')
    // //console.log(this.displayHeader)



    this.customerFormGroup = this.formBuilder.group({

      id:[0],
      name:["", Validators.required],
      gender:["", Validators.required],
      address:[""],
      phone:["",Validators.required],
      city:[""],
      // isDeleted:[false]


    });
    this.searchFormGroup = this.formBuilder.group({
      id:[0],
      cname:["", Validators.required],
      gender:["", Validators.required],
      caddress:[""],
      cphone:[""],
      city:[""],
      // isDeleted:[false]


    })

  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.passService.setformHeader("Currency");
    
    this.ref.detectChanges()
    }
    ,0)
    
  }
  ngOnInit(){
    this.loadMasterDatas()
    
    

  }
  loadMasterDatas()
  {
    this.customerService.getCustomer().subscribe(res=>{this.customerDto = res; this.searchDto = res;});
  }
  getCustomerList()
  {

   
  }

  saveCustomer()
  {
    this.isSubmit = true;
    if(this.customerFormGroup.valid)
    {
          Swal.fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
          }).then((result) => {

            if (result.isConfirmed) {
              this.customerService.createCustomer(this.customerFormGroup.value).subscribe((res:any) => {
                // //console.log(res.value);

                this.customerDto.push(res.value);
                this.customerFormGroup.reset();
                this.resetForm();
                location.reload();

                this.isSubmit =false;
              },err=>{
                  Swal.fire('Failed!', err.error, 'error')
                });

            } else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
            }
          }
          )
      }
    else
    {
      // this.validateAllFormFields(this.customerFormGroup)
    }

  }
  getRecords(cust: Customer)
  {
    if(cust.isDeleted == true)
    {
      Swal.fire("This client already deleted. Unable to modify!")
    }
    else
    {
    this.customerFormGroup.controls['id'].setValue(cust.id);
    this.customerFormGroup.controls['name'].setValue(cust.name);
    this.customerFormGroup.controls['address'].setValue(cust.address);
    this.customerFormGroup.controls['phone'].setValue(cust.phone);
    this.customerFormGroup.controls['city'].setValue(cust.city);
    // this.customerFormGroup.controls['isDeleted'].setValue(cust.isDeleted);
    // this.isActiveValue = cust.isActive;
    // if (this.isActiveValue == true)
    // {
    //   this.isChecked = true;// //console.log(br.isActive)
    // }
    // else    { this.isChecked = false; }
    this.isModify = true;
    }
  }
  modifyCustomer()
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
        this.customerService.updateCustomer(this.customerFormGroup.value).subscribe(res=>{
          //console.log(res);
          this.getCustomerList();
          this.customerFormGroup.reset();
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


deleteCustomer(cust:Customer)
{
  if(cust.isDeleted == true)
  {
    Swal.fire("This client already deleted")
  }
  else
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
      this.customerService.deleteCustomer(cust).subscribe(res=>{
        //console.log(res)
        //this.getEmployee();

        this.customerDto.splice(this.customerDto.findIndex(x=>x.id == cust.id), 1);
        location.reload();

    })

      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });

    }
    else if (result.isDenied)
    {

        Swal.fire('Changes are not saved', '', 'info')

    }
  });
}
}
resetForm()
  {
    this.customerFormGroup.controls['id'].setValue(0);
    // this.customerFormGroup.controls['isActive'].setValue(true);
  }
  cancel()
  {
    this.isModify = false;
    this.customerFormGroup.reset();
  }
  addNew(){
    this.isModify = false;
    this.customerFormGroup.reset();
    this.customerFormGroup.controls['id'].setValue(0);
    
  }
  deleteRows()
  {
    window.location.reload();
  }
  close()
  {
    document.getElementById('closeModal').click();
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
//   searchCustomer()
//   {
//     this.formCustomer = this.searchFormGroup.controls['cname'].value;
//     this.formPhone = this.searchFormGroup.controls['cphone'].value;


//     if(this.formCustomer === '' && this.formPhone == '')
//     {
//       Swal.fire("Please enter Required Field to search?");
//     }
//     else if(this.formCustomer === '')
//     {
//       this.searchDto = this.customerDto.filter((element)=>{
//         return element.phone === this.formPhone})
//       //this.isSearch = true;
//     }
//     else if(this.formPhone == '')
//     {
//       this.searchDto = this.customerDto.filter((element)=>
//       {return element.name.toLowerCase()=== this.formCustomer.toLowerCase()})
//       //this.isSearch = true;
//     }
//     else
//     {
//       this.searchDto = this.customerDto.filter((element)=>{
//         return element.name.toLowerCase() === this.formCustomer.toLowerCase()&&
//                element.phone == this.formPhone })
//       //this.isSearch = true;
//     }
//   }
//   onNameChange(e)
//   {

//     this.searchDto = this.customerDto.filter((element)=>
//       {return element.name.toLowerCase().includes(e.target.value.toLowerCase())})
//       //this.isSearch = true;

//       // this.searchDto = this.customerDto.filter(x=>x.name.includes(e.target.value.toLowerCase()))


//   }
//   onPhoneChange(e)
//   {
//      this.searchDto = this.customerDto.filter((element)=>
//       {return element.phone.toLowerCase().includes(e.target.value.toLowerCase())})
//       //this.isSearch = true;
//   }
//   cancelSearch()
//   {
//     this.searchFormGroup.reset();
// //this.isSearch = false;
// //this.getCustomerList();
// this.searchDto = this.customerDto;
//   }
  Close()
  {
    this.modalService.dismissAll();
}
onGenderChange(e)
{
  if(e.target.checked)
  {
    this.customerFormGroup.controls['gender'].setValue(e.target.value)
    
  }
  else
  {
    
  }
}
// private validateAllFormFields(formGrop:FormGroup){
//   Object.keys(formGrop.controls).forEach(element => {
//     const control = formGrop.get(element);
//     if(control instanceof FormControl){
//       control.markAsDirty({onlySelf:true});
//     }
//     else if(control instanceof FormGroup)
//     {
//       this.validateAllFormFields(control)
//     }
//   });

// }
}

