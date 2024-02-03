import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country, countryChecked } from '../model/country';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  getCountryList() {
    throw new Error('Method not implemented.');
  }

  constructor(private httpClient: HttpClient) { }

  baseUrl: string = environment.baseUrl+"Country";

  getCountry():Observable<Country[]>
  {
    return this.httpClient.get<Country[]>(this.baseUrl);
  }
  createCountry(ctry:Country):Observable<Country>
  {
    return this.httpClient.post<Country>(this.baseUrl,ctry);
  }

  updateCountry(ctry:Country):Observable<Country>
  {
    return this.httpClient.put<Country>(this.baseUrl+"/"+ctry.id,ctry);
  }
  deleteCountry(ctry:Country):Observable<Country>
  {
    return this.httpClient.put<Country>(this.baseUrl+"/Delete/"+ctry.id,ctry);
  }
  deleteAllCountry(countries: countryChecked[]):Observable<Country[]>
  {
    return this.httpClient.put<Country[]>(this.baseUrl+"/deleteSelected", countries);
  }

}
