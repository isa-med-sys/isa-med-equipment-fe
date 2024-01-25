import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/app/authentication/login/login.component';
import { RegistrationComponent } from 'src/app/authentication/registration/registration.component';
import { RegisteredUserProfileComponent } from 'src/app/feature-modules/administration/registered-user-profile/registered-user-profile.component';
import { EquipmentComponent } from 'src/app/feature-modules/marketplace/equipment/equipment.component';
import { HomeComponent } from 'src/app/layout/home/home.component';
import { CompanyProfileComponent } from "../../feature-modules/company/company-profile/company-profile.component";
import { SystemAdminProfileComponent } from 'src/app/feature-modules/administration/system-admin-profile/system-admin-profile.component';
import { CompanySearchComponent } from 'src/app/feature-modules/company/company-search/company-search.component';
import { ChangePasswordComponent } from 'src/app/feature-modules/administration/change-password/change-password.component';
import { CompanyAdminProfileComponent } from 'src/app/feature-modules/administration/company-admin-profile/company-admin-profile.component';
import { CalendarComponent } from 'src/app/feature-modules/administration/calendar/calendar.component';
import { ReservationHistoryComponent } from 'src/app/feature-modules/reservation/reservation-history/reservation-history.component';
import { OrderTakingComponent } from 'src/app/feature-modules/administration/order-taking/order-taking.component';
import { PickupHistoryComponent } from 'src/app/feature-modules/reservation/pickup-history/pickup-history.component';
import { DeliveryComponent } from 'src/app/feature-modules/administration/delivery/delivery.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'equipment', component: EquipmentComponent },
  { path: 'user/profile', component: RegisteredUserProfileComponent },
  { path: 'user/reservations', component: ReservationHistoryComponent },
  { path: 'user/pickups', component: PickupHistoryComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'admin/profile', component: SystemAdminProfileComponent},
  { path: 'company-admin/profile', component: CompanyAdminProfileComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'orders', component: OrderTakingComponent },
  { path: 'companies', component: CompanySearchComponent },
  { path: 'company/:id', component: CompanyProfileComponent },
  { path: 'delivery', component: DeliveryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}