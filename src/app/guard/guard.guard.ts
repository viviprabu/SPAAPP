import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  constructor(private auth: AuthService,private router: Router)
  {

  }
  canActivate(): boolean  {
    if(this.auth.isLoggedIn())
    {

      return true;
    }
    else
    {
      // this.toast.error({detail:"ERROR",summary:"Please Login First"});
      Swal.fire("Please login first")

      this.router.navigate(['login'])
      return false;
    }
  }

}
