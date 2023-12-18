import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ppsi206-tab-menu',
  templateUrl: './PPSI206_TabMenu.component.html',
  styleUrls: ['./PPSI206_TabMenu.component.css']
})
export class PPSI206TabMenuComponent implements OnInit {

  constructor(private router: Router) {
    this.router.navigateByUrl("/PlanSet/I206_TabMenu/I206_SET");
   }

  ngOnInit(): void {
  }

}
