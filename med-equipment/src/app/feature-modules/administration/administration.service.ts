import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from 'src/app/shared/model/company';
import { CompanyAdmin } from 'src/app/shared/model/company-admin';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(environment.apiHost + 'companies');
  }

  addCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(environment.apiHost + 'companies/add', company);
  }

  addAdmin(admin:CompanyAdmin): Observable<CompanyAdmin> {
    return this.http.post<CompanyAdmin>(environment.apiHost + 'users/register-company-admin', admin);
  }
}
