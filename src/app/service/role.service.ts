import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../model/role';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpClient:HttpClient) { }
  baseUrl: string = environment.baseUrl+"Role";

getRole():Observable<Role[]>
{
  return this.httpClient.get<Role[]>(this.baseUrl);
}
createRole(br:Role):Observable<Role>
{
  
  return this.httpClient.post<Role>(this.baseUrl,br);
}

updateRole(br:Role):Observable<Role>
{
  return this.httpClient.put<Role>(this.baseUrl+"/"+br.id,br);
}
deleteRole(br:Role):Observable<Role>
{
  return this.httpClient.put<Role>(this.baseUrl+"/Delete/"+br.id,br);
}

}
