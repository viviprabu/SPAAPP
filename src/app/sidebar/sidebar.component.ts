import { Component, OnInit } from '@angular/core';
import { UserStoreService } from '../service/user-store.service';
import { AuthService } from '../service/auth.service';
import { PassvalueService } from '../service/passvalue.service';
import { RoleService } from '../service/role.service';
import { Role } from '../model/role';
import { CompanyService } from '../service/company.service';
import { Company } from '../model/company';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
btnShow: any;
formHeader: string="";
elementName: string=""
isShow: boolean = false;
isDisplay:boolean = false;
username: string="";
role:string = "";
isMaster:boolean;
isService:boolean;
isTransaction:boolean;
isUser:boolean;
isEvent : boolean;
isCurrency : boolean;
roleDto:Role[]=[];
companyDto: Company[]=[];
companyName: string="";
showHome:boolean = false;
isHide:boolean = false;
constructor(private userStore: UserStoreService, private auth: AuthService,private passService: PassvalueService,private roleService: RoleService,
  private companyService: CompanyService, private appService: AppService, private router:Router)
{
  this.passService.getformHeader.subscribe(page=>this.formHeader == page);
  this.passService.getIsShow.subscribe(x=>this.isShow = x)
  this.appService.getIsHide.subscribe(x=>this.isHide = x)
}
ngOnInit(): void {
  this.appService.getShowHome.subscribe(x=>this.showHome=x)
this.getRole();
if(this.role == "Admin")
{
  this.role == 'Admin'
}
else{
  this.role == 'User'
}
this.getCompany();


}
openClose(e:any)
{
 
  this.router.navigate(['/','dashboard'])
  e.target.value = !e.target.value
  this.showHome = true
  this.appService.setShowHome(this.showHome)
}

getCompany()
{
  this.companyService.getCompany().subscribe(res=>{
    this.companyDto = res
    this.companyName = res[0].name
  })
}

openMaster(e){
    
    if(this.elementName == e.target.dataset.bsTarget.replace("#","")){
      this.isMaster = !this.isMaster    
     
    }
    else{
      this.isMaster = true        
      this.isService = false;
      this.isTransaction= false;
      this.isUser = false;
   
     
    }    
    this.isShow = true; 
    this.passService.setIsShow(this.isShow)
    
    this.elementName = e.target.dataset.bsTarget.replace("#","")  
    
    }
    openServices(e){
    
      if(this.elementName == e.target.dataset.bsTarget.replace("#","")){
        this.isService = !this.isService    
        
      
      }
      else{
        this.isService = true  
        this.isMaster= false;
        this.isTransaction= false;
        this.isUser = false;
      
      }
      // //console.log(this.isShow)
      this.elementName = e.target.dataset.bsTarget.replace("#","")
  
      
      
    }
    openTransaction(e){
    
      if(this.elementName == e.target.dataset.bsTarget.replace("#","")){
        this.isTransaction = !this.isTransaction    
      
      
      }
      else{
        this.isTransaction = true  
        this.isMaster= false;
        this.isService = false;
        this.isUser = false;
       
      }
      // //console.log(this.isShow)
      this.elementName = e.target.dataset.bsTarget.replace("#","")
  
      
      
    }
    openUsers(e){
    
      if(this.elementName == e.target.dataset.bsTarget.replace("#","")){
        this.isUser = !this.isUser    
        
        
      
      }
      else{
        this.isUser = true  
        this.isMaster= false;
        this.isService = false;
        this.isTransaction= false;
     
        // this.isUser = true;
       
      }
      // //console.log(this.isShow)
      this.elementName = e.target.dataset.bsTarget.replace("#","")
  
      
      
    }
    openSchedule(e){
    
      if(this.elementName == e.target.dataset.bsTarget.replace("#","")){
        this.isEvent = !this.isEvent    
        
        
      
      }
      else{
        this.isEvent = true;
        this.isUser = false;  
        this.isMaster= false;
        this.isService = false;
        this.isTransaction= false;
    
       
      }
      // //console.log(this.isShow)
      this.elementName = e.target.dataset.bsTarget.replace("#","")
  
      
      
    }
    getButtonName(e)
    {
      this.formHeader = e.target.name;
      //console.log(this.formHeader)
      this.passService.setformHeader(this.formHeader)
      this.showHome = true
      this.appService.setShowHome(this.showHome)
      this.isHide = false
      this.appService.setIsHide(this.isHide)


    }

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
      })
      // console.log(this.role)
      // location.reload();
    });
  }
}

