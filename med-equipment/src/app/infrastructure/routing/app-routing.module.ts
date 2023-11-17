import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/app/authentication/login/login.component';
import { RegistrationComponent } from 'src/app/authentication/registration/registration.component';
import { UserProfileComponent } from 'src/app/feature-modules/user/user-profile/user-profile.component';
import { HomeComponent } from 'src/app/layout/home/home.component';
import { CompanyProfileComponent } from "../../feature-modules/company/company-profile/company-profile.component";
import {CompanyListComponent} from "../../feature-modules/company/company-list/company-list.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'user/profile', component: UserProfileComponent },
  { path: 'companies', component: CompanyListComponent },
  { path: 'company/:id', component: CompanyProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
