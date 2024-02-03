import { Role } from './../model/role';
import { Injectable, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Router } from '@angular/router';
import { Token } from '@angular/compiler';
import { EMPTY, Observable, ReplaySubject, empty, map } from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import { TokenApiModel } from '../model/token-api.model';
import { Users } from '../model/users';
import { environment } from '../../environments/environment';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // baseUrl : string = environment.baseUrl+"User";
  baseUrl:string = 'https://localhost:7141/api/User'
  private userPayLoad:any;
  private tokenSource = new ReplaySubject<string>(1)
  // token$ = this.tokenSource.asObservable();
  token : any;
  fullName: any;
  getTokenValue:string="";
  getRefreshTokenValue:string="";
  userDetail:any;
 
  private userDetailSource = new ReplaySubject<Users>(1);
  userDetail$ = this.userDetailSource.asObservable();


  

  constructor(private http: HttpClient,private router: Router)
   {
    // this.dbService.getAll('loginToken').subscribe((tkn:any)=>{
    //   this.getTokenValue = tkn[0].token
    // })
    this.userPayLoad = this.getDecodedAccessToken(localStorage.getItem('token'));
    // console.log(this.userPayLoad)

    }

   signup(userObj: any)
   {
    // console.log(userObj)
    return this.http.post<any>(`${this.baseUrl}/register`,userObj);

   }

  updateUser(usr:Users):Observable<Users>
{
  // console.log(usr)
  return this.http.put<Users>(this.baseUrl+"/Modify/"+usr.id,usr);
}
deleteUser(usr:Users):Observable<Users>
{
  return this.http.put<Users>(this.baseUrl+"/delete/"+usr.id,usr);
}
   login(loginObj:any)
   {
    // //console.log(loginObj)
     return this.http.post<any>(`${this.baseUrl}/authenticate`,loginObj)
    //  return this.http.post<any>(`${this.baseUrl}authenticate`,loginObj).pipe(
    //   map(x=>{
    //     localStorage.setItem('token', x.token)
    //     this.tokenSource.next(x.token);
    //   })
    //  )

   }

   setUserDetail(user: Users){
    // console.log(user)
    this.userDetailSource.next(user);
   }

   signOut()
   {
    
    this.router.navigate(['login']);
    localStorage.clear();
    this.userDetail$ = EMPTY

   }
   storeToken(tokenValue: string)
   {
    localStorage.setItem('token',tokenValue);
  //  this.dbService.add('token',{token:tokenValue,refreshToken:""})
   }
   storeUserDetail(userDetailValue)
   {
  localStorage.setItem('userDetail',JSON.stringify(userDetailValue))
   }
  
   getUserDetail()
   {
    return localStorage.getItem('userDetail')
   }
  
   storeRefreshToken(tokenValue: string)
   {
    localStorage.setItem('refreshToken',tokenValue);
    // this.dbService.add('loginToken',{token:tokenValue,refreshToken:tokenValue}).subscribe(refreshToken=>{
    //   console.log(refreshToken)
    //  })
   }

   getRefreshToken()
   {
    return localStorage.getItem('refreshToken');

      // return this.dbService.getAll('token').subscribe((key:any)=>{
      //   this.getTokenValue = key[0].token
      // })
   }
   getToken()
   {
    // this.dbService.getAll('loginToken').subscribe((token:any)=>{
    //   console.log(this.getTokenValue)
    //  this.getTokenValue = token[0].token
    //  return this.getTokenValue
    // })
    return localStorage.getItem('token');

   }

 
   isLoggedIn(): boolean{
    // this.dbService.getAll('loginToken').subscribe((token:any)=>{
    //   console.log(this.getTokenValue)
    //  this.getTokenValue = token[0].token})
    
    return !!  localStorage.getItem('token')
    
    
    // localStorage.getItem('token')
   }
   getAllUsers():Observable<Users[]>
   {
    return this.http.get<Users[]>(`${this.baseUrl}/get`);
   }
   checkExistingUser(phone:string):Observable<Users[]>
   {
    
    return this.http.get<Users[]>(this.baseUrl+'/CheckExistingUser?phone='+phone)

   }
   getUsersByRole(roleName:string):Observable<Users[]>
   {
    return this.http.get<Users[]>(this.baseUrl+'/GetUsersByRole?roleName='+roleName)
   }
   getUsersById(id:number):Observable<Users[]>
   {
    return this.http.get<Users[]>(this.baseUrl+'/'+id)
   }
  // tokenDecode()
  // {
  //   const jwtHelper = new JwtHelperService()
  //   const tkn = localStorage.getItem('token')
  //   //console.log(tkn)
  //   //console.log(jwtHelper.decodeToken(this.token))
  //   return jwtHelper.decodeToken(this.token)
  // }
  getDecodedAccessToken(token: string): any {
    try {
      // //console.log(jwtDecode(token))
      return jwtDecode(token);

    } catch(Error) {
      return null;
    }
  }
  getFullNamefromToken()
  {
    if(this.userPayLoad)
  return this.userPayLoad.unique_name; // //console.log(this.fullName)
  }
  getRoleFromToken()
  {
    if(this.userPayLoad)
    return this.userPayLoad.role;

  }
 
// getUsers():Observable<Users[]>
// {
//   return this.http.get<Users[]>(this.baseUrl+'get/');
// }

renewToken(tokenApi: TokenApiModel)
{
  // //console.log(tokenApi)
return this.http.post<any>(`${this.baseUrl}refresh`,tokenApi);

}


}
