import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentlayoutComponent } from './contentlayout/contentlayout.component';
import { content } from './contentlayout/content';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './guard/guard.guard';
import { ResetComponent } from './reset/reset.component';






  const routes: Routes = [

    {path: '', redirectTo: 'login', pathMatch: "full"},
    {path:'', component: ContentlayoutComponent, children:content,canActivate:[AuthGuard]},
    {path:'contentlayout', component: ContentlayoutComponent,canActivate:[AuthGuard]},
    {path:'login', component: LoginComponent},
    {path:'signup', component: SignupComponent},
    {path:'reset', component: ResetComponent},


  ]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
