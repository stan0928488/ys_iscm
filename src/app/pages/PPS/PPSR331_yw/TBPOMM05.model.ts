export class TBPOMM05 {
  billetTypeNo: string;
  dia: number;
  split01: number;
  split02: number;
  split03: number;
  split04: number;
  split05: number;
  split06: number;
  split07: number;
  split08: number;
  split09: number;
  split10: number;
  split11: number;
  split12: number;
  split13: number;
  processed: number;
  flyCut: number;
  flyCutSplit: number;
  flyCutHeadTail: number;

  constructor(
    _billetTypeNo: string,
    _dia: number,
    _split01: number,
    _split02: number,
    _split03: number,
    _split04: number,
    _split05: number,
    _split06: number,
    _split07: number,
    _split08: number,
    _split09: number,
    _split10: number,
    _split11: number,
    _split12: number,
    _split13: number,
    _processed: number,
    _flyCut: number,
    _flyCutSplit: number,
    _flyCutHeadTail: number
  ) {
    this.billetTypeNo = _billetTypeNo;
    this.dia = _dia;
    this.split01 = _split01;
    this.split02 = _split02;
    this.split03 = _split03;
    this.split04 = _split04;
    this.split05 = _split05;
    this.split06 = _split06;
    this.split07 = _split07;
    this.split08 = _split08;
    this.split09 = _split09;
    this.split10 = _split10;
    this.split11 = _split11;
    this.split12 = _split12;
    this.split13 = _split13;
    this.processed = _processed;
    this.flyCut = _flyCut;
    this.flyCutSplit = _flyCutSplit;
    this.flyCutHeadTail = _flyCutHeadTail;
  }
}
