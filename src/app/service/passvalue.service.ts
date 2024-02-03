import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Branch } from '../model/branch';
import { UserStoreService } from './user-store.service';
import { AuthService } from './auth.service';
import { RoleService } from './role.service';

@Injectable({
  providedIn: 'root'
})
export class PassvalueService{
public isHide = new BehaviorSubject<boolean>(false);
public margin = new BehaviorSubject(0);
public width = new BehaviorSubject(0);
public invoice = new BehaviorSubject('');
public displayHeader = new BehaviorSubject('');
public scheduleDate = new BehaviorSubject<Date>(null);
public eventId = new BehaviorSubject(0);
public isModify = new BehaviorSubject<boolean>(false);
public isApproved = new BehaviorSubject<boolean>(false);
public isShow = new BehaviorSubject<boolean>(false);
public name = new BehaviorSubject('');
public gender = new BehaviorSubject('');
public phone = new BehaviorSubject('');
public branchId = new BehaviorSubject<number>(0);
public timeSlot = new BehaviorSubject<number>(0)
public eventHeight = new BehaviorSubject<number>(0)
public formHeader = new BehaviorSubject('Home');

getEventHeight = this.eventHeight.asObservable();
getTimeSlot = this.timeSlot.asObservable();
getBranchId = this.branchId.asObservable();
getName = this.name.asObservable();
getGender = this.gender.asObservable();
getPhone = this.phone.asObservable();
getIsShow = this.isShow.asObservable();
getIsApproved = this.isApproved.asObservable();
getIsModify = this.isModify.asObservable();
getEventId = this.eventId.asObservable();
getScheduleDate = this.scheduleDate.asObservable();
getdisplayHeader = this.displayHeader.asObservable();
getInvoice = this.invoice.asObservable();
getBoolean = this.isHide.asObservable();
getWidth = this.width.asObservable();
getMargin = this.margin.asObservable();

getformHeader = this.formHeader.asObservable();

  constructor() {

  }

  setBoolean(isHide:boolean,margin:number,width:number)
  {
    this.isHide.next(isHide);
    this.margin.next(margin);
    this.width.next(width);
  }
  setformHeader(formHeader:string)
  {
    this.formHeader.next(formHeader)
  }
  setInvoiceNumber(invoice : string)
  {
    this.invoice.next(invoice);
  }
  setdisplayHeader(displayHeader:string)
  {
    this.displayHeader.next(displayHeader)
  }
  setScheduleDate(scheduleDate: Date)
  {
    this.scheduleDate.next(scheduleDate);
  }
  setEventId(eventId:number)
  {
    this.eventId.next(eventId)
  }
  setIsModify(isModify: boolean)
  {
    this.isModify.next(isModify)
  }
  setIsApproved(isApproved: boolean)
  {
    this.isApproved.next(isApproved)
  }
  setIsShow(isShow: boolean)
  {
    this.isApproved.next(isShow)
  }
  setName(name:string)
  {
    this.name.next(name);
  }
  setGender(gender:string)
  {
    this.gender.next(gender);
   
  }
  setPhone(phone:string)
  {
    this.phone.next(phone);
    
  }
  setBranchId(branchId:number)
  {
    this.branchId.next(branchId);
  }
  setTimeSlot(timeSlot:number)
  {
    this.timeSlot.next(timeSlot)
  }
  setEventHeight(eventHeight: number)
  {
    this.eventHeight.next(eventHeight)
  }

 
    
}
