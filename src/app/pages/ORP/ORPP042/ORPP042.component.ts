import { Component, OnInit ,ChangeDetectionStrategy,ChangeDetectorRef} from '@angular/core';
import { Orp040Service } from 'src/app/services/ORP/orp040.service';

import { finalize } from 'rxjs/operators';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TalkSessionItems } from 'src/app/services/ORP/orp040.service';
import { SearchCommonVO } from 'src/app/services/common/types';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
interface SearchParam {
  tsName: string;
  tsiType: string[];
} 
@Component({
  selector: 'app-ORPP042',
  templateUrl: './ORPP042.component.html',
  styleUrls: ['./ORPP042.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class ORPP042Component implements OnInit {
tbData :TalkSessionItems[] = [] ;
searchParam: Partial<SearchParam> = {tsName:'',tsiType:[]};
saveTalkSessionItem: Partial<TalkSessionItems> = {
  id : 0 ,
  tsName:'', //交談作業
  tsiSort:'', //排序
  tsiCode:'', //交談單元碼
  tsiName:'', //交談單元
  tsiType:'', //交談方向
  rmsCode:'', //交談訊息碼
  remark:'', //備註
  previous:'', //上個交談
  next:'', //下個交談
  services:'', //服務
  tsiServicePath:'', //錯誤碼
};

constructor(private dataService : Orp040Service ,
  private changeDetectorRef: ChangeDetectorRef,
  private fb: UntypedFormBuilder ,private modal: NzModalService) { }
tbLoading = false ;
tbHeader = [
  {
    label:'排序',
    value:'id'
  },
  {
    label:'交談作業',
    value:'tsName'
  },
  {
    label:'排序',
    value:'tsiSort'
  },
  {
    label:'交談單元碼',
    value:'tsiCode'
  },
  {
    label:'交談單元',
    value:'tsiName'
  },
  {
    label:'交談方向',
    value:'tsiType'
  },
  {
    label:'交談訊息碼',
    value:'rmsCode'
  },
  {
    label:'上個交談',
    value:'previous'
  },
  {
    label:'下個交談',
    value:'next'
  },
  {
    label:'服務',
    value:'services'
  },
  // {
  //   label:'錯誤',
  //   value:'tsiError'
  // },
  {
    label:'Action',
    value:'Action'
  },
]

listOfOption: Array<{ label: string; value: string }> = [
  {label:'C -> W',value:'CW'},
  {label:'W -> C',value:'WC'},
  {label:'W -> S',value:'WS'},
  {label:'S -> W',value:'SW'},
];
addModal = {
  isVisible :false,
  title : '新增',
  type : 'ADD' ,  //EDIT
  modalLoading:false

}

validateForm!: UntypedFormGroup;
saveFun(){
  //console.log("提交保存1：" + JSON.stringify(this.validateForm.value))
  if(this.addModal.type === 'ADD') {
    this.validateForm.value.id = 0 ;
  }
  this.saveTalkSessionItem = this.validateForm.value ;
  //console.log("提交保存2：" + JSON.stringify(this.saveTalkSessionItem))
  this.saveDataAction(this.saveTalkSessionItem)
}
saveDataAction(param:any){
  this.dataService.saveTalkSessionItem(param).subscribe((item) => {
    this.changeModal();
    this.getTBData();
  });
}


changeModal(){
this.addModal.isVisible = !this.addModal.isVisible
console.log(this.addModal.isVisible)
}

editData(id:any){
console.log("edit :" + id)
this.addModal.title = "修改" ;
this.addModal.type = 'EDIT' ;
if(Number(id) > 0) {
  var temp = this.tbData.filter((item)=>{
    return item.id == Number(id) ;
  }) ;
this.saveTalkSessionItem = temp[0] ;
}
console.log("this.saveTalkSessionItem : " + JSON.stringify(this.saveTalkSessionItem))
this.validateForm.setValue(this.saveTalkSessionItem)
this.changeModal();
}

showDeleteConfirm(id:any): void {
this.modal.confirm({
  nzTitle: '確認刪除當前記錄嗎？',
  nzContent: '<b style="color: red;">刪除之後，不可使用</b>',
  nzOkText: '確定',
  nzOkType: 'primary',
  nzOkDanger: true,
  nzOnOk: () => {
    console.log("刪除:" + id)
    this.dataService.delTalkSessionItem(id).subscribe(() => {
      this.getTBData();
    });
  },
  nzCancelText: '取消',
  nzOnCancel: () => console.log('Cancel')
});
}
AddFunc(){
this.changeModal();
this.validateForm.value.id = 0 ;
this.addModal.title = "新增" ;
this.addModal.type = 'ADD' ;
console.log("新增：" + JSON.stringify(this.validateForm.value))
}
ngOnInit() {
  this.getTBData();
  this.validateForm = this.fb.group({
   // userName: [null, [Validators.required]],
    id: 0 ,
    tsName:'', //交談作業
    tsiSort:'', //排序
    tsiCode:'', //交談單元碼
    tsiName:'', //交談單元
    tsiType:'', //交談方向
    rmsCode:'', //交談訊息碼
    remark:'', //備註
    previous:'', //上個交談
    next:'', //下個交談
    services:'', //服務
    tsiServicePath: '', //錯誤碼
    logUUID: '' ,//作业唯一标识
    useStatus:'',
    delStatus:'',
    createUser:'',
    createDate:'',
    updateUser:'',
    updateDate:''
  });
}
queryBtnFun(){
  this.getTBData();
}
getTBData(){
  const params: SearchCommonVO<any> = {
    pageSize: 30,
    pageNum: 1,
    filters: this.searchParam
  };
  this.dataService.getTalkItemByPara(params).subscribe(res => {
    //console.log("显示结果:" + JSON.stringify(res))
    let result : any = res ;
    this.tbData = [...result.data.records] ;
    this.changeDetectorRef.detectChanges() ;
  }) ;
}
}
