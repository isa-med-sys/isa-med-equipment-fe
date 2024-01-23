import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Reservation } from 'src/app/shared/model/reservation';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) { }

  getPastReservationsByUser(userId: number, page: number, size: number, sortBy: string, sortDirection: string): Observable<PagedResults<Reservation>> {
    const params = this.buildParams(userId, page, size, sortBy, sortDirection);
    return this.http.get<PagedResults<Reservation>>(environment.apiHost + `reservations/past`, { params });
  }

  getUpcomingReservationsByUser(userId: number, page: number, size: number, sortBy: string, sortDirection: string): Observable<PagedResults<Reservation>> {
    const params = this.buildParams(userId, page, size, sortBy, sortDirection);
    return this.http.get<PagedResults<Reservation>>(environment.apiHost + `reservations/upcoming`, { params });
  }

  private buildParams(userId: number, page: number, size: number, sortBy: string, sortDirection: string): HttpParams {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('userId', userId.toString())
      .set('sort', sortBy)
      .set('direction', sortDirection);
    
    return params;
  }
}
