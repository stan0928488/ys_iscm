export class MSHI004MACHINE {
  schShopCode: string; // MES群組
  pstMachine: number; // 機台數
  publishMachine: string; //已配置機台數\
  constructor(
    _schShopCode: string,
    _pstMachine: number,
    _publishMachine: string
  ) {
    this.schShopCode = _schShopCode;
    this.pstMachine = _pstMachine;
    this.publishMachine = _publishMachine;
  }
}
