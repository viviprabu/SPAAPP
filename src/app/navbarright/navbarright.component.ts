import { BranchName } from './../model/branchname';
import { AfterContentChecked, AfterContentInit, AfterRenderOptions, AfterRenderRef, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { UserStoreService } from '../service/user-store.service';
import { PassvalueService } from '../service/passvalue.service';
import { BranchService } from '../service/branch.service';
import { UserbranchService } from '../service/userbranch.service';
import { UserBranch } from '../model/userbranch';
import { filter } from 'rxjs';
import { Users, usersList } from '../model/users';
import { Branch, BranchList } from '../model/branch';
import { AppService } from '../app.service';
import { RoleService } from '../service/role.service';
import { Role } from '../model/role';
import { CurrencyService } from '../service/currency.service';
import { Currency } from '../model/currency';


@Component({
  selector: 'app-navbarright',
  templateUrl: './navbarright.component.html',
  styleUrls: ['./navbarright.component.scss']
})
export class NavbarrightComponent implements OnInit, AfterViewInit{
  @Input() color: any;
  // color=new Color();
// @ViewChild('sidebar') sidebar?:LeftsideComponent;
  branchName:string="";
  public fullName: string = "";
  public role: string="";
  public roleName:string="";
  isHide:boolean = false;
  width:number = 0
  margin:number=0;
  formHeader:string="";
  branchDto: Branch[]=[];
  ubDto : Branch[]=[];
  userBranchDto : UserBranch[]=[];
  branchIdDto : UserBranch[]=[];
  now:any;
  brDto:BranchList[]=[];
  bNameDto:BranchList[]=[];
 brname:BranchList[]= [];
 brCheckedDto:BranchList[]=[];
 username:string="";
 userId: number = 0;
 userDto:Users[]=[];
  userIdx: number=0;
  elementName:string="";
  isShow:boolean;
  allowedBranches:BranchList[]=[];
  allowedOnly:string="";
  roleDto:Role[]=[];
  branchList: Branch[]=[];
  currencyName:string="";
  currencyId : number = 0;
  currencyDto: Currency[]=[];
  firstName:string=""
  lastName:string=""
  city:string="";
  address:string="";
  email:string="";
  phone: string;
  currentUser: Users = new Users();
  tempRoleDto: Role[];


  constructor(private appService:AppService,public auth: AuthService, private userStore: UserStoreService,
    private passService:PassvalueService,private cdRef: ChangeDetectorRef,private branchService: BranchService,
    private userBranchService: UserbranchService,private roleService: RoleService,private currencyService: CurrencyService,private ref:ChangeDetectorRef)

  {
    this.passService.getBoolean.subscribe(res=>this.isHide = res);
    this.passService.getWidth.subscribe(wd=>this.width = wd);
    this.passService.getMargin.subscribe(mg=>this.margin = mg);
    this.appService.getBranchName.subscribe((brn:any)=>this.brname = brn)
    this.appService.getbranchList.subscribe(x=>this.branchList = x)
    
    }
  ngAfterViewInit(): void {

    setTimeout(() => {
      this.auth.userDetail$.subscribe(x=>{this.currentUser = x; console.log(x)})
    });
  }
  
  
  
  
  
  ngOnInit() {
    
    // this.auth.userDetail$.subscribe(x=>{this.currentUser = x; console.log(x)})
    this.loadMasters();       
    
  //  this.getUserDetails();
  

  this.currencyDto.filter(x=>{
    x.id == this.currencyId
    // this.currencyName = x.name        
  })
  
  
  }
  loadMasters()
  {
    
    
   
    this.currencyService.getCurrency().subscribe(res=>{this.currencyDto = res})
    
    this.now = new Date;
    this.passService.getformHeader.subscribe(frm=>this.formHeader=frm);   

    // if(localStorage.getItem("checked")){
    //   this.bNameDto = JSON.parse(localStorage.getItem("checked"));      
    //  }
     this.roleService.getRole().subscribe(x=>{
      this.roleDto = x.filter(y=>y.id == this.currentUser.roleId)
    this.roleDto.filter(y=>{
      this.roleName = y.name
    })
    })

  }
  // getUserDetails()
  // {
  //   this.auth.userDetail$.subscribe(x=>{this.currentUser = x
  //     this.firstName = this.currentUser.firstName
  //     this.lastName = this.currentUser.lastName
  //     this.address = this.currentUser.address
  //     this.city = this.currentUser.city      
  //     this.phone = this.currentUser.phone
  //     this.email = this.currentUser.email   
  //   })
  //   this.ref.detectChanges();
      
      
  // }

  getRoleName()
  {
    console.log(this.roleDto)
    this.roleDto.filter(y=>{
      this.roleName = y.name
    })
    
      
  }
  toggleClick(event:any)
  {
    // this.sidebar?.openPage(event);
  }
  

  // getUsers()
  // {
  //   this.auth.getAllUsers().subscribe(res=>{
  //     this.userDto = res.filter(x=>x.username == this.fullName)
        
  //     this.userDto.filter(x=>{
  //       x.id == this.userId
  //       {
  //         this.firstName = x.firstName
  //         this.lastName = x.lastName
  //         this.address = x.address
  //         this.city = x.city
  //         this.phone = x.phone
  //         this.email = x.email
  //       }
  //     })
  //     })
    //   this.userBranchService.getUserBranch().subscribe(ub=>{
    //     this.userBranchDto = ub;
    //    this.branchIdDto =  this.userBranchDto.filter(res=>
    //      res.userId == this.userId )
    //     //  console.log(this.branchIdDto)
    //   })
    //   // console.log(this.userId)
    //   this.branchService.getBranch().subscribe(brn=>{
    //     this.branchDto = brn
    //   this.branchDto.filter(br=>{
    //     this.branchIdDto.filter(x=>{
    //       if(br.id == x.branchId)
    //       this.brDto.push({id:br.id,name:br.name,checked:false,isActive:true})
          
    //     })
    //     // console.log(this.currencyId)
    //   })
    // })
    // // console.log(this.brDto)
    // // console.log(this.userDto)
    // })
    
    // console.log(this.fullName)
// }
// getUserBranch()
// {

//   // this.brDto = [];
//      this.branchService.getBranch().subscribe(brn=>{
//       this.branchDto = brn
//     this.branchDto.forEach(br=>{
//       this.branchIdDto.filter(ubr=>{
//         if(br.id == ubr.branchId)
//         {
//           this.brDto.push({id:ubr.branchId,name:br.name,isChecked:false});
//         }
//       })

//     })
//     console.log(this.brDto)
//     });


//           // this.dbService.add('branch',{branchId:br.id,branchName:br.name}).subscribe(key=>{
//           //   console.log(key)
//           //   })

//     //   this.branchDto.forEach(br=>{
//     //     this.branchIdDto.forEach(ubr=>{
//     //       if(br.id == ubr.branchId)
//     //       {this.brDto.push({id:ubr.branchId,name:br.name,isChecked:false})
//     //     }
//     //       else {}
//     // })
//     //  })






// }

  openHide()
  {
    if(!this.isHide)
    {
      this.isHide = true;     
      this.width = 6.2;
      this.margin = 93.8;
     
      this.passService.setBoolean(this.isHide,this.width,this.margin)
      //console.log(this.isHide,this.width,this.margin)
    }
    else
    {
      this.isHide = false;
      this.width = 20;
      this.margin = 80;
      
      this.passService.setBoolean(this.isHide,this.width,this.margin)
            //console.log(this.isHide,this.width,this.margin)
    }
 
  }
  checkBoxChange(e,row,idx)
  {   
    
    //console.log(row)
    if(e.target.checked)
    {
          this.bNameDto.push({
            id:row.id,
            name:row.name,
            checked:true,
            isActive:true})
          localStorage.setItem('checked',JSON.stringify(this.bNameDto))
          this.allowedBranches = this.bNameDto;
          console.log(this.allowedBranches)
          // this.dbService.add('branches',{id:row.id,name:row.name,isChecked:true,isActive:true}).subscribe((key)=>{})
            // this.appService.setBranchName(this.brname)
    }
    else
    {
      // console.log(e.target.value)
      const index = this.bNameDto.findIndex(x=>x.id == e.target.value)
      // console.log(index)
      this.bNameDto.splice(index,1)
      localStorage.setItem('checked',JSON.stringify(this.bNameDto))
      console.log(this.allowedBranches)
    }
    // this.brCheckedDto = this.bNameDto;
    // localStorage.setItem('selected',JSON.stringify(this.bNameDto))
    // console.log(this.bNameDto)
  }
    isChecked(row)
  {

    for(let index = 0; index < this.bNameDto.length; index ++)
    {
      if(row == this.bNameDto[index].id){        
        
        return true;
        
      }
     
    }  
  
    
    return false

    
    
  }
  logout()
  {
    this.auth.signOut();
    // this.dbService.clear('users').subscribe(users=>{
      // console.log('Successfully Cleared')
    // });
    localStorage.clear();

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
      
      })
      //console.log(this.role)
    
}

selectBranch(e)
{
  if(this.elementName == e.target.dataset.bsTarget.replace("#","")){
    this.isShow = !this.isShow    
    }
  else{
    this.isShow = true  
  }
  // //console.log(this.isShow)
  this.elementName = e.target.dataset.bsTarget.replace("#","")
}


}
