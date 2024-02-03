import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../model/transaction';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private httpClient:HttpClient) { }
  baseUrl: string = environment.baseUrl+'Transaction';

getTransaction():Observable<Transaction[]>
{
  return this.httpClient.get<Transaction[]>(this.baseUrl);
}
createTransaction(tr:Transaction):Observable<Transaction>
{
  console.log(tr)
  return this.httpClient.post<Transaction>(this.baseUrl,tr);
}

updateTransaction(tr:Transaction):Observable<Transaction>
{
  return this.httpClient.put<Transaction>(this.baseUrl+"/Modify/"+tr.id,tr);
}
deleteTransaction(tr:Transaction):Observable<Transaction>
{
  return this.httpClient.put<Transaction>(this.baseUrl+"/Delete/"+tr.id,tr);
}
getUserByPhone(phone:string):Observable<Transaction[]>
{
  // console.log(phone)
  return this.httpClient.get<Transaction[]>(this.baseUrl+'/GetUserByPhone?phone='+phone)
}

}
