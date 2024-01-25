import { Component, OnDestroy, OnInit } from '@angular/core';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from 'src/app/authentication/auth.service';

@Component({
  selector: 'app-tempcomp',
  templateUrl: './tempcomp.component.html',
  styleUrls: ['./tempcomp.component.scss']
})
export class TempcompComponent implements OnInit, OnDestroy {
  private serverUrl = 'http://localhost:8080/socket'
  private stompClient: any;

  isLoaded: boolean = false;
  isCustomSocketOpened = false;
  messages: Location[] = [];
  adminId: number;

  constructor(authService: AuthService) { 
    this.adminId = authService.user$.value.id;
  }

  ngOnInit() {
    this.initializeWebSocketConnection();
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
      that.openSocket()
    });

  }

  openSocket() {
    if (this.isLoaded) {
      this.isCustomSocketOpened = true;
      this.stompClient.subscribe("/socket-publisher/" + this.adminId, (message: { body: string; }) => { //adminId sa kompani id zameniti
        this.handleResult(message);
      });
    }
  }

  handleResult(message: { body: string; }) {
    if (message.body) {
      let messageResult: Location = JSON.parse(message.body);
      this.messages.push(messageResult);
      console.log(this.messages);
    }
  }
}
