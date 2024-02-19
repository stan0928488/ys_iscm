import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ppsi210-tab-menu',
  templateUrl: './PPSI210_TabMenu.component.html',
  styleUrls: ['./PPSI210_TabMenu.component.css']
})
export class PPSI210TabMenuComponent implements OnInit {

  constructor(private router: Router) {
    this.router.navigateByUrl("/main/FCPBarData/P201_TabMenu/P201");
   }

  ngOnInit(): void {
  }

}
