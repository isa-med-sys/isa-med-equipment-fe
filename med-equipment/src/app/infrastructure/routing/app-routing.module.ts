import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/app/authentication/login/login.component';
import { RegistrationComponent } from 'src/app/authentication/registration/registration.component';
import { UserProfileComponent } from 'src/app/feature-modules/user/user-profile/user-profile.component';
import { EquipmentComponent } from 'src/app/feature-modules/marketplace/equipment/equipment.component';
import { HomeComponent } from 'src/app/layout/home/home.component';
import { CompanyProfileComponent } from "../../feature-modules/company/company-profile/company-profile.component";
import { SystemAdminProfileComponent } from 'src/app/feature-modules/administration/system-admin-profile/system-admin-profile.component';
import { CompanySearchComponent } from 'src/app/feature-modules/company/company-search/company-search.component';
import { CompanyAdminProfileComponent } from "../../feature-modules/user/company-admin-profile/company-admin-profile.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'equipment', component: EquipmentComponent },
  { path: 'user/profile', component: UserProfileComponent },
  { path: 'admin/profile', component: SystemAdminProfileComponent},
  { path: 'company-admin/profile', component: CompanyAdminProfileComponent },
  { path: 'companies', component: CompanySearchComponent },
  { path: 'company/:id', component: CompanyProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
