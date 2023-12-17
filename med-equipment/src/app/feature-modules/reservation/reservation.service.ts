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

  getReservationsByUser(userId: number, page: number, size: number): Observable<PagedResults<Reservation>> {
    const params = this.buildParams(userId, page, size);
    return this.http.get<PagedResults<Reservation>>(environment.apiHost + `reservations`, { params });
  }

  private buildParams(userId: number, page: number, size: number): HttpParams {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('userId', userId.toString());
    
    return params;
  }
}
