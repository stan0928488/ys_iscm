import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { PPSR321DataPassService } from '../PPSR321_DataPass/PPSR321-data-pass.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ppsr321-detail-tab-menu',
  templateUrl: './PPSR321-detail-tab-menu.component.html',
  styleUrls: ['./PPSR321-detail-tab-menu.component.css']
})
export class PPSR321DetailTabMenuComponent implements OnInit, AfterViewInit {


  constructor(private router: Router) { }

  ngAfterViewInit(): void {
    this.router.navigateByUrl("/FCPshiftRepo/R321/detail01");
  }

  ngOnInit(): void {

  }

}
