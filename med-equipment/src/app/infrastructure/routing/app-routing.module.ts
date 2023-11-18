import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/app/authentication/login/login.component';
import { RegistrationComponent } from 'src/app/authentication/registration/registration.component';
import { UserProfileComponent } from 'src/app/feature-modules/user/user-profile/user-profile.component';
import { EquipmentComponent } from 'src/app/feature-modules/marketplace/equipment/equipment.component';
import { HomeComponent } from 'src/app/layout/home/home.component';
import { CompanyProfileComponent } from "../../feature-modules/company/company-profile/company-profile.component";
import {CompanyListComponent} from "../../feature-modules/company/company-list/company-list.component";
import { SystemAdminProfileComponent } from 'src/app/feature-modules/administration/system-admin-profile/system-admin-profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'equipment', component: EquipmentComponent },
  { path: 'user/profile', component: UserProfileComponent },
  { path: 'companies', component: CompanyListComponent },
  { path: 'company/:id', component: CompanyProfileComponent },
  { path: 'admin/profile', component: SystemAdminProfileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
