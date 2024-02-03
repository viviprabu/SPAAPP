import { Component } from '@angular/core';
import { UserStoreService } from '../service/user-store.service';
import { AuthService } from '../service/auth.service';
import { PassvalueService } from '../service/passvalue.service';
import { RoleService } from '../service/role.service';
import { Role } from '../model/role';
import { AppService } from '../app.service';

@Component({
  selector: 'app-sidebar-minimized',
  templateUrl: './sidebar-minimized.component.html',
  styleUrl: './sidebar-minimized.component.scss'
})
export class SidebarMinimizedComponent {

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
  isEvent:boolean;
  roleDto: Role[]=[];
  showHome:boolean= false;
  constructor(private userStore: UserStoreService, private auth: AuthService,private passService: PassvalueService,private roleService: RoleService,private appService: AppService)
  {
    this.passService.getformHeader.subscribe(page=>this.formHeader == page);
  }
  ngOnInit(): void {
  this.getRole();
  this.appService.getShowHome.subscribe(x=>this.showHome = x)
  if(this.role == "Admin")
  {
    this.role == 'Admin'
  }
  else{
    this.role == 'User'
  }
  this.getRoles();
  
  
  }
  openClose(e:any)
  {
    e.target.value = !e.target.value
  }
  
  getRoles()
  {
    this.roleService.getRole().subscribe(res=>{this.roleDto=res});
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
        this.showHome = true
        this.appService.setShowHome(this.showHome)
       
      }
      // //console.log(this.isShow)
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
          this.showHome = true
          this.appService.setShowHome(this.showHome)
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
          this.showHome = true
          this.appService.setShowHome(this.showHome)
         
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
          this.showHome = true
          this.appService.setShowHome(this.showHome)
         
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
          this.showHome = true
          this.appService.setShowHome(this.showHome)
          // this.isUser = true;
         
        }
        // //console.log(this.isShow)
        this.elementName = e.target.dataset.bsTarget.replace("#","")
    
        
        
      }
      getButtonName(e)
      {
        this.formHeader = e.target.name;
        //console.log(this.formHeader)
        this.passService.setformHeader(this.formHeader)
  
  
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
        // //console.log(this.role)
        // location.reload();
      });
    }
  }
  
  
