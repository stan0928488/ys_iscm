import { Component, OnInit } from '@angular/core';
import { TBPOMM05 } from './TBPOMM05.model';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-PPSR331_yw',
  templateUrl: './PPSR331_yw.component.html',
  styleUrls: ['./PPSR331_yw.component.css'],
})
export class PPSR331YwComponent implements OnInit {
  constructor(private PPSService: PPSService, private route: ActivatedRoute) {}
  selectedTabIndex;
  tbpomm05List: TBPOMM05[] = [];
  gridOptions = {
    defaultColDef: {
      editable: false,
      sortable: false,
      resizable: true,
    },
    api: null,
  };

  ngOnInit(): void {
    // this.route.queryParams.subscribe((params) => {
    //   this.selectedTabIndex = +params['selectedTabIndex'] || 0;
    // });
    this.showData();
    this.changeTab(1);
    this.getData();
  }

  columnDefs = [];
  showData() {
    this.columnDefs = [
      {
        headerName: '尺寸',
        field: 'dia',
        width: 55,
        pinned: 'left',
      },
      {
        headerName: '軋延後長度',
        field: 'processed',
        width: 90,
        pinned: 'left',
      },
      {
        headerName: '飛剪段數',
        field: 'flyCut',
        width: 75,
        pinned: 'left',
      },
      {
        headerName: '飛剪後分段長度',
        field: 'flyCutSplit',
        width: 115,
        pinned: 'left',
      },
      {
        headerName: '飛剪去頭尾後長度',
        field: 'flyCutHeadTail',
        width: 125,
        pinned: 'left',
      },
      {
        headerName: '13段',
        field: 'split13',
        width: 70,
      },
      {
        headerName: '12段',
        field: 'split12',
        width: 70,
      },
      {
        headerName: '11段',
        field: 'split11',
        width: 70,
      },
      {
        headerName: '10段',
        field: 'split10',
        width: 70,
      },
      {
        headerName: '9段',
        field: 'split09',
        width: 70,
      },
      {
        headerName: '8段',
        field: 'split08',
        width: 70,
      },
      {
        headerName: '7段',
        field: 'split07',
        width: 70,
      },
      {
        headerName: '6段',
        field: 'split06',
        width: 70,
      },
      {
        headerName: '5段',
        field: 'split05',
        width: 70,
      },
      {
        headerName: '4段',
        field: 'split04',
        width: 70,
      },
      {
        headerName: '3段',
        field: 'split03',
        width: 70,
      },
      {
        headerName: '2段',
        field: 'split02',
        width: 70,
      },
      {
        headerName: '1段',
        field: 'split01',
        width: 70,
      },
    ];
  }

  version;
  async getData() {
    this.PPSService.getTbpommm04Version().subscribe((res) => {
      if (res['code'] === 200) {
        this.version = res['data'];
      }
    });
  }

  changeTab(tab): void {
    if (tab === 1) {
      let sendData = {
        billetTypeNo: 'A',
      };
      this.PPSService.getBilletTypeList(sendData).subscribe((res) => {
        if (res['code'] === 200) {
          this.tbpomm05List = res['data'];
        }
      });
      window.location.href = '#/report/R001?selectedTabIndex=0';
    } else if (tab === 2) {
      let sendData = {
        billetTypeNo: 'B',
      };
      this.PPSService.getBilletTypeList(sendData).subscribe((res) => {
        if (res['code'] === 200) {
          this.tbpomm05List = res['data'];
        }
      });
      window.location.href = '#/report/R001?selectedTabIndex=1';
    } else if (tab === 3) {
      let sendData = {
        billetTypeNo: 'C',
      };
      this.PPSService.getBilletTypeList(sendData).subscribe((res) => {
        if (res['code'] === 200) {
          this.tbpomm05List = res['data'];
        }
      });
      window.location.href = '#/report/R001?selectedTabIndex=2';
    } else if (tab === 4) {
      let sendData = {
        billetTypeNo: 'D',
      };
      this.PPSService.getBilletTypeList(sendData).subscribe((res) => {
        if (res['code'] === 200) {
          this.tbpomm05List = res['data'];
        }
      });
      window.location.href = '#/report/R001?selectedTabIndex=3';
    }
  }
}
