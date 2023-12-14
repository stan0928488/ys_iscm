import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  letter = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'AA',
    'AB',
    'AC',
    'AD',
    'AE',
    'AF',
    'AG',
    'AH',
    'AI',
    'AJ',
    'AK',
    'AL',
    'AM',
    'AN',
    'AO',
    'AP',
    'AQ',
    'AR',
    'AS',
    'AT',
    'AU',
    'AV',
    'AW',
    'AX',
    'AY',
    'AZ',
    'BA',
    'BB',
    'BC',
    'BD',
    'BE',
    'BF',
    'BG',
    'BH',
    'BI',
    'BJ',
    'BK',
    'BL',
    'BM',
    'BN',
    'BO',
    'BP',
    'BQ',
    'BR',
    'BS',
    'BT',
    'BU',
    'BV',
    'BW',
    'BX',
    'BY',
    'BZ',
    'CA',
    'CB',
    'CC',
    'CD',
    'CE',
    'CF',
    'CG',
    'CH',
    'CI',
    'CJ',
    'CK',
    'CL',
    'CM',
    'CN',
    'CO',
    'CP',
    'CQ',
    'CR',
    'CS',
    'CT',
    'CU',
    'CV',
    'CW',
    'CX',
    'CY',
    'CZ',
    'DA',
    'DB',
    'DC',
    'DD',
    'DE',
    'DF',
    'DG',
    'DH',
    'DI',
    'DJ',
    'DK',
    'DL',
    'DM',
    'DN',
    'DO',
    'DP',
    'DQ',
    'DR',
    'DS',
    'DT',
    'DU',
    'DV',
    'DW',
    'DX',
    'DY',
    'DZ',
    'EA',
    'EB',
    'EC',
    'ED',
    'EE',
    'EF',
    'EG',
    'EH',
    'EI',
    'EJ',
    'EK',
    'EL',
    'EM',
    'EN',
    'EO',
    'EP',
    'EQ',
    'ER',
    'ES',
    'ET',
    'EU',
    'EV',
    'EW',
    'EX',
    'EY',
    'EZ',
  ];

  constructor() {}

  static toExportFileName(excelFileName: string): string {
    console.log('toExportFileName');
    console.log(`${excelFileName}_export_${new Date().getTime()}.xlsx`);
    let now = moment().format('YYYYMMDD_hhmmss');
    return `${excelFileName}_${now}.xlsx`;
    // return `${excelFileName}_export_${new Date().getTime()}.xlsx`;
  }

  public exportAsExcelFile(
    json: any[],
    excelFileName: string,
    titleArray: any[]
  ): void {
    console.log('exportAsExcelFile');
    let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    worksheet = this.renameExcelColunmTitle(worksheet, titleArray);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    XLSX.writeFile(workbook, ExcelService.toExportFileName(excelFileName));
  }

  private renameExcelColunmTitle(_ws, _titleArray) {
    // console.log("_ws:" + JSON.stringify(_ws))
    for (let i = 0; i < _titleArray.length; i++) {
      let title = _titleArray[i];
      let key = this.letter[i] + 1;
      // console.log("title:" + title)
      // console.log("key:" + key)
      if (_ws[key] != null && _ws[key]['v'] != null) {
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

    console.log('---------------------------------------wsname');
    console.log(wsname);
    console.log('---------------------------------------ws');
    console.log(ws);
    /* save data */
    const data = <XLSX.AOA2SheetOpts>(
      XLSX.utils.sheet_to_json(ws, { header: 1 })
    );
    console.log('---------------------------------------data');
    console.log(data[0]);

    return data;
  }

  public exportToFile(fileName: string, element_id: string) {
    if (!element_id) throw new Error('Element Id does not exists');

    let tbl = document.getElementById(element_id);
    let wb = XLSX.utils.table_to_book(tbl);
    XLSX.writeFile(wb, fileName + '.xlsx');
  }

  public multiSheet(
    dataSet: any[],
    sheetConfigs: SheetConfig[],
    fileName: string,
    dataSetInfo: any[]
  ): void {
    const wb = XLSX.utils.book_new();
    // console.log(dataSetInfo);

    for (let i = 0; i < dataSet.length; i++) {
      const sheetConfig = sheetConfigs[i];
      const dataToExport = this.extractFields(
        dataSet[i],
        sheetConfig.fieldMapping
      );

      // 生成动态列名
      const dynamicColumnNames = this.getDynamicColumnNames(dataToExport);

      // 合并所有字段名
      const header = [...dynamicColumnNames];

      // 添加一个工作表，指定字段名
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([], { header });

      let descriptionArray: string[] = [];
      // 添加文本描述到工作表的开头
      if (sheetConfig.includeDescription && dataSetInfo[i]) {
        // let descriptionArray: string[] = [];

        // 处理字符串类型或数组类型的描述文字
        if (typeof dataSetInfo[i] === 'string') {
          descriptionArray = [dataSetInfo[i]];
        } else if (Array.isArray(dataSetInfo[i])) {
          descriptionArray = dataSetInfo[i];
        } else if (typeof dataSetInfo[i] === 'object') {
          // 如果是对象，转换为数组
          descriptionArray = Object.values(dataSetInfo[i]);
        } else {
          console.error(`dataSetInfo[${i}] is not an array, string, or object`);
        }

        // 将描述文字添加到工作表
        for (let k = 0; k < descriptionArray.length; k++) {
          const rowIndex = k + 0; // +1 是因為 A1 開始
          const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: 0 }); // c: 0 是因為我們只添加到第一列
          ws[cellRef] = { t: 's', v: descriptionArray[k] };
          // console.log(descriptionArray[k]);
        }

        // 更新工作表範圍
        if (descriptionArray.length > 0) {
          ws['!ref'] = `A1:A${descriptionArray.length}`;
        }
      }

      // 将表头添加到工作表
      XLSX.utils.sheet_add_aoa(ws, [header]);

      // 将数据添加到工作表的下一行开始
      XLSX.utils.sheet_add_json(ws, dataToExport, {
        header,
        origin: sheetConfig.includeDescription
          ? descriptionArray.length + 1
          : 0,
      });

      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(wb, ws, sheetConfig.sheetName);
    }

    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  private getDynamicColumnNames(dataToExport: any[]): string[] {
    // 从所有行中找到所有 planWeightI 的索引
    const planWeightIndices = dataToExport.reduce((indices, row) => {
      return indices.concat(
        Object.keys(row)
          .filter((key) => key.startsWith('planWeightI'))
          .map((key) => parseInt(key.replace('planWeightI', ''), 10))
          .filter((index) => !isNaN(index))
      );
    }, []);

    // 如果没有动态欄位，直接返回空陣列
    if (planWeightIndices.length === 0) {
      return [];
    }

    // 找到最大索引，这就是动态列的数量
    const maxIndex = Math.max(...planWeightIndices, 0);

    // 生成动态列名数组
    return Array.from(
      { length: maxIndex + 1 },
      (_, i) => `planWeightI${i + 1}`
    );
  }

  public extractFields(data: any, fieldMapping: any): any[] {
    if (!data || data.length === 0) {
      console.error('Input data is undefined, null, or an empty array.');
      return [];
    }

    const extractedData: any[] = [];

    data.forEach((item) => {
      const extractedItem: any = {};

      // 以 fieldMapping 的鍵 (即欄位名稱) 作為順序依據
      Object.keys(fieldMapping).forEach((fieldName) => {
        // 檢查欄位是否存在
        if (item.hasOwnProperty(fieldName)) {
          const mappedFieldName = fieldMapping[fieldName];
          const value = item[fieldName];
          extractedItem[mappedFieldName] = value !== '' ? value : null;
        }
      });

      extractedData.push(extractedItem);
    });

    return extractedData;
  }
}

interface SheetConfig {
  sheetName: string;
  fieldMapping: { [key: string]: string };
  includeDescription?: boolean;
}
