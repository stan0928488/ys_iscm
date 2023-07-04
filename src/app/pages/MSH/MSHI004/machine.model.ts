export class MSHI004MACHINE {
  mesPublishGroup: string; // MES群組
  pstMachine: number; // 機台數
  publishMachine: string; //已配置機台數\
  constructor(
    _mesPublishGroup: string,
    _pstMachine: number,
    _publishMachine: string
  ) {
    this.mesPublishGroup = _mesPublishGroup;
    this.pstMachine = _pstMachine;
    this.publishMachine = _publishMachine;
  }
}
