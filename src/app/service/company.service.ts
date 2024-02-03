import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from '../model/company';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private httpClient:HttpClient) { }

  baseUrl: string = environment.baseUrl+"Company";



getCompany():Observable<Company[]>
{
  return this.httpClient.get<Company[]>(this.baseUrl);
}

createCompany(br:Company):Observable<Company>
{
  console.log(br)
  return this.httpClient.post<Company>(this.baseUrl,br);
}

updateCompany(br:Company):Observable<Company>
{
  return this.httpClient.put<Company>(this.baseUrl+"/"+br.id,br);
}
deleteCompany(br:Company):Observable<Company>
{
  return this.httpClient.put<Company>(this.baseUrl+"/Delete/"+br.id,br);
}
getCOmpanyById(br:Company):Observable<Company>
{
  return this.httpClient.get<Company>(this.baseUrl+"/"+br.id);
}
}
