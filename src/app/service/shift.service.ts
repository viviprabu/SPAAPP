import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Shift } from '../model/shift';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

  constructor(private httpClient:HttpClient) { }

  baseUrl: string = environment.baseUrl+"Shift";

  getShift():Observable<Shift[]>
  {
    
    return this.httpClient.get<Shift[]>(this.baseUrl);
  }
  createShift(ctry:Shift):Observable<Shift>
  {
    
    return this.httpClient.post<Shift>(this.baseUrl,ctry);
  }

  updateShift(ctry:Shift):Observable<Shift>
  {
    return this.httpClient.put<Shift>(this.baseUrl+"/"+ctry.id,ctry);
  }
  // deleteTherapist(ctry:Shift):Observable<Shift>
  // {
  //   return this.httpClient.put<Shift>(this.baseUrl+"/Delete/"+ctry.id,ctry);
  // }

  // getTherapistByBranch(br:Branch):Observable<Therapist[]>
  // {
  //   return this.httpClient.get<Therapist[]>(this.baseUrl+"/Branch/"+br.id)
  // }
}
