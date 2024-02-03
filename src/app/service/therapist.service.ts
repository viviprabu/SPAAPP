import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Therapist } from '../model/therapist';
import { Branch } from '../model/branch';
import { environment } from '../../environments/environment';
import { GetTherapistShift } from '../model/GetTherapistShift';

@Injectable({
  providedIn: 'root'
})
export class TherapistService {

  constructor(private httpClient:HttpClient) { }

  baseUrl: string = environment.baseUrl+"Therapist";

  getTherapist():Observable<Therapist[]>
  {
    return this.httpClient.get<Therapist[]>(this.baseUrl);
  }
  createTherapist(ctry:Therapist):Observable<Therapist>
  {
    
    return this.httpClient.post<Therapist>(this.baseUrl,ctry);
  }

  updateTherapist(ctry:Therapist):Observable<Therapist>
  {
    return this.httpClient.put<Therapist>(this.baseUrl+"/"+ctry.id,ctry);
  }
  deleteTherapist(ctry:Therapist):Observable<Therapist>
  {
    return this.httpClient.put<Therapist>(this.baseUrl+"/Delete/"+ctry.id,ctry);
  }
  getTherapistShift(brId:number):Observable<GetTherapistShift[]>
  {
    
    return this.httpClient.post<GetTherapistShift[]>(this.baseUrl+'/GetTherapistShift/',brId);
  }
  // getTherapistByBranch(br:Branch):Observable<Therapist[]>
  // {
  //   return this.httpClient.get<Therapist[]>(this.baseUrl+"/Branch/"+br.id)
  // }
}
