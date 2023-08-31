import { Component, OnDestroy, OnInit } from '@angular/core';
import { PPSR322EvnetBusComponent } from '../PPSR322-evnet-bus/PPSR322-evnet-bus.component';
import { PPSService } from "src/app/services/PPS/PPS.service";
import { NzMessageService } from 'ng-zorro-antd/message';
import * as moment from 'moment';

@Component({
  selector: 'app-PPSR322-child4',
  templateUrl: './PPSR322-child4.component.html',
  styleUrls: ['./PPSR322-child4.component.css'],
  providers:[NzMessageService]
})
export class PPSR322Child4Component implements OnInit,OnDestroy {

  listOfData: ItemData[] = [];
  otherInfo = {
    instructions:""
  };

  constructor(
    private ppsr322EvnetBusComponent:PPSR322EvnetBusComponent,
    private PPSService: PPSService,
    private message: NzMessageService
  ) {}

  ngOnInit(){

    this.ppsr322EvnetBusComponent.on("ppsr322search",(data:any) => {
      let postData = {
        verList:{fcpVer:"",shiftVer:""},
        tabType:Number
      };
      postData.verList.fcpVer = data.data.fcpVer
      // postData.verList.fcpVer = "F20230825223499" //測試代碼
      postData.verList.shiftVer = data.data.shiftVer
      // postData.verList.shiftVer = "E20230825006" //測試代碼
      this.getR322Data(postData);
      this.getR322OtherInfo(postData);
    })

    let postData = {};
    this.getR322Data(postData);
    this.getR322OtherInfo(postData);

  }

  ngOnDestroy(): void {
    this.ppsr322EvnetBusComponent.unsubscribe();
  }

  getR322OtherInfo(postData){

    postData['tabType'] = 4
    this.PPSService.getR322OtherInfo(postData).subscribe(res =>{
      let result: any = res;
      this.otherInfo.instructions = result.instructions;
    });

  }

  getR322Data(postData){

    postData['tabType'] = 4
    this.PPSService.getR322Data(postData).subscribe({
      next: (res) => {
        let result: any = res;

        if(result[0]){

          const data = [];
          for (let i = 0; i < result.length ; i++) {
            data.push({
              schShopCode: result[i].schShopCode,
              pstMachine: result[i].pstMachine,
              pst: result[i].pst,
              pstStr: result[i].pstStr,
              gradeGroup: result[i].gradeGroup,
              aWeight: result[i].aWeight,
              bWeight: result[i].bWeight,
              rowspanSize: result[i].rowspanSize
            });
          }
          this.listOfData = data;

          this.listOfData.map(element => {
            element.pstStr =  moment(element.pst).format("YYYY-MM-DD")
          });

        }else{
          const data = [];
          this.listOfData = data;
        }

      },
      error: (e) => {
        this.message.error('網絡請求失敗');
      },
      complete: () => {}
    });
    
  }

}

interface ItemData {
  schShopCode: string;
  pstMachine: string;
  pst: Date;
  pstStr: string;
  gradeGroup: string;
  aWeight: number;
  bWeight: number;
  rowspanSize:number;
}