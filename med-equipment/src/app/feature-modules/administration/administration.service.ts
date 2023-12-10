import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from 'src/app/shared/model/company';
import { CompanyAdmin } from 'src/app/shared/model/company-admin';
import { SystemAdmin } from 'src/app/shared/model/system-admin';
import { environment } from 'src/env/environment';

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
    return this.http.get<CompanyAdmin[]>(environment.apiHost + `companies/admins/${companyId}`);
  }
}
