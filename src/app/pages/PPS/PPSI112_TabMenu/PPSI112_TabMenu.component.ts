import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ppsi112-tab-menu',
  templateUrl: './PPSI112_TabMenu.component.html',
  styleUrls: ['./PPSI112_TabMenu.component.css']
})
export class PPSI112TabMenuComponent implements OnInit {

  constructor(private router: Router) {
    this.router.navigateByUrl("/PlanSet/I112_TabMenu/I112");
   }

  ngOnInit(): void {
  }

}
