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

  aElements : HTMLAnchorElement[] = [];

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
   
    this.aElements = this.elementRef.nativeElement.querySelectorAll('#repoList > li > a');

      this.aElements.forEach(aItem =>{
        if(aItem.dataset['selected'] === this.selectedPage){
          aItem.classList.add('active');
        }
      });
  }

  ngOnInit(): void {
  
  }
}
