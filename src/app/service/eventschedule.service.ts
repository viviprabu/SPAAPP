import { Injectable } from '@angular/core';
import { Observable, scheduled } from 'rxjs';
import { EventSchedule } from '../model/eventschedule';
import { HttpClient } from '@angular/common/http';
import { EventSourceFuncArg } from '@fullcalendar/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventScheduleService {

  constructor(private httpClient: HttpClient) { }

  baseUrl:string = environment.baseUrl+ "EventSchedule";

  getEvents(): Observable<EventSchedule[]>
  {
    
     return this.httpClient.get<EventSchedule[]>(this.baseUrl);
  }
  createEvent(evnt: EventSchedule): Observable<EventSchedule>
  {

     return this.httpClient.post<EventSchedule>(this.baseUrl,evnt);
  }
  UpdateEvent(evnt: EventSchedule): Observable<EventSchedule>
  {
    
   return this.httpClient.put<EventSchedule>(this.baseUrl+"/"+evnt.id,evnt)
  }
  DeleteEvent(evnt: EventSchedule): Observable<EventSchedule>
  {
   return this.httpClient.put<EventSchedule>(this.baseUrl+"/Delete/"+evnt.id,evnt);
  }
  getAvailabilityTime(current:Date):Observable<EventSchedule[]>
  {
       return this.httpClient.post<EventSchedule[]>(this.baseUrl+'/GetAvailability/',current)
  }
  getEventById(uId:number):Observable<EventSchedule[]>
  {
    
    return this.httpClient.get<EventSchedule[]>(this.baseUrl+'/GetEventByUser/'+ uId)
  }
  getAvailableTimeList(sId:number,shlDate:Date):Observable<EventSchedule[]>
  {
    
    return this.httpClient.post<EventSchedule[]>(this.baseUrl+'/AvailableTimeList?serviceId='+sId,shlDate)
  }
  getEventByEventsId(id:number):Observable<EventSchedule>
  {
    return this.httpClient.get<EventSchedule>(this.baseUrl+'/GetEventByEventsId/'+id)
  }

  
}
