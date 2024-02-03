import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShiftService } from '../service/shift.service';
import { Shift } from '../model/shift';
import Swal from 'sweetalert2';
import { PassvalueService } from '../service/passvalue.service';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrl: './shift.component.scss'
})
export class ShiftComponent implements OnInit,AfterViewInit,AfterContentChecked
{
  
  searchTerm:string="";
  shiftFormGroup:FormGroup;
  isSubmit:boolean=false;
  shiftDto:Shift[]=[];
  isModify:boolean = false;
  searchDto:Shift[]=[];
  isCheckedMap:boolean=false;
  shiftPageDto:Shift[]=[];
  page=1;
  pageSize=15;
constructor(private formBuilder: FormBuilder,private shiftService: ShiftService,private ref: ChangeDetectorRef, private passValue: PassvalueService)
{
this.shiftFormGroup = this.formBuilder.group({
  id:[0],
  name:["",Validators.required],
  startTime:["",Validators.required],
  endTime:["",Validators.required]
})
}
  ngAfterContentChecked(): void {
    this.refreshPages();
  }
// ngOnChanges(changes: SimpleChanges): void {
//   this.ref.detectChanges()
// }
ngAfterViewInit(): void {
  setTimeout(()=>{
    this.passValue.setformHeader('Shift');
  this.ref.detectChanges()
  }
  ,0)
  
}

ngOnInit() {
  
  
}
refreshPages()
  {
    this.shiftPageDto = this.searchDto.map((slots, i) => ({ id: i + 1, ...slots })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
  }
  loadMasterDatas()
  {
    this.shiftService.getShift().subscribe(res=>{this.shiftDto = res; this.searchDto = res })
  }

check(e)
{

}
saveShift()
  {
    
    if(this.shiftFormGroup.valid)
    {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {
        
        if (result.isConfirmed) {
          this.shiftService.createShift(this.shiftFormGroup.value).subscribe((res:any) => {
            // //console.log(res.value);

            this.shiftDto.push(res.value);
            this.shiftFormGroup.reset();
            this.resetForm();
            // Swal.fire('Saved!', '', 'success')
            this.isSubmit == false;
            location.reload();
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
      // this.validateAllFormFields(this.shiftFormGroup)
    }


  }
  getRecords(br:Shift)
  {

    this.shiftFormGroup.controls['id'].setValue(br.id);
    // this.branchId = br.id;
    // //console.log(br.id);
    this.shiftFormGroup.controls['name'].setValue(br.name);
    this.shiftFormGroup.controls['startTime'].setValue(br.startTime);
    this.shiftFormGroup.controls['endTime'].setValue(br.endTime);
    this.isModify = true;
  

  }
modifyShift()
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
        this.shiftService.updateShift(this.shiftFormGroup.value).subscribe(res=>{
          //console.log(res);
          
          this.shiftFormGroup.reset();
          this.isModify = false;
          location.reload();
        })

        // Swal.fire("Modified!", "", "success");
      } else if (result.isDenied) {
        this.isModify = false;
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }

  resetForm()
  {
    this.shiftFormGroup.controls['id'].setValue(0);
    
  }

// deleteBranch(br:Branch)
// {
//   if(br.isActive == false)
//   {
//     Swal.fire("This branch already deleted")
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
//       this.shiftService.deleteBranch(br).subscribe(res=>{
//         //console.log(res)
//         //this.getEmployee();

//         this.shiftDto.splice(this.shiftDto.findIndex(x=>x.id == br.id), 1);
//         this.getBranchList();
//     })
//       Swal.fire({
//         title: "Deleted!",
//         text: "Your file has been deleted.",
//         icon: "success"
//       });
//     }
//     else if (result.isDenied)
//     {

//         Swal.fire('Changes are not saved', '', 'info')

//     }
//   });
// }
// }

Cancel()
{
  this.isModify = false;
  this.shiftFormGroup.reset();
}



addNew()
{
  this.isModify = false;
  this.shiftFormGroup.reset();
  this.shiftFormGroup.controls['id'].setValue(0);
  
}
deleteRows()
{

}

}
