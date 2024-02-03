import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Branch } from '../model/branch';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(private httpClient:HttpClient) { }

  baseUrl: string = environment.baseUrl+"Branch";



getBranch():Observable<Branch[]>
{
  return this.httpClient.get<Branch[]>(this.baseUrl);
}
getBranchForUser():Observable<Branch[]>
{
  return this.httpClient.get<Branch[]>(this.baseUrl+'/get');
}
createBranch(br:Branch):Observable<Branch>
{
  
  return this.httpClient.post<Branch>(this.baseUrl,br);
}

updateBranch(br:Branch):Observable<Branch>
{
  
  return this.httpClient.put<Branch>(this.baseUrl+"/"+br.id,br);
}
deleteBranch(br:Branch):Observable<Branch>
{
  return this.httpClient.put<Branch>(this.baseUrl+"/Delete/"+br.id,br);
}
getBranchById(br:Branch):Observable<Branch>
{
  return this.httpClient.get<Branch>(this.baseUrl+"/"+br.id);
}
getBranchByUsername(username:string):Observable<Branch[]>
{
  return this.httpClient.get<Branch[]>(this.baseUrl+'/GetBranchByUsername?Username='+ username)
}

}
