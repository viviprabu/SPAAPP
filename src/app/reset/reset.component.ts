import { ReplaySubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResetPasswordService } from '../service/reset-password.service';
import Swal from 'sweetalert2';
import { ResetPassword } from '../model/reset-password';
import { ConfirmPasswordValidator } from '../helpers/confirm-password.validator';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  resetFormGroup:FormGroup;
  emailToReset!:string;
  emailToken!:string;
  onSubmit:boolean=false;
  resetPasswordObject = new ResetPassword();
  password:string;
  show : boolean = false;
constructor(
  private formBuilder: FormBuilder,
  private resetService: ResetPasswordService,
  private activatedRoute: ActivatedRoute,
  private router:Router
)
{



}
ngOnInit(): void {
  this.resetFormGroup = this.formBuilder.group({
    newPassword:[null,Validators.required],
    confirmPassword:[null,Validators.required]
  },{
    validator:ConfirmPasswordValidator('newPassword','confirmPassword')
  });

  this.activatedRoute.queryParams.subscribe(val=>{
    this.emailToReset = val['email'];
    let uriToken = val['code']

    this.emailToken = uriToken.replace(/ /g,'+')
  });
  console.log(this.emailToReset)
  console.log(this.emailToken)
  this.password = 'password'
}

resetPassword()
{

  if(this.resetFormGroup.valid)
  {
    this.resetPasswordObject.email = this.emailToReset;
    this.resetPasswordObject.newPassword = this.resetFormGroup.value.newPassword;
    this.resetPasswordObject.confirmPassword = this.resetFormGroup.value.confirmPassword;
    this.resetPasswordObject.emailToken = this.emailToken;

    this.resetService.resetPassword(this.resetPasswordObject).subscribe({
      next:(res)=>{
        Swal.fire({
          title: "Success",
          text: "Password successfully resetted",
          icon: "success"
        });
        this.onSubmit = false;
        this.router.navigate(['/'])
      },
      error:(err)=>{
        Swal.fire({
          title: "Failure",
          text: "Unable to reset your password",
          icon: "warning"
        });
      }
    })
  }
  else
  {
    this.onSubmit = true;
    // this.validateAllFormFields(this.resetFormGroup)
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

