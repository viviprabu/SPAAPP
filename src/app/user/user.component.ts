import { userInterface } from './../model/userinterface';
import { BranchName } from './../model/branchname';
import { UserBranch } from './../model/userbranch';
import { BranchService } from './../service/branch.service';
import { empty } from 'rxjs';
import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Users } from '../model/users';
import Swal from 'sweetalert2';
import { PassvalueService } from '../service/passvalue.service';
import { Branch, BranchList } from '../model/branch';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserbranchService } from '../service/userbranch.service';
import { RoleService } from '../service/role.service';
import { Role } from '../model/role';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit,AfterViewInit,AfterContentChecked{
  @ViewChild('showBranches', { read: TemplateRef }) showBranches:TemplateRef<any>;

  isModify:boolean=false;
  resultDto : Branch[]=[];
  showBranch:boolean = false;
  onSubmit:boolean = false;
  username:string="";
  valueString: string="";
  userBranchDto:UserBranch[]=[];
  headerNames: ['branchId']
  valueArray:UserBranch[]=[];
  branchValueArray:UserBranch[]=[];
  searchTerm:string="";
  userFormGroup: FormGroup;
  userBranchFormGroup: FormGroup;
  searchFormGroup:FormGroup;
  isCheckedMap:boolean=false;
  roleDto: Role[]=[];
  isSearch:boolean = false;
  userDto:Users[]=[];
  searchDto:Users[]=[];
  uname:string;
  branchDto: Branch[]=[];
  branchListDto: BranchList[]=[];
  page=1;
  pageSize=15;
  userPageDto:Users[]=[];
  userId: number = 0;
  brId: number;
  isDisable: boolean = false;
  // isChecked:boolean = false;
constructor(private auth: AuthService, private router: Router,private formBuilder: FormBuilder,
  private passService: PassvalueService, private branchService: BranchService, private modalService: NgbModal,
  private viewRef : ViewContainerRef, private userBranchService: UserbranchService, private roleService: RoleService,private ref: ChangeDetectorRef )
{
  this.userFormGroup = this.formBuilder.group({
    id:[0],
    firstName:["",Validators.required],
    lastName:["",Validators.required],
    gender:["",Validators.required],
    address:["",Validators.required],
    city:["",Validators.required],
    phone:["",Validators.required],
    email:["",Validators.required],
    username:["",Validators.required],
    password:["",Validators.required],
    roleId:["",Validators.required],
    isDeleted :[false],
    userBranches:[]
    
    })

}
// ngOnChanges(changes: SimpleChanges): void {
//   this.ref.detectChanges()
// }
ngAfterContentChecked(): void {
  // setTimeout(()=>{
    this.refreshSlots();
  // },0)
  
}
ngAfterViewInit(): void {
  setTimeout(()=>{
  this.passService.setformHeader('Users');
  this.ref.detectChanges()
  }
  ,0)
  
}
ngOnInit(): void {

this.loadMasterDatas();



}
loadMasterDatas()
{
  this.roleService.getRole().subscribe(res=>this.roleDto = res);
  this.auth.getAllUsers().subscribe(res=> this.userDto = res);
  this.branchService.getBranch().subscribe(branch=>{this.branchDto = branch;this.updateBranchListDto(null)})
  
}
refreshSlots()
{
  this.userPageDto = this.userDto.map((slots, i) => ({ id: i + 1, ...slots })).slice(
    (this.page - 1) * this.pageSize,
    (this.page - 1) * this.pageSize + this.pageSize,
  );
}

onChange(e,row:any)
{
  if (e.target.checked) {

    this.branchValueArray.push(
      {
        id:0,
        userId:0,
        branchId:row.id,
        isDeleted:false
      })

  }
 else {

  const idx = this.branchValueArray.findIndex(x=>x.branchId == row)
  this.branchValueArray.splice(idx,1);
}


}



getRecords(row)
  {
    this.isModify = true
    // this.getBranch();
          this.userFormGroup.controls['id'].setValue(row.id);
      this.userFormGroup.controls['firstName'].setValue(row.firstName);
      this.userFormGroup.controls['lastName'].setValue(row.lastName);
      this.userFormGroup.controls['address'].setValue(row.address);
      this.userFormGroup.controls['city'].setValue(row.city);
      this.userFormGroup.controls['phone'].setValue(row.phone);
      this.userFormGroup.controls['gender'].setValue(row.gender);
      this.userFormGroup.controls['email'].setValue(row.email);
      this.userFormGroup.controls['username'].setValue(row.username);
      this.userFormGroup.controls['roleId'].setValue(row.roleId);
        this.branchListDto=[];
        this.userBranchDto = row.userBranches
        this.branchDto.forEach(x=>{
          let br : BranchList = new BranchList()
          br.id=x.id,
          br.name=x.name
          
         if(row.userBranches.some(y=>y.branchId == x.id))
         {
          br.checked = true
         }
         else
         {
          br.checked = false
         }
          br.isActive = true
          this.branchListDto.push(br)
          // console.log(this.branchListDto)

        })
        
        
      // this.updateBranchListDto(row)
      }
isChecked(row): boolean
{
  return this.userBranchDto.some(res=>{
    res.branchId == row
    
  })
  
}
onGenderChange(e)
{
  if(e.target.value == 'Male')
  {
    this.userFormGroup.controls['gender'].setValue('Male')
  }
  else
  {
    this.userFormGroup.controls['gender'].setValue('Female')
  }
  
}

updateBranchListDto(row){
  this.branchListDto = []

  this.branchDto.forEach(x=>{
      let a: BranchList = new BranchList()

      a.id = x.id
      a.name = x.name,
      a.isActive = x.isActive

      if(row){
      if(row.userBranches.some(y=> y.branchId == x.id) ){
        a.checked =true
      }else{
        a.checked =false
      }

    }else{
      a.checked =false
    }
    if(a.isActive == true)
    { this.branchListDto.push(a)}
    else{}

    
      // alert("this branch deleted")

    })
    // console.log(this.branchListDto)
}
deleteUser(usr)
{
  if(usr.isDeleted == true)
  {
    Swal.fire("Unable to edit this user. User already deleted");
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
        this.auth.deleteUser(usr).subscribe(res=>{
          //console.log(res)
          //this.getEmployee();

          this.userDto.splice(this.userDto.findIndex(x=>x.id == usr.id), 1);
          location.reload();
      })
        Swal.fire({
          title: "Deleted!",
          text: "User deleted.",
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
  this.userFormGroup.controls['id'].setValue(0);
}
saveUser()
{

  if(this.userFormGroup.valid)
  {
    // console.log('Working')
    this.userFormGroup.controls["userBranches"].setValue(this.branchValueArray)
    this.auth.signup(this.userFormGroup.value).subscribe({
   next:((res:any)=>{
    //    Swal.fire({
    //    title: "Good job!",
    //    text: "You are Registered Successfully",
    //    icon: "success"
    //  });
     this.userFormGroup.reset();
     this.resetForm();
     location.reload()

   }),
   error:(err=>{
     // alert(err?.error.message)
     // this.toast.error({detail:"ERROR",summary:err?.error.message,duration:5000});
     Swal.fire({
       title: "Sorry",
       text: "Not Registered",
       icon:'warning'

     });

   })
 })
  }
    else
    {
      this.onSubmit = true;
      //console.log("Not Successful");
      //  this.validateAllFormFields(this.userFormGroup);
      //alert("Your form is invalid");
    }

}

modifyUser()
{
  if(this.branchListDto.filter(x=>x.checked = false))
  {
    this.userFormGroup.controls["userBranches"].setValue(this.branchValueArray)
  }
  else
  {
    this.userFormGroup.controls["userBranches"].setValue(this.branchListDto.filter(x=>x.checked))
  }

    // this.onSubmit =true;
    // if(this.userFormGroup.valid)
    // {


      this.auth.updateUser(this.userFormGroup.value).subscribe({
        next:((res:any)=>{
            Swal.fire({
            title: "Good job!",
            text: "You are Modified Successfully",
            icon: "success"
          });

          

          this.userFormGroup.reset();
          this.onSubmit = false;
          this.isModify = false;
          location.reload();
        }),
        error:(err=>{
            Swal.fire({
            title: "Sorry",
            text: "Not Modified",
            icon:'warning'

          });

        })
      })
}
// searchUser()
// {


//   this.uname = this.searchFormGroup.controls['user'].value;

//   // //console.log(this.formCname)
//   if(this.uname == "")
//   {
//     Swal.fire("Please enter required username to search?");
//   }
//   else
//   {
//     this.searchDto = this.userDto.filter((element)=>{
//       return element.username.substring(0,3).toLowerCase() == this.uname.substring(0,3).toLowerCase() ||
//       element.username.toLowerCase() == this.uname.toLowerCase()

//     })

//      this.userDto = this.searchDto;
//      //console.log(this.userDto)
//     // //console.log(this.countryDto);
//     this.isSearch = true;
//   }
// }
// changeSearch(e:any)
// {
//   this.uname = e.target.value;
//   if(this.uname)
//   {
//     this.searchDto = this.userDto.filter(element=>{
//       return element.username.substring(0,3).toLowerCase() == this.uname.substring(0,3).toLowerCase()
//     })

//     this.isSearch = true;
//   }
//   else
//   {
//     this.isSearch = false;
//   }


// }
openBranch()
{
  this.modalService.open(this.showBranches)
}
closeDialog()
{
  this.modalService.dismissAll();
}

cancel()
{

}
Close()
{
  document.getElementById('closeModal').click();
}
cancelSearch()
{
  this.searchFormGroup.reset();
  this.searchDto
  this.isSearch = false;
  // this.getTherapistList();
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
  this.userFormGroup.reset();
  this.userFormGroup.controls['isDeleted'].setValue(false);
  this.userFormGroup.controls['id'].setValue(0);
  
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
