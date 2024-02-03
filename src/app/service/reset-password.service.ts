import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResetPassword } from '../model/reset-password';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
private baseUrl : string=environment.baseUrl+"User";
  constructor(private http: HttpClient) { }

sendResetPasswordLink(email:string)
{
return this.http.post<any>(`${this.baseUrl}/send-reset-email/${email}`,{});
}
resetPassword(resetPasswordObj : ResetPassword)
{
  console.log(resetPasswordObj)
  return this.http.post<any>(`${this.baseUrl}/reset-password`,resetPasswordObj);
}
}
