import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from '../model/payment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private httpClient:HttpClient) { }
  baseUrl: string = environment.baseUrl+"Payment";

  getPayment():Observable<Payment[]>
  {
    return this.httpClient.get<Payment[]>(this.baseUrl);
  }
  createPayment(pay:Payment):Observable<Payment>
  {
    return this.httpClient.post<Payment>(this.baseUrl,pay);
  }

  updatePayment(pay:Payment):Observable<Payment>
  {
    return this.httpClient.put<Payment>(this.baseUrl+"/"+pay.id,pay);
  }
  deletePayment(pay:Payment):Observable<Payment>
  {
    return this.httpClient.put<Payment>(this.baseUrl+"/Delete/"+pay.id,pay);
  }

}
