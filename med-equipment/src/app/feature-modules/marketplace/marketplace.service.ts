import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Equipment } from './model/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>('https://localhost:8080/api/equipment');
  }
}
