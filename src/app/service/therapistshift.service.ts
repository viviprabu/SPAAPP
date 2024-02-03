import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TherapistShift } from '../model/therapistShift';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TherapistshiftService {

  constructor(private httpClient:HttpClient) { }

  baseUrl: string = environment.baseUrl+"TherapistShift";

  getTherapistShift():Observable<TherapistShift[]>
  {
    return this.httpClient.get<TherapistShift[]>(this.baseUrl);
  }
  createTherapistShift(ctry:TherapistShift):Observable<TherapistShift>
  {
    
    return this.httpClient.post<TherapistShift>(this.baseUrl,ctry);
  }

  updateTherapistShift(ctry:TherapistShift):Observable<TherapistShift>
  {
    return this.httpClient.put<TherapistShift>(this.baseUrl+"/"+ctry.id,ctry);
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
