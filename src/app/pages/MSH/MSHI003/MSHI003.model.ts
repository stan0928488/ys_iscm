export class MSHI003{
    id : number;  // 主鍵
    plantCode : string; // 廠區別
    idNo : string; // MO
    shopCode : string;  // 現況站別
    saleOrder : string; // 現況訂單
    saleItem : string; // 現況訂單項次
    saleLineno : string; // 訂單批次
    custAbbr : string; // 客戶
    procStatus : string; // 放行碼
    sfcDia : string; // 尺寸
    finalMicNo : string; // 現況MIC
    processCode : string; // 製程碼
    adjShopCode : string; // 調整站別
    adjLineupProcess : string; // 調整流程
    overShopStatus : string; // 過站狀態
    epst : string; // EPST
    comment : string; // 備註
    newEpst : string; // 調整日期
    dateCreate : string; // 建立日期
    userCreate : string; // 建立者
    dateUpdate : string; // 異動日期
    userUpdate : string; // 異動者
  
    constructor(
      _id : number, 
      _plantCode : string,
      _idNo : string,
      _shopCode : string,
      _saleOrder : string,
      _saleItem : string,
      _saleLineno : string,
      _custAbbr : string,
      _procStatus : string,
      _sfcDia : string,
      _finalMicNo : string,
      _processCode : string,
      _adjShopCode : string,
      _adjLineupProcess : string,
      _overShopStatus : string,
      _epst : string,
      _comment : string,
      _newEpst : string,
      _dateCreate : string,
      _userCreate : string,
      _dateUpdate : string,
      _userUpdate : string){
  
        this.id = _id;
        this.plantCode = _plantCode;
        this.idNo = _idNo;
        this.shopCode = _shopCode;
        this.saleOrder = _saleOrder;
        this.saleItem = _saleItem;
        this.saleLineno = _saleLineno;
        this.custAbbr = _custAbbr;
        this.procStatus = _procStatus
        this.sfcDia = _sfcDia
        this.finalMicNo = _finalMicNo;
        this.processCode = _processCode;
        this.adjShopCode = _adjShopCode;
        this.adjLineupProcess = _adjLineupProcess;
        this.overShopStatus = _overShopStatus;
        this.epst = _epst;
        this.comment = _comment;
        this.newEpst = _newEpst;
        this.dateCreate = _dateCreate;
        this.userCreate = _userCreate;
        this.dateUpdate = _dateUpdate;
        this.userUpdate = _userUpdate;
  
    }
  }