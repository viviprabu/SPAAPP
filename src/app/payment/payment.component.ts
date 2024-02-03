import { Payment } from './../model/payment';
import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../service/payment.service';
import Swal from 'sweetalert2';
import { PassvalueService } from '../service/passvalue.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit,AfterViewInit,AfterContentChecked {
  searchTerm:string="";
  PaymentDto:Payment[]=[];

  PaymentFormGroup: FormGroup;
  isActiveValue:boolean = false;
  isChecked : boolean = false;
  isModify:boolean = false;
  isCheckedMap:boolean=false;
  paymentPageDto:Payment[]=[];
  page=1;
  pageSize=15;
constructor(private formBuilder:FormBuilder,private paymentService:PaymentService,
  private passService: PassvalueService,private ref: ChangeDetectorRef)
{
  this.PaymentFormGroup = this.formBuilder.group({
    id:[0],
    name:["",Validators.required],
    isApproved:[true],
    // isDeleted:[false]
  });


}
  ngAfterContentChecked(): void {
    this.refreshPages();
  }
// ngOnChanges(changes: SimpleChanges): void {
//   this.ref.detectChanges()
// }
ngAfterViewInit(): void {
  setTimeout(()=>{
    this.passService.setformHeader('Payment');
  this.ref.detectChanges()
  }
  ,0)
  
}
ngOnInit(): void {
this.loadMasterDatas();


}
loadMasterDatas()
{
  this.paymentService.getPayment().subscribe(res=>this.PaymentDto = res);
}
refreshPages()
{
  this.paymentPageDto = this.PaymentDto.map((slots, i) => ({ id: i + 1, ...slots })).slice(
    (this.page - 1) * this.pageSize,
    (this.page - 1) * this.pageSize + this.pageSize,
  );
}


  savePayment()
  {
    if(this.PaymentFormGroup.valid)
    {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {

        if (result.isConfirmed) {
          this.paymentService.createPayment(this.PaymentFormGroup.value).subscribe((res:any) => {
            // //console.log(res.value);

            this.PaymentDto.push(res.value);
            this.PaymentFormGroup.reset();
            this.resetForm();
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
      this.validateAllFormFields(this.PaymentFormGroup)
    }

  }
  getRecords(pay: Payment)
  {

    this.PaymentFormGroup.controls['id'].setValue(pay.id);
    this.PaymentFormGroup.controls['name'].setValue(pay.name);
    this.PaymentFormGroup.controls['isApproved'].setValue(pay.isApproved);
    this.isActiveValue = pay.isApproved;
    if (this.isActiveValue == true)
    {
      this.isChecked = true;// //console.log(br.isActive)
    }
    else    { this.isChecked = false; } this.isModify = true;

  }
  modifyPayment()
  {
    Swal.fire({
      title: "Do you want to modify the changes?",
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: "Modify",
      denyButtonText: `Don't Modify`
    }).then((result) => {
      if (result.isConfirmed) {
        this.paymentService.updatePayment(this.PaymentFormGroup.value).subscribe(res=>{
          // //console.log(res);
          location.reload();
          this.PaymentFormGroup.reset();
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
    this.PaymentFormGroup.controls['id'].setValue(0);
    this.PaymentFormGroup.controls['isApproved'].setValue(true);
  }

deletePayment(pay:Payment)
{
  if(pay.isApproved == true)
  {
    Swal.fire("This Payment Type already deleted")
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
      this.paymentService.deletePayment(pay).subscribe(res=>{
        //console.log(res)     //this.getEmployee();
        this.PaymentDto.splice(this.PaymentDto.findIndex(x=>x.id == pay.id), 1);
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
}

onCheckboxChange(e) {

  const website: FormArray = this.PaymentFormGroup.get('isApproved') as FormArray;

  if (e.target.checked == true) {

    // //console.log(e.target.checked)
    this.isChecked = e.target.checked;
    this.PaymentFormGroup.controls['isApproved'].setValue(this.isChecked)
    //console.log(this.isChecked);

  } else {

    // //console.log(e.target.checked)
    this.isChecked = e.target.checked;
    this.PaymentFormGroup.controls['isApproved'].setValue(this.isChecked);
    //console.log(this.isChecked);
  }
}

  cancel()
  {
    this.isModify=false;
    this.PaymentFormGroup.reset();
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
  addNew(){
    this.isModify = false;
    this.PaymentFormGroup.reset();
    this.PaymentFormGroup.controls['isApproved'].setValue(true);
    this.PaymentFormGroup.controls['id'].setValue(0);
    
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


