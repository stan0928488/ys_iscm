export class MSHI004 {
  id: string;
  mesPublishGroup: string; // MES群組
  mesPublishTime: string; // 發佈MES天數
  shopCode: number; // 工作站數
  equipCode: number; // 機台數
  ppsControl: string; // 依PPS配置
  pstMachineSum: string; //已發佈機台數\
  publishSelf: string; //手動發佈
  pstMachine: string; //已發佈機台
  fcpStartDate: Date; //發佈時間區間

  constructor(
    _id: string,
    _mesPublishGroup: string,
    _mesPublishTime: string,
    _shopCode: number,
    _equipCode: number,
    _ppsControl: string,
    _pstMachineSum: string,
    _publishSelf: string,
    _pstMachine: string,
    _fcpStartDate: Date
  ) {
    this.id = _id;
    this.mesPublishGroup = _mesPublishGroup;
    this.mesPublishTime = _mesPublishTime;
    this.shopCode = _shopCode;
    this.equipCode = _equipCode;
    this.ppsControl = _ppsControl;
    this.pstMachineSum = _pstMachineSum;
    this.pstMachine = _pstMachine;
    this.publishSelf = _publishSelf;
    this.fcpStartDate = _fcpStartDate;
  }
}
