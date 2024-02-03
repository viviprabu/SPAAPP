import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Branch, BranchList } from './model/branch';
import { UserStoreService } from './service/user-store.service';
import { AuthService } from './service/auth.service';
import { RoleService } from './service/role.service';
import { Users } from './model/users';
import { Role } from './model/role';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private message = new BehaviorSubject('');
  private compName = new BehaviorSubject('');
  public branchId = new BehaviorSubject<number>(0);
  public serviceId = new BehaviorSubject<number>(0);
  public price = new BehaviorSubject<number>(0);
  public serviceTime = new BehaviorSubject<number>(0);
  private currencyCode = new BehaviorSubject('');
  private serviceName = new BehaviorSubject('');
  public branchList = new BehaviorSubject<Array<any>>([]);
  public showHome = new BehaviorSubject<boolean>(false);
  public scheduleDate = new BehaviorSubject<Date>(new Date());
  public isHide = new BehaviorSubject<boolean>(false);

  getIsHide = this.isHide.asObservable();
  getScheduleDate = this.scheduleDate.asObservable();
  getShowHome = this.showHome.asObservable();
  getServiceId = this.serviceId.asObservable();
  getPrice = this.price.asObservable();
  getServiceTime = this.serviceTime.asObservable();
  getCurrencyCode = this.currencyCode.asObservable();
  getServiceName = this.serviceName.asObservable();

  getbranchList = this.branchList.asObservable();
  getBranchName = this.branchId.asObservable();
  getMessage = this.message.asObservable();
  getCompName = this.compName.asObservable();
  public username = new BehaviorSubject('');
public roleName = new BehaviorSubject('')
getUsername = this.username.asObservable();
getRoleName = this.roleName.asObservable();

  userId:number=0;
  uname:string="";
  role:string=""
  fullName:string="";
  userDto:Users[]=[];
  roleDto:Role[]=[];
  rlName:string="";

  constructor(private userStore: UserStoreService, private auth:AuthService,private roleService: RoleService) { }

  setMessage(message:string,compName:string)
  {
    this.message.next(message);
    this.compName.next(compName);
  }
  setBranchList(branchList:Branch[])
  {

    this.branchList.next(branchList)
  }
  setUsername(username:string)
{
  this.username.next(username)
}
setRoleName(roleName:string)
{
  this.roleName.next(roleName)
}
 
setServiceId(serviceId:number)
{
  this.serviceId.next(serviceId)
  
}
setPrice(price:number)
{
  this.price.next(price)
}
setCurrencyCode(currencyCode:string)
{
  this.currencyCode.next(currencyCode)
}
setServiceTime(serviceTime:number)
{
  this.serviceTime.next(serviceTime)
}
setServiceName(serviceName:string)
{
  this.serviceName.next(serviceName)
}
setShowHome(showHome:boolean)
{
  this.showHome.next(showHome)
}
setScheduleDate(scheduleDate: Date)
{
  this.scheduleDate.next(scheduleDate)
}
setIsHide(isHide:boolean)
{
  this.isHide.next(isHide)
}

}
