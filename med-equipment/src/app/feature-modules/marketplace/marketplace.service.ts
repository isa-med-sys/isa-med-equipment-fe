import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Equipment } from './model/equipment.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(environment.apiHost + 'equipment');
  }
}
