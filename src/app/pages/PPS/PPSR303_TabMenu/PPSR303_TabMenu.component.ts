import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-PPSR303-Tab-Menu',
  templateUrl: './PPSR303_TabMenu.component.html',
  styleUrls: ['./PPSR303_TabMenu.component.css']
})
export class PPSR303TabMenuComponent implements OnInit {

  constructor(private router: Router) {
    this.router.navigateByUrl("/main/FCPBarRepo/R303_TabMenu/R303");
   }

  ngOnInit(): void {
  }

}
