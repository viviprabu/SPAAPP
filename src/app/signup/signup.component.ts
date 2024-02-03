import {FormBuilder,FormControl,FormGroup, Validators} from '@angular/forms'
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';
import { BranchService } from '../service/branch.service';
import { Branch } from '../model/branch';
import { UserBranch } from '../model/userbranch';
import { RoleService } from '../service/role.service';
import { Role } from '../model/role';
import { CustomerService } from '../service/customer.service';
import { Customer } from '../model/customer';
import { Users } from '../model/users';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  type:string= 'password';
  isText: boolean = false;
  eyeIcon : string = "fa-eye-slash";
  signFormGroup: FormGroup;
  branchDto: Branch[]=[];
  branchArray:UserBranch[]=[];
  name = 'Angular 5';
  password: string = '';
  c_password: string = '';
  toggle1: boolean = false;
  toggle2: boolean = false;
  roleDto : Role[]=[];
  roleId:number;
  show:boolean=false;
  customerFormGroup: FormGroup;
  customerDto:Customer[]=[];
  userDto: Users[]=[];
  constructor(private formBuilder: FormBuilder,private auth:AuthService,private router: Router,private branchService: BranchService,
    private roleService: RoleService,private customerService: CustomerService){
     

  }
  ngOnInit(): void {

    this.signFormGroup = this.formBuilder.group({
      firstName:["",Validators.required],
      lastName:["",Validators.required],
      address:["",Validators.required],
      city:["",Validators.required],
      phone:["",Validators.required],
      gender:["",Validators.required],
      email:["",Validators.required],
      username:["",Validators.required],
      password:["",Validators.required],
      roleId:[0],
      userBranches:[]

    })
    this.isText = false;  
    this.getBranch();
    this.getRoles();
    this.getCustomer();
    this.password ="password"
  }
  getCustomer()
  {
    this.customerService.getCustomer().subscribe(res=>{
      this.customerDto = res
    });
  }
  getRoles()
  {
    this.roleService.getRole().subscribe(res=>{
      this.roleDto = res   
      
      this.roleDto.filter(x=>{
        if(x.name == "Guest")
        {
          this.roleId = x.id;
       
        }
        
      })
    })
    
    
  }
  hideShowPass()
  {
    this.isText = !this.isText;
    this.isText ? this.type ="text" : this.type ="password";
    return this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon ="fa-eye-slash";
  }
  onSelectBranch(e)
  {
    
    this.branchArray=[];
      this.branchArray.push(
        {
          id:0,
          userId:0,
          branchId:e.target.value,
          isDeleted:false
        })
  
   this.signFormGroup.controls['userBranches'].setValue(this.branchArray);
  
  }
  getBranch()
  {
    this.branchService.getBranch().subscribe(res=>{this.branchDto= res});
    // console.log(this.branchDto)
    this.branchDto.filter(x=>{
      this.branchArray.push({
        id:0,
        userId:0,
        branchId:x.id,
        isDeleted:false
      })
    })
    this.signFormGroup.controls['userBranches'].setValue(this.branchArray);
  }
  add()
  {
 if(this.type == 'password')
    {
      this.isText = true
      this.eyeIcon = 'fa-eye-slash'
    }
    else
    {
      this.isText = false
      this.eyeIcon = 'fa-eye'
    }
  }

  changeType(input_field_password, num){
    if(input_field_password.type=="password")
      input_field_password.type = "text";
    else
      input_field_password.type = "password";

    if(num == 1)
      this.toggle1 = !this.toggle1;
    else
      this.toggle2 = !this.toggle2;
  }

checkExistingUsers()
{
  this.auth.getAllUsers().subscribe(user=>{
    this.userDto = user;
    
  });
}

  onSubmit()
  {
    if(this.signFormGroup.valid)
    {
      this.getBranch();
          this.signFormGroup.controls["roleId"].setValue(this.roleId)
          this.signFormGroup.controls["userBranches"].setValue(this.branchArray)
          
          
          this.auth.signup(this.signFormGroup.value).subscribe({
            next:(res=>{
              // alert(res.message)
              // this.toast.success({detail:"SUCCESS",summary:res.message,duration:5000});
              
              Swal.fire({
                title: "Good job!",
                text: "You are Registered Successfully",
                icon: "success"
              });
              this.signFormGroup.reset();
              this.router.navigate(['login']);
            }),
            error:(err=>{
              // alert(err?.error.message)
              // this.toast.error({detail:"ERROR",summary:err?.error.message,duration:5000});
              Swal.fire({
                title: "Sorry",
                text: err?.error.message,                
                icon:'warning'
    
              });
    
            })
          })
        
      
      
     
    }
    else
    {
      //console.log("Not Successful");
      this.validateAllFormFields(this.signFormGroup);
      
      // alert("Your form is invalid");
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
  onGenderChange(e)
  {
    this.signFormGroup.controls['gender'].setValue(e.target.value);
  }
  onClick()
{
  if(this.password == 'password')
  {
    this.password = 'text';
    this.show = true;
  }
else
{
  this.password = 'password';
  this.show = false;
}

}
}
