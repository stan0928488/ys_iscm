export class MSHI004 {
  id: string;
  mesPublishGroup: string; // MES群組
  mesPublishTime: string; // 發佈MES天數
  shopCode: number; // 工作站數
  equipCode: number; // 機台數
  ppsControl: string; // 依PPS配置
  publishMachine: string; //已配置機台數\
  publishSelf: string; //手動發佈
  publishMachineTotal: string; //已發佈機台
  timeRegion: Date; //發佈時間區間
  zxcvb: number; //
  fcpEdition: string;
  fcpEditionLock: string;
  mesPublishDay: string;
  userCreate: string;

  constructor(
    _id: string,
    _mesPublishGroup: string,
    _mesPublishTime: string,
    _shopCode: number,
    _equipCode: number,
    _ppsControl: string,
    _publishMachine: string,
    _publishSelf: string,
    _publishMachineTotal: string,
    _timeRegion: Date,
    _zxcvb: number,
    _fcpEdition: string,
    _fcpEditionLock: string,
    _mesPublishDay: string,
    _userCreate: string
  ) {
    this.id = _id;
    this.mesPublishGroup = _mesPublishGroup;
    this.mesPublishTime = _mesPublishTime;
    this.shopCode = _shopCode;
    this.equipCode = _equipCode;
    this.ppsControl = _ppsControl;
    this.publishMachine = _publishMachine;
    this.publishMachineTotal = _publishMachineTotal;
    this.publishSelf = _publishSelf;
    this.timeRegion = _timeRegion;
    this.zxcvb = _zxcvb;
    this.fcpEdition = _fcpEdition;
    this.fcpEditionLock = _fcpEditionLock;
    this.mesPublishDay = _mesPublishDay;
    this.userCreate = _userCreate;
  }
}
