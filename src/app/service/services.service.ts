import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Services } from '../model/services';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private httpClient:HttpClient) { }

  baseUrl: string = environment.baseUrl+"Service";

  getService():Observable<Services[]>
  {
    return this.httpClient.get<Services[]>(this.baseUrl);
  }
  createService(br:Services):Observable<Services>
  {
    
    return this.httpClient.post<Services>(this.baseUrl,br);
  }

  updateService(br:Services):Observable<Services>
  {
    return this.httpClient.put<Services>(this.baseUrl+"/"+br.id,br);
  }
  deleteService(br:Services):Observable<Services>
  {
    return this.httpClient.put<Services>(this.baseUrl+"/Delete/"+br.id,br);
  }

}
