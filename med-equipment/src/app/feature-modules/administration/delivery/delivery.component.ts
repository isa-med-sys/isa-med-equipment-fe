import { AuthService } from 'src/app/authentication/auth.service';
import { AdministrationService } from '../administration.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import * as L from 'leaflet';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit, OnDestroy {
  private serverUrl = 'http://localhost:8080/socket';
  private stompClient: any;

  isLoaded: boolean = false;
  isCustomSocketOpened = false;
  messages: { latitude: number, longitude: number }[] = [];
  companyId!: number;
  adminId: number;

  map: L.Map | undefined;
  marker: L.Marker | undefined;

  constructor(private adminService: AdministrationService, private authService: AuthService) {
    this.adminId = authService.user$.value.id;
  }

  ngOnInit() {
    this.adminService.getCompanyAdmin(this.adminId)
      .subscribe({
        next: (result) => {
          this.companyId = result.company.id;
          this.initializeWebSocketConnection();
        },
        error: (err) => {
          console.error('Error');
        }
      });
    this.initMap();
  }

  ngOnDestroy() {
    this.closeWebSocketConnection();
  }

  closeWebSocketConnection() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }

  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;

    this.stompClient.connect({}, function () {
      that.isLoaded = true;
      that.openSocket();
    });
  }

  openSocket() {
    if (this.isLoaded) {
      this.isCustomSocketOpened = true;
      this.stompClient.subscribe("/socket-publisher/" + this.companyId, (message: { body: string }) => {
        this.handleResult(message);
      });
    }
  }

  handleResult(message: { body: string }) {
    if (message.body) {
      let messageResult: { latitude: number, longitude: number } = JSON.parse(message.body);
      if (messageResult.latitude !== undefined && messageResult.longitude !== undefined) {
        this.messages.push(messageResult);

        if (this.map) {
          this.updateMap(messageResult.longitude, messageResult.latitude);
        }
      }
    }
  }

  private initMap() {
    this.map = L.map('map').setView([45.267136, 19.833549], 30);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const customIcon = L.icon({
      iconUrl: '../../../assets/images/delivery_van_blue.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    this.marker = L.marker([0, 0], { icon: customIcon }).addTo(this.map);
  }

  private updateMap(latitude: number, longitude: number) {
    if (this.marker) {
      this.marker.setLatLng([latitude, longitude]);
      this.map?.panTo(new L.LatLng(latitude, longitude));
    }
  }

  /* 
  to verify the simulation, for company.admin@gmail.com, use these coordinates
  {
  "companyId": 1,
  "longitudeStart": 19.83188153784739,
  "latitudeStart": 45.26224929945993,
  "longitudeEnd": 19.83716012528152,
  "latitudeEnd": 45.252793872358296
  }
  */
}