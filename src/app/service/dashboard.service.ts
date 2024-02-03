import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TherapistSales } from '../model/therapistSales';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) { }
  baseUrl:string=environment.baseUrl+"Dashboard";

  getTherapistSales():Observable<TherapistSales[]>
  {
    return this.httpClient.get<TherapistSales[]>(this.baseUrl);
  }
}
