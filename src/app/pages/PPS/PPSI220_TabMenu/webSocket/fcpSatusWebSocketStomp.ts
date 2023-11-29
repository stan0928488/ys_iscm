import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ConfigService } from "../../../../services/config/config.service";
import { Router } from '@angular/router';

export class FcpStatusWebSocketStomp
 {

    private stompClient :  Stomp.Client;;
    private subject$: Subject<any> = new Subject<any>();
    APINEWURL : string = null;
    router : Router = null;
    jwtToken : string = null;
    originalXMLHttpRequestOpen : any = null;
    webSocketEndpointPrefix = 'iscmFcpStatusWebSocketEndpoint';
    isAddHeaders = false;
    

    constructor(
      private configService: ConfigService,
      private _router : Router
    ) {
      this.APINEWURL = this.configService.getAPIURL('1');
      this.router = this._router;
      this.jwtToken = localStorage.getItem('jwtToken');
    }
  
    public connect(plantType:string, myTopic: string): void {
        this.addHeaderForStompHttpRequest();
        const socket = new SockJS(`${this.APINEWURL}/${this.webSocketEndpointPrefix}/${plantType}`);
        this.stompClient = Stomp.over(socket);

        const header = {
          Authorization: `Bearer ${this.jwtToken}`,
          CurrentRoute : this.router.url
        }

        // 關閉消息的打印
        this.stompClient.debug = null
        this.stompClient.connect(header, (frame) => {
          console.log('STOMP: Connected', frame);
          this.stompClient.subscribe(`/topic/${myTopic}`, (message) => {
            this.subject$.next(message);
          });
        });
    }

    public disconnect(){
      if(this.stompClient && this.stompClient.connected){
        this.stompClient.disconnect(() =>{
          XMLHttpRequest.prototype.open = this.originalXMLHttpRequestOpen;
          console.log('STOMP: DisConnected');
        });
      }
    }

    public connectedStatus() : boolean{
      return this.stompClient && this.stompClient.connected;
    }


    // 暫無需要發送消息給後端的
    /*public sendMessage(destination: string, body: any): void {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.send(
          `${this.APINEWURL}/test`,
          {},
          JSON.stringify(body)
        );
      } else {
        console.error('STOMP: Not connected.');
      }
    }*/
  
    public getMessages(): Observable<any> {
      return this.subject$.asObservable();
    }

    addHeaderForStompHttpRequest(){
      const originalOpen = XMLHttpRequest.prototype.open;
      this.originalXMLHttpRequestOpen = originalOpen;
      const regex = new RegExp(`\\S+?\\/${this.webSocketEndpointPrefix}\\/\\S+`);
      const _this = this;
      XMLHttpRequest.prototype.open = function(method, url) {
        originalOpen.apply(this, arguments);
        if(regex.test(url)){
          this.setRequestHeader('Authorization', `Bearer ${_this.jwtToken}`);
          this.setRequestHeader('CurrentRoute', _this.router.url);
          // 已設定過Header不能再設定了
          this.setRequestHeader = function() {};
        }
      };
    }

  }