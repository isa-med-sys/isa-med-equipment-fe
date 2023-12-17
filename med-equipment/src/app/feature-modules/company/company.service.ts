import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Company } from "../../shared/model/company";
import { environment } from "../../../env/environment";
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Equipment } from "../../shared/model/equipment";
import { Reservation } from 'src/app/shared/model/reservation';
import { TimeSlot } from 'src/app/shared/model/timeslot';
import { CustomTimeSlot } from 'src/app/shared/model/custom-time-slot';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  getCompanies(name: string, city: string, rating: number, page: number, size: number): Observable<PagedResults<Company>> {
    const params = this.buildParams(name, city, rating, page, size);
    return this.http.get<PagedResults<Company>>(environment.apiHost + 'companies', { params });
  }

  getCompanyById(id: number): Observable<Company> {
    return this.http.get<Company>(environment.apiHost + `companies/${id}`);
  }

  getAllEquipmentByCompany(id: number): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(environment.apiHost + `companies/${id}/equipment`);
  }

  getAvailableEquipmentByCompany(id: number): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(environment.apiHost + `companies/${id}/equipment/available`);
  }

  makeReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(environment.apiHost + `reservations`, reservation);
  }

  getAvailableTimeSlots(companyId: number): Observable<TimeSlot[]> {
    const params = new HttpParams().set('companyId', companyId.toString());
    return this.http.get<TimeSlot[]>(environment.apiHost + `calendars/time-slots/free-predefined`, { params });
  }

  createTimeSlot(companyId: number, timeSlot: CustomTimeSlot): Observable<TimeSlot> {
    const params = new HttpParams().set('companyId', companyId.toString());
    return this.http.post<TimeSlot>(environment.apiHost + `calendars/time-slots`, timeSlot, { params });
  }

  private buildParams(name: string, city: string, rating: number, page: number, size: number): HttpParams {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (name) params = params.set('name', name);
    if (city) params = params.set('city', city);
    if (rating) params = params.set('rating', rating.toString());

    return params;
  }
}
