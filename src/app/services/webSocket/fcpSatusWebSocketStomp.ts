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

    webSocketEndpointPrefix = 'iscmFcpStatusWebSocketEndpoint-ef356691-27e5-49c1-8245-9f028f882886';
    intervalId : any = null;
    plantType : string = null;
    myTopic : string = null;
    header : any = null;
    isFirstLostConnection = true;
    reConnectTime : number = null;
    reConnectPhaseMessage : string = null;
    connectingHandlerIntervalId : any = null;
    autoReconnectTimeOutId : any = null;
    reConnectMillisecond = 5000;
    isFinishReConnect = false;
    isUserHandle = false;


    constructor(
      private configService: ConfigService,
      private _router : Router,
      _plantType:string,
      _myTopic: string
    ) {
      this.APINEWURL = this.configService.getAPIURL('1');
      this.plantType = _plantType;
      this.myTopic = _myTopic;
      this.router = this._router;
      this.jwtToken = localStorage.getItem('jwtToken');
      this.header = {
        Authorization: `Bearer ${this.jwtToken}`,
        CurrentRoute : this.router.url
      }
    }

    // 處理連線到一半處於不是成功也不是失敗但未連上的問題
    connectingHandler(){
      this.connectingHandlerIntervalId = setInterval(() => {
        
        if(_.isNil(this.reConnectTime) || _.isNil(this.reConnectPhaseMessage) || this.isUserHandle) {
          return;
        }
        if(new Date().getTime() - this.reConnectTime > this.reConnectMillisecond + 2000
          && !this.connectedStatus()){
            console.log("發生web socket連線到一半的情況，進行重新連接!");
            this.autoReconnect(1); 
        }
      }, this.reConnectMillisecond)
    }

    public async connect(): Promise<boolean> {
    return new Promise((resolve, reject) => { 
      this.addHeaderForStompHttpRequest();
      const socket = new SockJS(`${this.APINEWURL}/${this.webSocketEndpointPrefix}/${this.plantType}`);
      this.stompClient = Stomp.over(socket);

      // 關閉消息的打印
      //this.stompClient.debug = null
      this.stompClient.debug = (message) => {

        // 紀錄重新連線的時間
        // 為了處理連線到一半處於不是成功也不是失敗但未連上的問題
        this.reConnectPhaseMessage = message;
        this.reConnectTime =  new Date().getTime();
        
        // 偵測到斷線事件重新連線
        if (message.includes('Lost connection') && this.isFirstLostConnection){
          this.connectingHandler();
          this.autoReconnect(this.reConnectMillisecond);
        }
      };

      this.stompClient.connect(this.header, async (frame) => {
        this.stompClient.subscribe(`/topic/${this.myTopic}`, (message) => {
          this.subject$.next(message);
        });

        if(!_.isNil(this.connectingHandlerIntervalId)){
          clearInterval(this.connectingHandlerIntervalId);
          this.connectingHandlerIntervalId = null;
        }

        // 正常連線之後重置為true
        // 讓之後再斷線可以執行重連
        this.isFirstLostConnection = true;

        console.log('STOMP: Connected', frame);
        this.restoreXMLHttpRequest();
        resolve(true);
      }, async (error) => {
        console.log('STOMP: Connected Eror');
        this.restoreXMLHttpRequest();
        reject(false);
      });
    }) //end new Promise
  }

    // 使用者有切換頁面了，關閉自動機制
    public noAutoReconnectUserHandler(){

      // 不自動重連的條件
      this.isUserHandle = true;

      // 正常連線之後重置為true
      // 讓之後再斷線可以執行重連
      this.isFirstLostConnection = true;

      // 關閉有連但沒連上的尷尬情況的處理
      if(!_.isNil(this.connectingHandlerIntervalId)){
        clearInterval(this.connectingHandlerIntervalId);
        this.connectingHandlerIntervalId = null;
      }

      // 關閉正在重連的執行
      if(!_.isNil(this.autoReconnectTimeOutId )){
        clearTimeout(this.autoReconnectTimeOutId );
      }
      if(!_.isNil(this.originalXMLHttpRequestOpen)){
        XMLHttpRequest.prototype.open = this.originalXMLHttpRequestOpen;
      }
    }

    public disconnect(){
      if(this.stompClient && this.stompClient.connected){
        this.stompClient.disconnect(() =>{
          console.log('STOMP: DisConnected');
        });
      }
      this.noAutoReconnectUserHandler();
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

    autoReconnect(millisecond){
      this.autoReconnectTimeOutId = setTimeout( async () => {
        if(!_.isEmpty(this.plantType) && !_.isEmpty(this.myTopic)){
          try{
            console.log("連線web scoket中..");
            await this.connect();
            this.isFinishReConnect = true;
            
          }
          catch(error){
            console.log("web scoket連線異常，重新連線..");
          }
          finally{
            this.isFirstLostConnection = false;
            if(!this.connectedStatus() && !this.isUserHandle){
              if(_.isNil(this.connectingHandlerIntervalId)){
                this.connectingHandler();
              }
              this.autoReconnect(this.reConnectMillisecond)
            }
          }
        }
      }, millisecond);
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