import { AppService } from './../app.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { NavbarrightComponent } from '../navbarright/navbarright.component';
import { PassvalueService } from '../service/passvalue.service';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { Observable, Subscription } from 'rxjs';
import { Role } from '../model/role';
import { UserStoreService } from '../service/user-store.service';
import { RoleService } from '../service/role.service';



@Component({
  selector: 'app-contentlayout',
  templateUrl: './contentlayout.component.html',
  styleUrls: ['./contentlayout.component.scss']
})
export class ContentlayoutComponent implements OnInit,OnDestroy{
 
isShow:boolean = false;
isHide:boolean;
margin:number;
width:number;
roleDto:Role[]=[];
username:string="";
role:string="";
isClient:boolean = false;

// isSplitDisabled = false;
//     pageSplitDirection: 'vertical' | 'vertical' = 'vertical';
//     headerSizeInPercent = 10;
//     bodySizeInPercent = this.width
//     contentSplitDirection: 'vertical' | 'horizontal' = 'horizontal';
//     leftChildSizeInPercent = this.margin;
//     rightChildSizeInPercent = this.width;
   

  
  public users:any[];
  constructor(private auth:AuthService, private passService: PassvalueService, private userStore: UserStoreService, private roleService: RoleService )
  {
    this.passService.getBoolean.subscribe(res=>this.isHide=res);
    this.passService.getWidth.subscribe(wd=>this.width=wd);
    this.passService.getMargin.subscribe(mg=>this.margin=mg);
    this.passService.getIsShow.subscribe(x=>this.isShow=x);
    
  
   
    
  }
  ngOnDestroy(): void {
    
  }
  ngOnInit(): void {
    // this.auth.GetAllUsers().subscribe(res=>{
    //   this.users = res
    // });
   
    if(!this.isHide)
    {
      this.margin = 80;
      this.width = 20;
    }
    else
    {
      this.margin = 94.1;
      this.width = 5.9;
      
    }
   
    this.passService.setBoolean(this.isHide,this.width,this.margin);
    // console.log(this.margin,this.width,this.isHide) 
    
    this.getRoles();
    this.getRole();

  }
  getRoles()
  {
    this.roleService.getRole().subscribe(res=>{this.roleDto = res})
  }

  //   this.margin = "0"
  //   this.width="100"
  // this.isHide = !this.isHide;
  getUserName()
  {
    this.userStore.getFullNameFromStore().subscribe(res=>{
      var fullNameFromToken = this.auth.getFullNamefromToken();
      this.username = res || fullNameFromToken
      // //console.log(this.fullName)
      // location.reload();
    });
  }
  getRole()
  {
    this.userStore.getRoleFromStore().subscribe(res=>{
      var roleFromToken = this.auth.getRoleFromToken();
      this.role = res || roleFromToken

      this.roleService.getRole().subscribe(res=>{
        this.roleDto = res;
        this.roleDto.filter(x=>{
          if(x.id == parseInt(this.role))
          {
            this.role = x.name;
          }
        })
        if(this.role == 'Client')
        {
          this.isClient = true;
        }
      })
      // console.log(this.role)
      // location.reload();
    });
   
  }
 

  }

