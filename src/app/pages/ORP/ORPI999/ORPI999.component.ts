import { Component, OnInit, Renderer2 } from '@angular/core';
import { ORPService } from 'src/app/services/ORP/ORP.service';
import { CookieService } from 'src/app/services/config/cookie.service';


@Component({
  selector: 'app-ORPI999',
  templateUrl: './ORPI999.component.html',
  styleUrls: ['./ORPI999.component.css']
})
export class ORPI999Component implements OnInit {
  isSpinning = false;
  status: "initial" | "uploading" | "success" | "fail" | "" = "initial"; // Variable to store file status
  file: File | null = null; // Variable to store file
  dataSet: string[][] = [];
  inputFile : any;
  USERNAME;

  constructor(
    private orpService: ORPService,
    private cookieService: CookieService,
    private renderer: Renderer2,
  ) {
    this.USERNAME = this.cookieService.getCookie("USERNAME");
  }



  ngOnInit(): void {
    this.dataSet = [];
    this.status = "";
    this.file = null;
  }

  
  ngAfterViewInit(): void {
    this.inputFile = this.renderer.selectRootElement('#importFile');
  }

  // On file Select
  onChange(event: any) {
    const file: File = event.target.files[0];
    this.dataSet = [];

    if (file) {
      this.status = "initial";
      this.file = file;
    }
  }

  onUpload() {
    if (this.file) {
      const formData = new FormData();
      // 上傳word
      if (this.file.type === 'application/msword') {
        formData.append('file', this.file, this.file.name);
        const upload$ = this.orpService.readWordFile(formData);
        this.status = 'uploading';
        upload$.subscribe({
          next: (res) => {
            var result:any = res.body;
            var myArray = JSON.parse(result);
            for(var i = 0; i < myArray.length; i++) {
              var list = myArray[i];
              console.log(list);
              this.dataSet.push(list);
            }
            this.status = 'success';
          },
          error: (error: any) => {
            this.status = 'fail';
            return (() => error);
          },
        });
      } 

      // 上傳pdf
      else if (this.file.type === 'application/pdf') {
        formData.append('upload', this.file, this.file.name);
        console.log('上傳pdf');
        const upload$ = this.orpService.readPdfFile(formData);
        this.status = 'uploading';

        upload$.subscribe({
          next: (res) => {
            var result:any = res.body;
            var myArray = JSON.parse(result);
            for(var i = 0; i < myArray.length; i++) {
              var list = myArray[i];
              console.log(list);
              this.dataSet.push(list);
            }
            this.status = 'success';
          },
          error: (error: any) => {
            this.status = 'fail';
            return (() => error);
          },
        });


      }

      
    }
  }

}
