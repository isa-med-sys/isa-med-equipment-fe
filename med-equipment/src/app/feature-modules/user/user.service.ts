import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisteredUser } from 'src/app/shared/model/registered-user';
import { environment } from 'src/env/environment';

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
}
