import { Component, AfterViewInit, NgZone } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "app-ErrorPage",
  templateUrl: "./ErrorPage.component.html",
  styleUrls: ["./ErrorPage.component.scss"],
  providers:[NzMessageService]
})

export class ErrorPageComponent implements AfterViewInit {
  
  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    
  }
}
