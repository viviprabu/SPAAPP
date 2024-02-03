import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserBranch } from '../model/userbranch';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserbranchService {

  constructor(private httpClient: HttpClient) { }
  baseUrl:string = environment.baseUrl+"UserBranch";

  getUserBranch():Observable<UserBranch[]>
  {
    // var retObj =
    return this.httpClient.get<UserBranch[]>(this.baseUrl);
    // retObj.subscribe(x=> //console.log(x))
    // return retObj;
  }
  CreateUserBranch(ubr:UserBranch):Observable<UserBranch>
{

  return this.httpClient.post<UserBranch>(this.baseUrl,ubr);
}

updateTransaction(ubr:UserBranch):Observable<UserBranch>
{
  return this.httpClient.put<UserBranch>(this.baseUrl+"/"+ubr.id,ubr);
}
deleteTransaction(ubr:UserBranch):Observable<UserBranch>
{
  return this.httpClient.put<UserBranch>(this.baseUrl+"/Delete/"+ubr.id,ubr);
}

}
