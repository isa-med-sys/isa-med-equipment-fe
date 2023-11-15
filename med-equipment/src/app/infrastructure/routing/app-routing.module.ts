import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/app/authentication/login/login.component';
import { RegistrationComponent } from 'src/app/authentication/registration/registration.component';
import { EquipmentComponent } from 'src/app/feature-modules/marketplace/equipment/equipment.component';
import { HomeComponent } from 'src/app/layout/home/home.component';

const routes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'login', component: LoginComponent },
  {path: 'registration', component: RegistrationComponent },
  {path: 'equipment', component: EquipmentComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { 
  
}