import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Company } from "../../shared/model/company";
import { environment } from "../../../env/environment";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  getCompanyById(id: number):Observable<Company> {
    return this.http.get<Company>(environment.apiHost + `companies/${id}`);
  }
}
