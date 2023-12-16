import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from 'src/app/shared/model/company';
import { CompanyAdmin } from 'src/app/shared/model/company-admin';
import { SystemAdmin } from 'src/app/shared/model/system-admin';
import { RegisteredUser } from 'src/app/shared/model/registered-user';
import { environment } from 'src/env/environment';
import { Equipment } from "../../shared/model/equipment";
import { Calendar } from 'src/app/shared/model/calendar';
import {TimeSlot} from "../../shared/model/timeslot";

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(environment.apiHost + 'companies/temp'); //temp a mozda i ne
  }

  addCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(environment.apiHost + 'companies', company);
  }

  addAdmin(admin:CompanyAdmin): Observable<CompanyAdmin> {
    return this.http.post<CompanyAdmin>(environment.apiHost + 'users/register-company-admin', admin);
  }

  addSysAdmin(admin:SystemAdmin): Observable<SystemAdmin> {
    return this.http.post<SystemAdmin>(environment.apiHost + 'users/register-system-admin', admin);
  }

  getAdminsByCompanyId(companyId: number): Observable<CompanyAdmin[]> {
    return this.http.get<CompanyAdmin[]>(environment.apiHost + `companies/${companyId}/admins`);
  }

  getRegisteredUser(id: number): Observable<RegisteredUser> {
    return this.http.get<RegisteredUser>(environment.apiHost + `users/${id}`);
  }

  updateRegisteredUser(id: number, registeredUser: RegisteredUser): Observable<RegisteredUser> {
    return this.http.put<RegisteredUser>(environment.apiHost + `users/${id}`, registeredUser);
  }

  getCompanyAdmin(id: number): Observable<CompanyAdmin> {
    return this.http.get<CompanyAdmin>(environment.apiHost + `users/${id}`);
  }

  updateCompanyAdmin(id: number, companyAdmin: CompanyAdmin): Observable<CompanyAdmin> {
    return this.http.put<CompanyAdmin>(environment.apiHost + `users/${id}`, companyAdmin);
  }

  updateCompany(id: number, company: Company): Observable<Company> {
    return this.http.put<Company>(environment.apiHost + `companies/update/${id}`, company);
  }

  getAllAdmins(id: number): Observable<CompanyAdmin[]> {
    return this.http.get<CompanyAdmin[]>(environment.apiHost + `companies/${id}/admins`);
  }

  changePassword(id: number, pass: string): Observable<Boolean> {
    return this.http.put<Boolean>(environment.apiHost + `users/password/${id}`, pass);
  }

  getEquipment(id: number): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(environment.apiHost + `companies/${id}/equipment`);
  }

  updateEquipmentInCompany(id: number, equipment: Equipment[]): Observable<any> {
    return this.http.put<any>(environment.apiHost + `companies/update/${id}/equipment`, equipment);
  }

  addEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(environment.apiHost + `equipment`, equipment);
  }

  updateEquipment(id: number, equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(environment.apiHost + `equipment/update/${id}`, equipment);
  }

  getCalendar(id: number): Observable<Calendar> {
    return this.http.get<Calendar>(environment.apiHost + `calendars`+ `?companyId=${id}`);
  }

  addTimeSlot(timeSlot: TimeSlot): Observable<TimeSlot> {
    return this.http.post<TimeSlot>(environment.apiHost + `calendars/time-slots`, timeSlot);
  }
}
