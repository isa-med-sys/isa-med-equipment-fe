import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Equipment } from '../../shared/model/equipment';
import { environment } from 'src/env/environment';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Company } from 'src/app/shared/model/company';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(environment.apiHost + 'equipment');
  }

  getCompaniesByEquipment(equipmentId: number): Observable<Company[]> {
    return this.http.get<Company[]>(environment.apiHost + `companies/equipment/${equipmentId}`);
  }

  searchEquipment(name: string, type: string, rating: number, id: number, role: string): Observable<Equipment[]> {
    let params = new HttpParams();
    if (name) {
      params = params.set('name', name);
    }
    if (type) {
      params = params.set('type', type);
    }
    if (rating !== undefined && rating !== null) {
      params = params.set('rating', rating.toString());
    }
    if (id !== undefined && id !== null) {
      params = params.set('id', id.toString());
    }
    if (role !== undefined && role !== null) {
      params = params.set('role', role);
    }
    return this.http.get<Equipment[]>(environment.apiHost + 'equipment/search', { params });
  }

  getEquipmentTemp(name: string, type: string, rating: number, page: number, size: number): Observable<PagedResults<Equipment>> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
    if (name) {
      params = params.set('name', name);
    }
    if (type) {
      params = params.set('type', type);
    }
    if (rating !== undefined && rating !== null) {
      params = params.set('rating', rating.toString());
    }
    return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'equipment', { params });
  }
}
