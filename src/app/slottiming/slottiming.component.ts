import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SlotTiming } from '../model/slottiming';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SlotTimingService } from '../service/slottiming.service';
import { PassvalueService } from '../service/passvalue.service';
import Swal from 'sweetalert2';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-slottiming',
  templateUrl: './slottiming.component.html',
  styleUrl: './slottiming.component.scss'
})
export class SlotTimingComponent implements OnInit,AfterViewInit,AfterContentChecked {
 
  searchTerm:string="";
  slotTimeDto:SlotTiming[]=[];
  slotDto:SlotTiming[]=[];
  
  slotTimeFormGroup: FormGroup;
  isActiveValue:boolean = false;
  isChecked : boolean = false;
  isModify:boolean = false;
  isCheckedMap:boolean=false;
  isSubmit:boolean = false;
  formHeader:string=""; 

  pageSize = 15;
  page = 1;

  constructor(private formBuilder:FormBuilder,private slotTimeService:SlotTimingService,private ref: ChangeDetectorRef,
    private passService: PassvalueService)
  {
    
    this.passService.getformHeader.subscribe(x=>this.formHeader=x)
    this.slotTimeFormGroup = this.formBuilder.group({
      id:[0],
      slotTime:["", Validators.required]   
     
    })
  
    
  }
  ngAfterContentChecked(): void {
    
      this.refreshSlots();
    
    
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   this.ref.detectChanges()
  // }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.passService.setformHeader('Slot Time');
      
    this.ref.detectChanges()
    }
    ,0)
    
  }
ngOnInit(): void {
  
this.getTimeSlot();
this.refreshSlots();

}


getTimeSlot()
  {

    this.slotTimeService.getSlots().subscribe(res=>{
      this.slotTimeDto = res;
    });
  }

saveTimeSlots()
  {
    if(this.slotTimeFormGroup.valid)
    {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {

        if (result.isConfirmed) {
          this.slotTimeService.createSlots(this.slotTimeFormGroup.value).subscribe((res:any) => {
            // //console.log(res.value);

            // this.slotTimeDto.push(res.value);
            this.getTimeSlot();
            this.slotTimeFormGroup.reset();
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
      this.isSubmit = true;
    }

  }
  getRecords(slt: SlotTiming)
  {

    this.slotTimeFormGroup.controls['id'].setValue(slt.id);
    this.slotTimeFormGroup.controls['slotTime'].setValue(slt.slotTime);
    
    // if (this.isActiveValue == true)
    // {
    //   this.isChecked = true;// //console.log(br.isActive)
    // }
    // else    { this.isChecked = false; } this.isModify = true;
    this.isModify = true;
  }
  modifyTimeSlots()
  {
    Swal.fire({
      title: "Do you want to modify the changes?",
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: "Modify",
      denyButtonText: `Don't Modify`
    }).then((result) => {
      if (result.isConfirmed) {
        this.slotTimeService.updateSlots(this.slotTimeFormGroup.value).subscribe(res=>{
          // //console.log(res);
          this.getTimeSlot();
          this.slotTimeFormGroup.reset();
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
    this.slotTimeFormGroup.controls['id'].setValue(0);
    
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

  const website: FormArray = this.slotTimeFormGroup.get('isApproved') as FormArray;

  if (e.target.checked == true) {

    // //console.log(e.target.checked)
    this.isChecked = e.target.checked;
    this.slotTimeFormGroup.controls['isApproved'].setValue(this.isChecked)
    //console.log(this.isChecked);

  } else {

    // //console.log(e.target.checked)
    this.isChecked = e.target.checked;
    this.slotTimeFormGroup.controls['isApproved'].setValue(this.isChecked);
    //console.log(this.isChecked);
  }
}

  cancel()
  {
    this.isModify=false;
    this.slotTimeFormGroup.reset();
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
    this.slotTimeFormGroup.reset();
    this.slotTimeFormGroup.controls['id'].setValue(0);
    
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

  refreshSlots()
  {
    this.slotDto = this.slotTimeDto.map((slots, i) => ({ id: i + 1, ...slots })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
  }
}



