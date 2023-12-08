export class TBPPSM107 {
  schShopCode: string;
  equipCode: string;
  cumsumType: string;
  accumulation: number;
  dateLimit: number;
  useFlag: string;
  dateUpdate: string;
  userUpdate: string;
  constructor(
    _schShopCode: string,
    _equipCode: string,
    _cumsumType: string,
    _accumulation: number,
    _dateLimit: number,
    _useFlag: string,
    _dateUpdate: string,
    _userUpdate: string
  ) {
    this.schShopCode = _schShopCode;
    this.equipCode = _equipCode;
    this.cumsumType = _cumsumType;
    this.accumulation = _accumulation;
    this.dateLimit = _dateLimit;
    this.useFlag = _useFlag;
    this.dateUpdate = _dateUpdate;
    this.userUpdate = _userUpdate;
  }
}
