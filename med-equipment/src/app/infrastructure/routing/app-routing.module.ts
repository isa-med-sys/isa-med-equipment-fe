import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/app/authentication/login/login.component';
import { RegistrationComponent } from 'src/app/authentication/registration/registration.component';
import { UserProfileComponent } from 'src/app/feature-modules/user/user-profile/user-profile.component';
import { HomeComponent } from 'src/app/layout/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent }, 
  { path: 'registration', component: RegistrationComponent },
  { path: 'user/profile', component: UserProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { 
  
}