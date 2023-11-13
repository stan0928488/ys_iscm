import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ppsi230-tab-menu',
  templateUrl: './PPSI230_TabMenu.component.html',
  styleUrls: ['./PPSI230_TabMenu.component.css']
})
export class PPSI230TabMenuComponent implements OnInit {

  constructor(private router: Router) {
    this.router.navigateByUrl("/FCPBarData/P203_TabMenu/P203");
   }

  ngOnInit(): void {
  }

}
