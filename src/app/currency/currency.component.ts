import { Payment } from '../model/payment';
import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../service/payment.service';
import Swal from 'sweetalert2';
import { PassvalueService } from '../service/passvalue.service';
import { Currency } from '../model/currency';
import { CurrencyService } from '../service/currency.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit,AfterViewInit,AfterContentChecked {
  searchTerm:string="";
  CurrencyDto:Currency[]=[];

  CurrencyFormGroup: FormGroup;
  isActiveValue:boolean = false;
  isChecked : boolean = false;
  isModify:boolean = false;
  isCheckedMap:boolean=false;
  isSubmit:boolean = false;
  formHeader:string=""
  currencyPageDto:Currency[]=[];
  page=1;
  pageSize=15;
constructor(private formBuilder:FormBuilder,private currencyService:CurrencyService,private ref: ChangeDetectorRef,
  private passService: PassvalueService)
{
 

  this.CurrencyFormGroup = this.formBuilder.group({
    id:[0],
    name:["",Validators.required],
    conversionRate:[0,Validators.required],
    currencyCode:["",Validators.required],
    // isDeleted:[false]
  });


}
  ngAfterContentChecked(): void {
    this.refreshPages();
  }

ngAfterViewInit(): void {
  setTimeout(()=>{
    this.passService.setformHeader("Currency");
  
  this.ref.detectChanges()
  }
  ,0)
  
}
ngOnInit(): void {
  this.loadMasterDatas();

}
loadMasterDatas()
{
  this.currencyService.getCurrency().subscribe(res=>this.CurrencyDto = res);
}
refreshPages()
{
  this.currencyPageDto = this.CurrencyDto.map((slots, i) => ({ id: i + 1, ...slots })).slice(
    (this.page - 1) * this.pageSize,
    (this.page - 1) * this.pageSize + this.pageSize,
  );
}

  getCurrency()
  {

   
  }

  saveCurrency()
  {
    if(this.CurrencyFormGroup.valid)
    {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {

        if (result.isConfirmed) {
          this.currencyService.createCurrency(this.CurrencyFormGroup.value).subscribe((res:any) => {
            // //console.log(res.value);

            this.CurrencyDto.push(res.value);
            this.CurrencyFormGroup.reset();
            this.resetForm();
            location.reload();
            // Swal.fire('Saved!', '', 'success')
          },err=>{
              // Swal.fire('Failed!', err.message, 'error')
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
    }

  }
  getRecords(pay: Currency)
  {

    this.CurrencyFormGroup.controls['id'].setValue(pay.id);
    this.CurrencyFormGroup.controls['name'].setValue(pay.name);
    this.CurrencyFormGroup.controls['conversionRate'].setValue(pay.conversionRate);
    this.CurrencyFormGroup.controls['currencyCode'].setValue(pay.currencyCode);
    // this.isActiveValue = pay.isApproved;
    // if (this.isActiveValue == true)
    // {
    //   this.isChecked = true;// //console.log(br.isActive)
    // }
    // else    { this.isChecked = false; } this.isModify = true;
    this.isModify = true;
  }
  modifyCurrency()
  {
    Swal.fire({
      title: "Do you want to modify the changes?",
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: "Modify",
      denyButtonText: `Don't Modify`
    }).then((result) => {
      if (result.isConfirmed) {
        this.currencyService.updateCurrency(this.CurrencyFormGroup.value).subscribe(res=>{
          // //console.log(res);
          this.getCurrency();
          this.CurrencyFormGroup.reset();
          this.isModify = false;
          window.location.reload();

        })
        // Swal.fire("Modified!", "", "success");
      } else if (result.isDenied) {
        this.isModify=false;
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }
  resetForm()
  {
    this.CurrencyFormGroup.controls['id'].setValue(0);
    
  }

// deletePayment(pay:Payment)
// {
//   if(pay.isApproved == true)
//   {
//     Swal.fire("This Payment Type already deleted")
//   }
//   else
//   {
//   Swal.fire({
//     title: "Are you sure?",
//     text: "You won't be able to revert this!",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#3085d6",
//     cancelButtonColor: "#d33",
//     confirmButtonText: "Yes, delete it!"
//   }).then((result) => {
//     if (result.isConfirmed) {
//       this.paymentService.deletePayment(pay).subscribe(res=>{
//         //console.log(res)     //this.getEmployee();
//         this.CurrencyDto.splice(this.CurrencyDto.findIndex(x=>x.id == pay.id), 1);
//         this.getPaymentList();
//          })

//       Swal.fire({
//         title: "Deleted!",
//         text: "Your file has been deleted.",
//         icon: "success"
//       });
//     }
//     else if (result.isDenied) {
//       Swal.fire('Changes are not saved', '', 'info')
//     }

//   });
// }
// }

onCheckboxChange(e) {

  const website: FormArray = this.CurrencyFormGroup.get('isApproved') as FormArray;

  if (e.target.checked == true) {

    // //console.log(e.target.checked)
    this.isChecked = e.target.checked;
    this.CurrencyFormGroup.controls['isApproved'].setValue(this.isChecked)
    //console.log(this.isChecked);

  } else {

    // //console.log(e.target.checked)
    this.isChecked = e.target.checked;
    this.CurrencyFormGroup.controls['isApproved'].setValue(this.isChecked);
    //console.log(this.isChecked);
  }
}

  cancel()
  {
    this.isModify=false;
    this.CurrencyFormGroup.reset();
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
  addNew(){
    this.isModify = false;
    this.CurrencyFormGroup.reset();
    this.CurrencyFormGroup.controls['id'].setValue(0);
    
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
}


