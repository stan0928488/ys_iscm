import { zh_TW } from 'ng-zorro-antd/i18n';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Observable, Subject } from "rxjs";
import { ConfigService } from "../config/config.service";
import { Router } from '@angular/router';
import * as _ from "lodash";

export class FcpStatusWebSocketStomp
 {

    private stompClient :  Stomp.Client;;
    private subject$: Subject<any> = new Subject<any>();
    APINEWURL : string = null;
    router : Router = null;
    jwtToken : string = null;
    originalXMLHttpRequestOpen : any = null;
    originalXMLHttpRequestSetHeader : any = null;
    currentXMLHttpRequestInstancing : any = null;

    webSocketEndpointPrefix = 'iscmFcpStatusWebSocketEndpoint';
    intervalId : any = null;
    autoReconnectIntervalId: any = null;
    plantType : string = null;
    myTopic : string = null;
    isReconnect = false;

    constructor(
      private configService: ConfigService,
      private _router : Router
    ) {
      this.APINEWURL = this.configService.getAPIURL('1');
      this.router = this._router;
      this.jwtToken = localStorage.getItem('jwtToken');
    }
  
     public async connect(_plantType:string, _myTopic: string): Promise<boolean> {
      return new Promise((resolve, reject) => { 
        this.plantType = _plantType;
        this.myTopic = _myTopic;
        this.addHeaderForStompHttpRequest();
        const socket = new SockJS(`${this.APINEWURL}/${this.webSocketEndpointPrefix}/${_plantType}`);
        this.stompClient = Stomp.over(socket);

        const header = {
          Authorization: `Bearer ${this.jwtToken}`,
          CurrentRoute : this.router.url
        }

        // 關閉消息的打印
        //this.stompClient.debug = null
        this.stompClient.debug = async (message) => {
          // 偵測到斷線事件
          if (message.includes('Lost connection') && !this.isReconnect) {
              console.log('已與伺服器web scoket斷開連線');
              this.isReconnect = true;
              await this.autoReconnect();
          }
          else if(message.includes('connected to server') || this.connectedStatus()){
            if(this.autoReconnectIntervalId) clearInterval(this.autoReconnectIntervalId);
            this.isReconnect = false;
            console.log("連線web scoket成功!!");
          }
        };

        this.stompClient.connect(header, async (frame) => {
          this.stompClient.subscribe(`/topic/${_myTopic}`, (message) => {
            this.subject$.next(message);
          });
          this.restoreXMLHttpRequest();
          console.log('STOMP: Connected', frame);
          resolve(true);
        }, (error) => {
          reject(false);
        });
      }) //end new Promise
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

    public async autoReconnect() {

      this.autoReconnectIntervalId = setInterval( async () => {
        if(!_.isEmpty(this.plantType) && !_.isEmpty(this.myTopic)){
          try{
            this.isReconnect = true;
            await this.connect(this.plantType, this.myTopic);
          }
          catch(error){
            console.log("嘗試連線web scoket中..");
          }
        }
      }, 10000);
    }

    addHeaderForStompHttpRequest(){
      const originalOpen = XMLHttpRequest.prototype.open;
      this.originalXMLHttpRequestOpen = originalOpen;
      this.originalXMLHttpRequestSetHeader = XMLHttpRequest.prototype.setRequestHeader
      const regex = new RegExp(`\\S+?\\/${this.webSocketEndpointPrefix}\\/\\S+`);
      const _this = this;
      XMLHttpRequest.prototype.open = function(method, url) {
        originalOpen.apply(this, arguments);
        if(regex.test(url)){
          // 紀錄將當前的的XMLHttpRequest實例
          // 以便於socket連線完畢後，恢復setRequestHeader函數
          _this.currentXMLHttpRequestInstancing = this;
          this.setRequestHeader('Authorization', `Bearer ${_this.jwtToken}`);
          this.setRequestHeader('CurrentRoute', _this.router.url);
          // 已有header已完成設定關閉Header的設定
          // 避免web socket自己發的請求的XMLHttpRequest實例重複添加Authorization的值
          // 會導致後端驗證token失敗
          // web socket連線完畢會恢復原有的setRequestHeader函數
          this.setRequestHeader = function() {};

          // 有根據url過濾
          // 會受影響的也只有web socket連線的那個XMLHttpRequest實例
          // 但為了保險起見，有創建restoreXMLHttpRequest()函數做恢復的動作
        }
      };
    }

    restoreXMLHttpRequest(){
      this.intervalId = setInterval(() => {
        // web socket已成功連線
        if (this.connectedStatus()) {
          // 恢復open方法
          XMLHttpRequest.prototype.open = this.originalXMLHttpRequestOpen;
          // 恢復當前的的XMLHttpRequest實例的setRequestHeader函數
          if(!_.isNil(this.currentXMLHttpRequestInstancing)){
            this.currentXMLHttpRequestInstancing.setRequestHeader = this.originalXMLHttpRequestSetHeader;
          }
          clearInterval(this.intervalId);
        }
      }, 1);
    }
  }