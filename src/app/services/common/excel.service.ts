import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as moment from 'moment';



@Injectable({
  providedIn: 'root'
})
export class ExcelService {

	letter = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA','AB','AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX','AY','AZ','BA','BB','BC','BD','BE','BF','BG','BH','BI','BJ','BK','BL','BM','BN','BO','BP','BQ','BR','BS','BT','BU','BV','BW','BX','BY','BZ',
			 'CA','CB','CC','CD','CE','CF','CG','CH','CI','CJ','CK','CL','CM','CN','CO','CP','CQ','CR','CS','CT','CU','CV','CW','CX','CY','CZ','DA','DB','DC','DD','DE','DF','DG','DH','DI','DJ','DK','DL','DM','DN','DO','DP','DQ','DR','DS','DT','DU','DV','DW','DX','DY','DZ','EA','EB','EC','ED','EE','EF','EG','EH','EI','EJ','EK','EL','EM','EN','EO','EP','EQ','ER','ES','ET','EU','EV','EW','EX','EY','EZ'];

	constructor() { }


	static toExportFileName(excelFileName: string): string {
		console.log('toExportFileName');
		console.log(`${excelFileName}_export_${new Date().getTime()}.xlsx`);
		let now = moment().format('YYYYMMDD_hhmmss');
		return `${excelFileName}_${now}.xlsx`;
		// return `${excelFileName}_export_${new Date().getTime()}.xlsx`;

	}

	public exportAsExcelFile(json: any[], excelFileName: string, titleArray: any[]): void {
		console.log('exportAsExcelFile');
		let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
	 	worksheet = this.renameExcelColunmTitle(worksheet, titleArray);
		const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
		XLSX.writeFile(workbook, ExcelService.toExportFileName(excelFileName)); 
		
	}

	private renameExcelColunmTitle(_ws,_titleArray){
		// console.log("_ws:" + JSON.stringify(_ws))
		for(let i=0;i< _titleArray.length;i++){
			let title = _titleArray[i];
			let key = this.letter[i]+1;
            // console.log("title:" + title)
			// console.log("key:" + key)
			if(_ws[key] != null && _ws[key]['v'] != null){
				_ws[key]['v'] = title;
			}
		}
		return _ws;
	}

	public importFromFile(bstr: string): XLSX.AOA2SheetOpts {
		/* read workbook */
		const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

		/* grab first sheet */
		const wsname: string = wb.SheetNames[0];
		const ws: XLSX.WorkSheet = wb.Sheets[wsname];

		console.log("---------------------------------------wsname")
		console.log(wsname)
		console.log("---------------------------------------ws")
		console.log(ws)
		/* save data */
		const data = <XLSX.AOA2SheetOpts>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
		console.log("---------------------------------------data")
		console.log(data[0])

		return data;
	}
	
	
	public exportToFile(fileName: string, element_id: string) {
		if (!element_id) throw new Error('Element Id does not exists');

		let tbl = document.getElementById(element_id);
		let wb = XLSX.utils.table_to_book(tbl);
		XLSX.writeFile(wb, fileName + '.xlsx');
	}



}
