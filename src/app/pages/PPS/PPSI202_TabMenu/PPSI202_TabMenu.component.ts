import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PPSI202DataTransferService } from './PPSI202DataTransferService';

@Component({
  selector: 'app-ppsi202-tab-menu',
  templateUrl: './PPSI202_TabMenu.component.html',
  styleUrls: ['./PPSI202_TabMenu.component.css']
})
export class PPSI202TabMenuComponent implements OnInit, AfterViewInit {

  i202 : HTMLAnchorElement;
  i202NonBar : HTMLAnchorElement;
  selectedPage : string;
  constructor(private router: Router,
              private elementRef : ElementRef,
              private ppsI202DataTransferService : PPSI202DataTransferService) {
  }
 
  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.i202 = this.elementRef.nativeElement.querySelector('#i202');
    this.i202NonBar = this.elementRef.nativeElement.querySelector('#i202NonBar');
    this.i202NonBar.style.color = 'gray';

    if(this.router.url === '/PlanSet/I202_TabMenu'){
      this.router.navigateByUrl("/PlanSet/I202_TabMenu/I202");
    }
    else{
      this.router.navigateByUrl(this.router.url);
    }

    this.ppsI202DataTransferService.getSelectedPage().subscribe(data=>{
      if(data === 'i202'){
        this.i202.style.color = 'dodgerblue';
        this.i202NonBar.style.color = 'gray';
      }
      else{
        this.i202NonBar.style.color = 'dodgerblue';
        this.i202.style.color = 'gray';
      }
  })
  }

}
