export class MSHI004{
    id : number;  // 主鍵
    mesPublishGroup : string;  // MES群組
    mesPublishTime : string; // 發佈MES天數
    shopCode : number; // 工作站數
    equipCode : number; // 機台數
    ppsControl : string; // 依PPS配置
    date_create : string; // 發佈者
    userCreate : string; // 發佈日期
    publishBatch : string; // 發動批次
  
    constructor(
      _id : number, 
      _mesPublishGroup : string,
      _mesPublishTime : string,
      _shopCode : number,
      _equipCode : number,
      _ppsControl : string,
      _date_create : string,
      _userCreate : string,
      _publishBatch : string)
      {
  
        this.id = _id;
        this.mesPublishGroup = _mesPublishGroup;
        this.mesPublishTime = _mesPublishTime;
        this.shopCode = _shopCode;
        this.equipCode = _equipCode;
        this.ppsControl = _ppsControl;
        this.date_create = _date_create;
        this.userCreate = _userCreate;
        this.publishBatch = _publishBatch;
    }
  }