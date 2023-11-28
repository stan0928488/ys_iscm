import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ppsi220-tab-menu',
  templateUrl: './PPSI220_TabMenu.component.html',
  styleUrls: ['./PPSI220_TabMenu.component.css']
})
export class PPSI220TabMenuComponent implements OnInit {

  constructor(private router: Router) {
    this.router.navigateByUrl("/FCPBarData/P202_TabMenu/P202");
   }

  ngOnInit(): void {
  }

}
