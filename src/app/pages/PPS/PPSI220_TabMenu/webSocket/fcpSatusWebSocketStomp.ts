import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ConfigService } from "../../../../services/config/config.service";

export class FcpStatusWebSocketStomp
 {

    private stompClient :  Stomp.Client;;
    private subject$: Subject<any> = new Subject<any>();
    APINEWURL : string = null;

    constructor(
      private configService: ConfigService,
    ) {
      this.APINEWURL = this.configService.getAPIURL('1');
    }
  
    public connect(plantType:string, myTopic: string): void {
        const socket = new SockJS(`${this.APINEWURL}/webSocketEndpoint/${plantType}`);
        this.stompClient = Stomp.over(socket);

        this.stompClient.connect({}, (frame) => {
          console.log('STOMP: Connected', frame);
          this.stompClient.subscribe(`/topic/${myTopic}`, (message) => {
            this.subject$.next(message);
          });
        });
    }

    public disconnect(){
      if(this.stompClient && this.stompClient.connected){
        this.stompClient.disconnect(() =>{
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

  }