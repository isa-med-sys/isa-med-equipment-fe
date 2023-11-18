import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisteredUser } from 'src/app/shared/model/registered-user';
import { environment } from 'src/env/environment';
import {CompanyAdmin} from "../../shared/model/company-admin";
import {Company} from "../../shared/model/company";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

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
}
