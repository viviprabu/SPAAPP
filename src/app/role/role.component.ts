import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../service/role.service';
import { Role } from '../model/role';
import Swal from 'sweetalert2';
import { PassvalueService } from '../service/passvalue.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit,AfterViewInit,AfterContentChecked{
  searchTerm:string="";
  isSearch:boolean = false;
  searchDto:Role[];
  formCname: string="";
  ctryName:any;
  roleDto:Role[]=[];
  roleFormGroup: FormGroup;
  searchFormGroup:FormGroup;
  isActiveValue:boolean = false;
  isChecked : boolean = false;
  isModify:boolean = false;
  onSubmit:boolean = false;
  isCheckedMap:boolean=false;
  rolePageDto:Role[]=[];
  page=1;
  pageSize=15;
  constructor(private formBuilder:FormBuilder, private roleService:RoleService,private ref: ChangeDetectorRef,
    private passService:PassvalueService)
  {
    this.roleFormGroup = this.formBuilder.group({
      id:[0],
      name:["", Validators.required],
      description:[""],
      // isDeleted:[false]
    });

    this.searchFormGroup = this.formBuilder.group({
      id:[0],
      cname:["", Validators.required],
      description:[""],
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
      this.passService.setformHeader('Roles');
    this.ref.detectChanges()
    }
    ,0)
    
  }
  ngOnInit(): void {
    this.loadMasterDatas()
    

  }
  loadMasterDatas()
  {
    this.roleService.getRole().subscribe(res=>this.roleDto = res);
  }
  refreshPages()
  {
    this.rolePageDto = this.roleDto.map((slots, i) => ({ id: i + 1, ...slots })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
  }
  

  saveRole()
  {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {

      if (result.isConfirmed) {
        this.roleService.createRole(this.roleFormGroup.value).subscribe((res:any) => {
          // //console.log(res.value);

          this.roleDto.push(res.value);
          this.roleFormGroup.reset();
          this.resetForm();
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
  getRecords(role: Role)
  {

    this.roleFormGroup.controls['id'].setValue(role.id);
    this.roleFormGroup.controls['name'].setValue(role.name);
    this.roleFormGroup.controls['description'].setValue(role.description);
    // this.roleFormGroup.controls['isDeleted'].setValue(role.isDeleted);
    // this.isActiveValue = ctry.isActive;
    // if (this.isActiveValue == true)
    // {
    //   this.isChecked = true;// //console.log(br.isActive)
    // }
    // else    {
    //   this.isChecked = false;
    // }
    this.isModify = true;

  }
  modifyRole()
  {
    Swal.fire({
      title: "Do you want to modify the changes?",
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: "Modify",
      denyButtonText: `Don't Modify`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      this.roleService.updateRole(this.roleFormGroup.value).subscribe(res=>{
        //console.log(res);
        location.reload();
        this.roleFormGroup.reset();
        this.isModify = false;
          window.location.reload();
      })
      if (result.isConfirmed) {

        // Swal.fire("Modified!", "", "success");
      } else if (result.isDenied) {
        this.isModify=false;
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }


deleteRole(role:Role)
{
  if(role.isDeleted == true)
  {
    Swal.fire("This role already deleted")
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
      this.roleService.deleteRole(role).subscribe(res=>{
        //console.log(res)
        //this.getEmployee();
        this.roleDto.splice(this.roleDto.findIndex(x=>x.id == role.id), 1);
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

// onCheckboxChange(e) {

//   const website: FormArray = this.roleFormGroup.get('isApproved') as FormArray;

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
// }
resetForm()
  {
    this.roleFormGroup.controls['id'].setValue(0);
    // this.roleFormGroup.controls['isDeleted'].setValue(true);
  }
  Cancel()
  {
    this.isModify=false;
    this.roleFormGroup.reset();
  }


  searchRole()
  {
    this.formCname = this.searchFormGroup.controls['cname'].value;

    // //console.log(this.formCname)
    if(this.formCname === "")
    {
      Swal.fire("Please enter required Country to search?");
    }
    else
    {
      this.searchDto = this.roleDto.filter((element)=>{
        return element.name.toLowerCase() == this.formCname.toLowerCase();
      })
      this.isSearch = true;
    }

  }
  CancelSearch()
  {
    this.searchFormGroup.reset();
    this.isSearch = false;
    location.reload();

  }

  onRoleChange(e)
  {
    if(e.target.value)
    {
      this.searchDto = this.roleDto.filter((element)=>{
        return element.name.substring(0,3).toLowerCase() == e.target.value.substring(0,3).toLowerCase();
      })
      this.isSearch = true;
    }
    else
    {
      this.isSearch= false;
    }

  }
  deleteRows()
  {
    window.location.reload();
  }
  addNew(){
    this.isModify = false;
    this.roleFormGroup.reset();
    this.roleFormGroup.controls['id'].setValue(0);
    
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
