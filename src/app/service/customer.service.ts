import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../model/customer';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private httpClient: HttpClient) { }

  baseUrl:string = environment.baseUrl+"Customer";

   getCustomer(): Observable<Customer[]>
   {
      return this.httpClient.get<Customer[]>(this.baseUrl);
   }
   createCustomer(cust: Customer): Observable<Customer>
   {
      return this.httpClient.post<Customer>(this.baseUrl,cust);
   }
   updateCustomer(cust: Customer): Observable<Customer>
   {
    
    return this.httpClient.put<Customer>(this.baseUrl+"/"+cust.id,cust)
   }
   deleteCustomer(cust: Customer): Observable<Customer>
   {
    return this.httpClient.put<Customer>(this.baseUrl+"/Delete/"+cust.id,cust);
   }


}
