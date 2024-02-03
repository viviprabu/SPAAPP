import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TokenApiModel } from '../model/token-api.model';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    var myToken:any = this.auth.getToken();
    // var myToken:any = localStorage.getItem("token"); //this.auth.getToken();

    // //console.log(myToken)
    if(myToken)
    {
      request = request.clone({setHeaders:{["Authorization"]: `Bearer${myToken}`}})
    }
    return next.handle(request).pipe(
      catchError((err:any)=>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 401)
          {
           this.handleUnauthorizedError(request,next);

          }

        }
        return throwError(()=> err);
      })
    );
  }

 handleUnauthorizedError(req:HttpRequest<any>, next:HttpHandler)
 {
  let tokenApiModel:any = new TokenApiModel();
  tokenApiModel.accessToken = this.auth.getToken()!;  
  tokenApiModel.refreshToken = this.auth.getRefreshToken()!;
  
  

  this.auth.renewToken(tokenApiModel)
  .pipe(
    switchMap((data:TokenApiModel)=>{
      this.auth.storeRefreshToken(data.refreshToken);
      this.auth.storeToken(data.accessToken);
      
      
      
      req = req.clone(
        {setHeaders:{["Authorization"]: `Bearer ${data.accessToken}`}
      })
      return next.handle(req);
    }),
    catchError((err)=>{
      return throwError(()=>{
        Swal.fire({
              title: "Error",
              text: "Token is Expired Login again",
              icon: "warning"
            });
            this.router.navigate(['login']);

      })
    })
  )

 }


}



