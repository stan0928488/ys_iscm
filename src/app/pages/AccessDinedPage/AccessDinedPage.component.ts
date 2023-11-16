import { Component, AfterViewInit, NgZone } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "app-AccessDinedPage",
  templateUrl: "./AccessDinedPage.component.html",
  styleUrls: ["./AccessDinedPage.component.scss"],
  providers:[NzMessageService]
})

export class AccessDinedPageComponent implements AfterViewInit {
  images = [];
  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    this.images.push({ src: 'assets/images/STL.png', alt: '無法載入圖片!', isRedBorder: false , info: '正常生產' })
  }
}
