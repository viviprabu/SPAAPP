import { TherapistService } from './../service/therapist.service';
import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Therapist } from '../model/therapist';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PassvalueService } from '../service/passvalue.service';
import { Branch } from '../model/branch';
import { BranchService } from '../service/branch.service';
import { RoleService } from '../service/role.service';
import { Role } from '../model/role';
import { AppService } from '../app.service';
import { UserBranch } from '../model/userbranch';
import { ShiftService } from '../service/shift.service';
import { SelectedShift, Shift } from '../model/shift';
import { SelectedTherapistShift, TherapistShift } from '../model/therapistShift';
import { TherapistshiftService } from '../service/therapistshift.service';

@Component({
  selector: 'app-therapist',
  templateUrl: './therapist.component.html',
  styleUrls: ['./therapist.component.scss']
})
export class TherapistComponent implements OnInit,AfterViewInit,AfterContentChecked{
  searchTerm:string="";
  isSearch:boolean = false;
  searchDto:Therapist[]=[];
  TherapistDto:Therapist[]=[];
  formCname: string="";
  TherapistFormGroup: FormGroup;
  searchFormGroup:FormGroup;
  isActiveValue:boolean = false;
  isChecked : boolean = false;
  isModify:boolean = false;
  isCheckedMap:boolean=false;
  isSubmit:boolean= false;
  branchDto: Branch[]=[];
  username:string="";
  roleName:string="";
  role:string="";
  roleDto:Role[]=[];
  userBranchDto:UserBranch[]=[];
  branchList: Branch[]=[];
  therapistShiftFormGroup:FormGroup;
  therapistShiftDto:SelectedTherapistShift[]=[];
  tshiftDto:TherapistShift[]=[];
  shiftDto:Shift[]=[];
  selectedShiftDto:Shift[]=[];
  finalShiftDto : SelectedShift[]=[];
    shiftId : number=0;
    isEnable:boolean= true;
    therapistPageDto:Therapist[]=[]
    page=1;
    pageSize=15;
  constructor(private formBuilder:FormBuilder, private therapistService: TherapistService,
    private passService: PassvalueService,private branchService: BranchService,private roleService: RoleService,private appService:AppService,
    private therapistShiftService:TherapistshiftService,private shiftService:ShiftService,private ref: ChangeDetectorRef){

      this.appService.getUsername.subscribe(x=>this.username = x)
      this.appService.getRoleName.subscribe(y=>this.roleName = y)
      this.appService.getbranchList.subscribe(z=>this.branchList = z)

    this.TherapistFormGroup = this.formBuilder.group({
      id:[0],
      name:["", Validators.required],
      branchId:["", Validators.required],
      isAvailable:[true],
           // isDeleted:[false],
      therapistShifts:[]

      


    });

    this.searchFormGroup = this.formBuilder.group({
      id:[0],
      cname:["", Validators.required],
      branchId:["", Validators.required],
      isAvailable:[true],
      isDeleted:[false],
      therapistShifts:[]
     



    });
    this.therapistShiftFormGroup = this.formBuilder.group({
      Id:[0],
      therapistId:["", Validators.required],
      shiftId:["", Validators.required],
    });
  }
  
  // ngOnChanges(changes: SimpleChanges): void {
  //   this.ref.detectChanges()
  // }
  ngAfterViewInit(): void {
    setTimeout(()=>{
    this.passService.setformHeader('Therapist');
    this.ref.detectChanges()
    }
    ,0)
    
  }
  ngAfterContentChecked(): void {
    this.refreshPages();
  }
  ngOnInit(){
    this.loadMasterDatas();   
  
   }
   loadMasterDatas()
   {
    this.shiftService.getShift().subscribe(res=>{this.shiftDto = res; this.selectedShiftDto = res })
    this.roleService.getRole().subscribe(res=>{this.roleDto = res;
        const roleName = this.roleDto.filter(x=>{(x.id == parseInt(this.roleName))
         this.role = roleName[0].name })})
    this.branchService.getBranch().subscribe(res=>this.branchDto = res)
    this.therapistService.getTherapist().subscribe(res=>this.TherapistDto = res)
    
   }
  refreshPages()
  {
    this.therapistPageDto = this.TherapistDto.map((slots, i) => ({ id: i + 1, ...slots })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
  }
  
  getShiftId(e)
  {
    this.shiftId = e.target.value
  }
  selectShift()
  {
    this.finalShiftDto=[];
    this.therapistShiftDto=[];
    // this.shiftService.getShift().subscribe(res=>{
    //   this.selectedShiftDto = res
    // })
    this.isEnable = false;
    this.selectedShiftDto.filter(x=>{
      if(x.id == this.shiftId)
      {
        this.finalShiftDto.push({
          id:x.id,
          name:x.name,
          startTime:x.startTime,
          endTime:x.endTime
        })
        this.therapistShiftDto.push({
          id:0,
          therapistId:0,
          shiftId:x.id
        })
       
      }
      
       console.log(this.therapistShiftDto)
    })
    
    
  }
 
 
  

  saveTherapist()
  {
    if(this.TherapistFormGroup.valid)
    {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {
  
        if (result.isConfirmed) {
          this.TherapistFormGroup.controls['therapistShifts'].setValue(this.therapistShiftDto)
          this.therapistService.createTherapist(this.TherapistFormGroup.value).subscribe(res => {
            // //console.log(res.value);
            // this.TherapistDto.push(res);
            
            this.TherapistFormGroup.reset();
            this.therapistShiftDto = [];
            this.TherapistFormGroup.controls['therapistShifts'].setValue(null)
            this.resetForm();
            location.reload();
            
            // Swal.fire('Saved!', '', 'success')
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
    }
    
  }
  getRecords(row:Therapist)
  {
    this.TherapistFormGroup.controls['id'].setValue(row.id);
    this.TherapistFormGroup.controls['name'].setValue(row.name);
    this.TherapistFormGroup.controls['branchId'].setValue(row.branchId);
    this.TherapistFormGroup.controls['isAvailable'].setValue(row.isAvailable);
    // this.TherapistFormGroup.controls['therapistShifts'].setValue(row.therapistShifts);
    
    this.shiftService.getShift().subscribe(res=>{
      this.finalShiftDto = res.filter(x=>row.therapistShifts.find(y=>y.shiftId == x.id))   
    })
    
    this.therapistShiftService.getTherapistShift().subscribe(res=>{
      this.tshiftDto = res.filter(x=>x.therapistId == row.id)
      // console.log(this.tshiftDto)
      this.therapistShiftDto = this.tshiftDto
      // console.log(this.therapistShiftDto)
    });
    
    this.isActiveValue = row.isAvailable;
    if (this.isActiveValue == true)
    {
      this.isChecked = true;// //console.log(br.isActive)
    }
    else    {
      this.isChecked = false;
    }
    this.isModify = true;
  
  }
  modifyTherapist()
  {
    Swal.fire({
      title: "Do you want to modify the changes?",
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: "Modify",
      denyButtonText: `Don't Modify`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      this.TherapistFormGroup.controls['therapistShifts'].setValue(this.therapistShiftDto);
      this.therapistService.updateTherapist(this.TherapistFormGroup.value).subscribe(res=>{
        // //console.log(res);
        this.TherapistFormGroup.reset();
        this.isModify = false;
        location.reload();
      })
      if (result.isConfirmed) {

        // Swal.fire("Modified!", "", "success");
      } else if (result.isDenied) {
        this.isModify=false;
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }


deleteTherapist(ctry:Therapist)
{
  // if(ctry.isDeleted = false)
  // {
  //   Swal.fire("This therapist already deleted")
  // }
  // else
  // {
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
      this.therapistService.deleteTherapist(ctry).subscribe(res=>{
        // //console.log(res)
        //this.getEmployee();
        this.TherapistDto.splice(this.TherapistDto.findIndex(x=>x.id == ctry.id), 1);
        location.reload()
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
// }
}

onCheckboxChange(e) {

  const website: FormArray = this.TherapistFormGroup.get('isAvailable') as FormArray;

  if (e.target.checked == true) {

    // //console.log(e.target.checked)
    this.isChecked = e.target.checked;
    this.TherapistFormGroup.controls['isAvailable'].setValue(this.isChecked)
    // //console.log(this.isChecked);

  } else {

    // //console.log(e.target.checked)
    this.isChecked = e.target.checked;
    this.TherapistFormGroup.controls['isAvailable'].setValue(this.isChecked);
    // //console.log(this.isChecked);
  }
}
resetForm()
  {
    this.TherapistFormGroup.controls['id'].setValue(0);
    this.TherapistFormGroup.controls['isAvailable'].setValue(true);
    // this.TherapistFormGroup.controls['isDeleted'].setValue(false);
  }
  Cancel()
  {
    this.isModify=false;
    this.TherapistFormGroup.reset();
  }


  searchTherapist()
  {
    this.formCname = this.searchFormGroup.controls['cname'].value;

    // //console.log(this.formCname)
    if(this.formCname === "")
    {
      Swal.fire("Please enter required Country to search?");
    }
    else
    {
      this.searchDto = this.TherapistDto.filter((element)=>{
        return element.name.toLowerCase() == this.formCname.toLowerCase();
      })
      this.TherapistDto = this.searchDto;

      // //console.log(this.countryDto);
      this.isSearch = true;
    }

  }
  CancelSearch()
  {
    this.searchFormGroup.reset();
    this.isSearch = false;
    location.reload();

  }
  addNew(){
    this.isModify = false;
    this.TherapistFormGroup.reset();
    this.finalShiftDto=[];
    this.TherapistFormGroup.controls['id'].setValue(0);
    this.TherapistFormGroup.controls['isAvailable'].setValue(true);
    // this.TherapistFormGroup.controls['isDeleted'].setValue(false);
    
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
  remove(row)
  {
    
    this.finalShiftDto.splice(this.finalShiftDto.findIndex(x=>x.id == row.id),1)

    this.therapistShiftDto.splice(this.therapistShiftDto.findIndex(x=>x.shiftId == row.id))
    // console.log(this.therapistShiftDto)
  }


}
