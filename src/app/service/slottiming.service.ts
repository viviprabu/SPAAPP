import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SlotTiming } from '../model/slottiming';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SlotTimingService {

  constructor(private httpClient:HttpClient) { }
  baseUrl: string = environment.baseUrl+"SlotTiming";

  getSlots():Observable<SlotTiming[]>
  {
    return this.httpClient.get<SlotTiming[]>(this.baseUrl);
  }
  createSlots(slt:SlotTiming):Observable<SlotTiming>
  {
    
    return this.httpClient.post<SlotTiming>(this.baseUrl,slt);
  }

  updateSlots(slt:SlotTiming):Observable<SlotTiming>
  {
    return this.httpClient.put<SlotTiming>(this.baseUrl+"/"+slt.id,slt);
  }
 
}
