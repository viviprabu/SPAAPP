import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { AppService } from '../app.service';
import { Branch } from '../model/branch';
import { FormBuilder, FormGroup, NgModel } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, RouterLink, RouterModule, RouterStateSnapshot } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BranchService } from '../service/branch.service';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { PassvalueService } from '../service/passvalue.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AuthService } from '../service/auth.service';
import { UserStoreService } from '../service/user-store.service';
import { RoleService } from '../service/role.service';
import { Role } from '../model/role';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit,AfterViewInit{
  private fragment: string;
clickValue : string="";
title = "My Home Page"
recedUser : string = "";
isShow:boolean=false;
public fullName:string=""
public role:string=""
public roleName:string=""
roleDto:Role[]=[];
isDisplay: boolean = false;
  now: Date;
  message:string = "";
  formName:string = "";
  today:Date;
  showHome:boolean=false;


constructor(private router:Router, private modalService: NgbModal,
  private branchService: BranchService, private route:ActivatedRoute, private appService:AppService, private passService: PassvalueService,
  private auth: AuthService, private userStore: UserStoreService,private roleService:RoleService,private ref: ChangeDetectorRef, private passValue: PassvalueService){
    // this.appService.getMessage.subscribe(msg=> this.message=msg);
    // this.appService.getCompName.subscribe(fnm=> this.formName=fnm);
    this.passService.getIsShow.subscribe(x=>this.isShow = x)
    this.appService.getShowHome.subscribe(x=>this.showHome = x)
    // console.log(this.isShow)
    
}

ngAfterViewInit(): void {
  setTimeout(()=>{
  this.passValue.setformHeader('Home');
  this.ref.detectChanges()
  }
  ,0)
  
}

ngOnInit() {
  // this.appService.setMessage(this.message,this.formName);
  this.fragment = this.route.snapshot.fragment;
  this.getNamefromToken();
  this.getRolefromToken();

  this.showHome = true;
  //this.now = new Date(formatDate(Date(),'dd-MM-yyyy','en'))
  this.now = new Date()
  // this.route.fragment.subscribe(res=>{
  //   this.fragment = res;
  // });
}
// ngAfterViewInit()
// {
//   try{
//     document.querySelector('#'+this.fragment).scrollIntoView();
//   }
//   catch(e){}

// }
openPage(node:string)
{

if(node == "Branch")
{
  this.isDisplay = true;
  node = "branch";
  this.clickValue = node;
  // this.router.navigate([node]);

}
}

getNamefromToken()
{
  this.userStore.getFullNameFromStore().subscribe(res=>{
    var fullNameFromToken = this.auth.getFullNamefromToken();
    this.fullName = res || fullNameFromToken     // //console.log(this.fullName)
  });
}
getRolefromToken()
{
  this.userStore.getRoleFromStore().subscribe(res=>{
    var roleFromToken = this.auth.getRoleFromToken();
    this.role = res || roleFromToken

    this.roleService.getRole().subscribe(res=>{
      this.roleDto = res;
      this.roleDto.filter(x=>{
        if(x.id == parseInt(this.role))
        {
          this.roleName = x.name;
        }
      })
      // console.log(this.roleName)
    })
   
  });
}

}
