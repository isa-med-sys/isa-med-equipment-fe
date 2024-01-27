import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from 'src/app/shared/model/company';
import { CompanyAdmin } from 'src/app/shared/model/company-admin';
import { SystemAdmin } from 'src/app/shared/model/system-admin';
import { RegisteredUser } from 'src/app/shared/model/registered-user';
import { environment } from 'src/env/environment';
import { Equipment } from "../../shared/model/equipment";
import { Calendar } from 'src/app/shared/model/calendar';
import { CompanyCalendar } from 'src/app/shared/model/company-calendar';
import { TimeSlot } from "../../shared/model/timeslot";
import { Reservation } from 'src/app/shared/model/reservation';
import {PagedResults} from "../../shared/model/paged-results.model";
import { Contract } from 'src/app/shared/model/contract';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(environment.apiHost + 'companies/temp'); //temp a mozda i ne
  }

  addCompany(companyCalendar: CompanyCalendar): Observable<Company> {
    return this.http.post<Company>(environment.apiHost + 'companies', companyCalendar);
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

  getAllAdminIds(id: number): Observable<number[]> {
    return this.http.get<number[]>(environment.apiHost + `companies/${id}/admin-ids`);
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

  getReservationByTimeSlotId(id: number): Observable<RegisteredUser> {
    return this.http.get<RegisteredUser>(environment.apiHost + `reservations/timeslot/${id}`);
  }

  addTimeSlot(companyId: number, timeSlot: TimeSlot): Observable<TimeSlot> {
    const params = new HttpParams().set('companyId', companyId.toString());
    return this.http.post<TimeSlot>(environment.apiHost + `calendars/time-slots`, timeSlot, { params });
  }

  canUpdateEquipment(id: number, equipment: Equipment): Observable<boolean> {
    return this.http.put<boolean>(environment.apiHost + `reservations/equipment-update/${id}`, equipment);
  }

  canDeleteEquipment(id: number, equipment: Equipment): Observable<boolean> {
    const params = new HttpParams().set('equipmentId', equipment.id.toString());
    return this.http.get<boolean>(environment.apiHost + `reservations/equipment-delete/${id}`, { params });
  }

  uploadImage(id: number, file: File): Observable<any> {
    return this.http.post(environment.apiHost + `reservations/code/${id}`, file);
  }

  completeOrder(reservation: Reservation): Observable<any> {
    return this.http.post(environment.apiHost + `reservations/complete-reservation`, reservation);
  }

  getAllOrders(companyId: number, page: number, size: number, sortBy: string, sortDirection: string): Observable<PagedResults<Reservation>> {
    const params = this.buildParams(companyId, page, size, sortBy, sortDirection);
    return this.http.get<PagedResults<Reservation>>(environment.apiHost + `reservations/orders`, { params });
  }

  getOrder(orderId: number, userId: number): Observable<any> {
    return this.http.post(environment.apiHost + `reservations/order/${orderId}`, userId);
  }

  getActiveReservationsByCompany(id: number, page: number, size: number): Observable<PagedResults<Contract>> {
    const params = this.buildParams(id, page, size);
    return this.http.get<PagedResults<Contract>>(environment.apiHost + `contracts/active`, { params });
  }

  private buildParams(companyId: number, page: number, size: number, sortBy?: string, sortDirection?: string): HttpParams {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('companyId', companyId.toString())

    if (sortBy) params.set('sort', sortBy);
    if (sortDirection) params.set('direction', sortDirection);
  
    return params;
  }
}
