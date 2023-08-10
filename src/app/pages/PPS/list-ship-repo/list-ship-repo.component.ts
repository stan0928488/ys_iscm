import { Component, Input, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { ListShipRepoDataTransferService } from './ListShipRepoDataTransferService';

@Component({
  selector: 'app-list-ship-repo',
  templateUrl: './list-ship-repo.component.html',
  styleUrls: ['./list-ship-repo.component.scss']
})
export class ListShipRepoComponent implements OnInit, AfterViewInit {

  // 接收R306或R307「這兩個頁面之間要進行參數傳遞的參數(edition)」
  edition : string = undefined;

  // 當前使用者選擇的是哪個頁面
  selectedPage : string = undefined;

  constructor(private listShipRepoDataTransferService:ListShipRepoDataTransferService,
              private elementRef : ElementRef) { 

    this.listShipRepoDataTransferService.getEdition().subscribe((edition) => {
        this.edition = edition as string;
    });

    this.listShipRepoDataTransferService.getSelectedPage().subscribe((selectedPage) => {
      this.selectedPage = selectedPage as string;
    });
  }

  ngAfterViewInit(): void {
   
    const aElements : HTMLAnchorElement[]= this.elementRef.nativeElement.querySelectorAll('#repoList > li > a');
    aElements.forEach(aItem =>{
      if(aItem.dataset['selected'] === this.selectedPage){
        const parentLi : HTMLLIElement = aItem.parentElement as HTMLLIElement;
        parentLi.classList.add('active');
        aItem.classList.add('active');
      }
    });
  }

  ngOnInit(): void {
  
  }
}
