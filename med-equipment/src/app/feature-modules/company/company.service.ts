import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Company } from "../../shared/model/company";
import { environment } from "../../../env/environment";
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Equipment } from "../../shared/model/equipment";

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

  getEquipment(id: number): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(environment.apiHost + `companies/all-equipment/${id}`);
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
