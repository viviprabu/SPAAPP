import { UserbranchService } from '../service/userbranch.service';
import { Component,OnInit } from '@angular/core';
import {FormBuilder,FormControl,FormGroup, Validators} from '@angular/forms'
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Users } from '../model/users';
import { Branch } from '../model/branch';
import { UserBranch } from '../model/userbranch';
import { AuthService } from '../service/auth.service';
import { AppService } from '../app.service';
import { UserStoreService } from '../service/user-store.service';
import { BranchService } from '../service/branch.service';
import { ResetPasswordService } from '../service/reset-password.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  userId : number = 0;
  userDto : Users[]=[];
  branchDto: Branch[]=[];
  userBranchDto: UserBranch[]=[];
  branchIdDto:Branch[]=[];
  message:string = "";
  formName:string = "";
  fieldTextType:boolean;
  password :string;
  show :boolean = false;
  loginFormGroup!: FormGroup;
  branchId : number = 0;
  branchName:string="";
  localBranchId : number=0;
  username:string="";
  getToken:string="";
  getRefreshToken:string="";
  public resetPasswordEmail!:string
  public isValidEmail!:boolean
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private appService: AppService,
    private userStore: UserStoreService,
    private branchService: BranchService,
    private userBranchService: UserbranchService,
    private resetService: ResetPasswordService)
  {
    this.appService.getMessage.subscribe(msg=> this.message=msg);
    this.appService.getCompName.subscribe(fnm=> this.formName=fnm);
  }
  ngOnInit(): void {
    this.loginFormGroup = this.formBuilder.group({
      username:["",Validators.required],
      password:["",Validators.required],
      branchId:[0,Validators.required],
      role:[""],
    })
    // this.getUserId();
    
    this.password = "password"
  }
  // getUserId()
  // {
  //   this.auth.getAllUsers().subscribe(res=>{
  //         this.userDto = res;
  //       });
  //       this.userDto.filter(uid=>{
  //         if(uid.username == this.loginFormGroup.controls['username'].value)
  //         this.userId = uid.id;
  //       })
  // }
  // hideShowPass()
  // {
  //   this.fieldType = !this.fieldType
  //   // this.isText ? this.eyeIcon = "fa fa-eye" : this.eyeIcon = "fa fa-eye-slash";
  //   // this.isText ? this.type = "text" : this.type = "password"
  //   // console.log(this.isText)
  //   // console.log(this.eyeIcon)
  //   // console.log(this.type)
  // }

  onLogin()
  {
    if(this.loginFormGroup.valid)
    {

      this.auth.login(this.loginFormGroup.value).subscribe({
        next:(res=>{

          this.auth.storeToken(res.accessToken)
          // console.log(res.accessToken)
          this.auth.storeRefreshToken(res.refreshToken)
          this.auth.storeUserDetail(res.userDetail)
          this.auth.setUserDetail(res.userDetail)


          // this.dbService.getAll('token').subscribe((token:any)=>{this.getToken = token[0].token })
          const tokenPayLoad = this.auth.getDecodedAccessToken(localStorage.getItem('token'));
          this.userStore.setFullNameFromStore(tokenPayLoad.unique_name)
          this.userStore.setRoleFromStore(tokenPayLoad.role)
          this.userId = res.userDetail.id
          // this.getUserId();

         this.username = this.loginFormGroup.controls['username'].value
        // this.dbService.add('users',{userId:this.userId,username:this.username}).subscribe((key)=>{})

          this.router.navigate(['contentlayout']);

          this.loginFormGroup.reset();
        }),
        error:(err=>{
          // alert(err?.error.message)
          Swal.fire({
            title: "Sorry!",
            text: "You are not Authorised",
            icon: "warning"
          });
        })
      })
    }
    else
    {
      this.validateAllFormFields(this.loginFormGroup);
      // alert("Your form is invalid");
      // this.toast.error({detail:"ERROR",summary:"Not Successful",duration:5000});
      Swal.fire("Not Successful")
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
checkValidEmail(event:string)
{
  const value = event;
  const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
  this.isValidEmail = pattern.test(value)
  return this.isValidEmail;
}
confirmToSend()
{
  if(this.checkValidEmail(this.resetPasswordEmail))
  {
    console.log(this.resetPasswordEmail)


    this.resetService.sendResetPasswordLink(this.resetPasswordEmail).subscribe({
      next:(res)=>{
        Swal.fire({
          title: "Success",
          text: "Reset link successfully send to your email",
          icon: "success"
        });
        this.resetPasswordEmail = "";
        const buttonRef = document.getElementById("closeBtn");
        buttonRef?.click();
      },
      error:(err)=>{
        Swal.fire({
          title: "Failure",
          text: "something went wrong",
          icon: "warning"
        });
      }
    })
  }
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
