import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Currency } from '../model/currency';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private httpClient:HttpClient) { }
  baseUrl: string = environment.baseUrl+"Currency";

  getCurrency():Observable<Currency[]>
  {
    return this.httpClient.get<Currency[]>(this.baseUrl);
  }
  createCurrency(curn:Currency):Observable<Currency>
  {
    return this.httpClient.post<Currency>(this.baseUrl,curn);
  }

  updateCurrency(curn:Currency):Observable<Currency>
  {
    return this.httpClient.put<Currency>(this.baseUrl+"/"+curn.id,curn);
  }
 

}
