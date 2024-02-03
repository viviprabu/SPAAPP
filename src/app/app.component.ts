import { Component, OnInit, ElementRef, ChangeDetectorRef} from '@angular/core';
import { ViewChild, AfterViewInit } from '@angular/core'
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { UserStoreService } from './service/user-store.service';
import { RoleService } from './service/role.service';
import { Role } from './model/role';
import { Users } from './model/users';
import { PassvalueService } from './service/passvalue.service';
import { AppService } from './app.service';
import { UserBranch } from './model/userbranch';
import { Branch, BranchList } from './model/branch';
import { BranchService } from './service/branch.service';
import { UserbranchService } from './service/userbranch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,AfterViewInit {
  title = 'Spa_Project';
  roleDto:Role[]=[];
  userDto:Users[]=[];
  public role:string="";
  roleName:string="";
  username:string="";
  fullName:string="";
  userId:Number=0;
  userBranchDto:UserBranch[]=[];
  UserBrDto:UserBranch[]=[];
  branchDto:Branch[]=[];
  branchList: Branch[]=[];

  constructor( private elementRef:ElementRef,private router:Router, private auth:AuthService,private userStore:UserStoreService,private roleService:RoleService,
    private passValue: PassvalueService,private appService: AppService, private branchService: BranchService, private userBranchService: UserbranchService,private ref:ChangeDetectorRef)
  {
    this.appService.getUsername.subscribe(x=>this.username = x)
    this.appService.getRoleName.subscribe(y=>this.roleName = y)
    this.appService.getbranchList.subscribe(x=>this.branchList = x)

  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      
      
    
   
    this.ref.detectChanges()
    }
    ,0)
  }

  ngOnInit()
  { 
    
    this.getNamefromToken();
    this.getRolefromToken();
    this.setUserDetail()
  // this.getBranchList();

  }
  getRole()
  {
   
  }
  logout()
  {
    //console.log('logged Out')
  }

  getNamefromToken()
  {
    this.userStore.getFullNameFromStore().subscribe(res=>{
      var fullNameFromToken = this.auth.getFullNamefromToken();
      this.fullName = res || fullNameFromToken     // //console.log(this.fullName)
      this.appService.setUsername(this.fullName)
    });
}
getRolefromToken()
  {
    this.userStore.getRoleFromStore().subscribe(res=>{
      var roleFromToken = this.auth.getRoleFromToken();
      this.role = res || roleFromToken    
      this.appService.setRoleName(this.role)
      
    
  })
}

setUserDetail(){
  if(localStorage.getItem('userDetail')){
    let user = JSON.parse(localStorage.getItem('userDetail'));
    this.auth.setUserDetail(user);
    // console.log(user)
  }else{
    this.auth.signOut()
  }
}
// getBranchList()
// {
//   this.auth.getAllUsers().subscribe(res=>{
//     this.userDto = res.filter(x=>x.username == this.fullName)

//   this.userId = this.userDto[0].id
//   })
//   this.userBranchService.getUserBranch().subscribe(res=>{
//     this.userBranchDto = res.filter(x=>x.userId == this.userId)
//     // console.log(this.userBranchDto)
//   })
//   this.branchService.getBranch().subscribe(res=>{
//     this.branchDto = res.filter(x=>this.userBranchDto.find(y=>y.branchId == x.id))
//     localStorage.setItem('BrancList',JSON.stringify(this.branchDto))
//     this.branchList = this.branchDto
//     this.appService.setBranchList(this.branchList.map(y=>({...y, check:false})) )
//     console.log(this.branchList)
//   })
// }
// getRoleName()
// {
//   this.roleService.getRole().subscribe(res=>{
//     this.roleDto = res;
    
//     this.roleDto.filter(x=>{
//       if(x.id == parseInt(this.role))
//         {
//           this.roleName = x.name
          
//         }
       
//     })
    
//    console.log(this.roleName)
//   })
// }

}